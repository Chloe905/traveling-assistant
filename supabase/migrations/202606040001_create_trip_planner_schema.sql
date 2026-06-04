create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  name text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  date_start date not null,
  date_end date not null,
  people integer not null default 1 check (people > 0),
  destination text not null,
  daily_start_time text not null default '09:30',
  daily_end_time text not null default '20:30',
  travel_style text not null default 'balanced',
  days jsonb not null default '[]'::jsonb,
  candidate_spots jsonb not null default '[]'::jsonb,
  collaborators jsonb not null default '[]'::jsonb,
  invite_token uuid unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_trips_updated_at on public.trips;
create trigger set_trips_updated_at
before update on public.trips
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    coalesce(new.email, new.id::text || '@guest.local'),
    coalesce(new.raw_user_meta_data->>'name', split_part(coalesce(new.email, 'guest'), '@', 1))
  )
  on conflict (id) do update
  set email = excluded.email,
      name = excluded.name;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.is_trip_collaborator(member_list jsonb)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from jsonb_array_elements(coalesce(member_list, '[]'::jsonb)) as member
    where member->>'id' = auth.uid()::text
       or (auth.jwt()->>'email' is not null and member->>'email' = auth.jwt()->>'email')
  );
$$;

create or replace function public.get_invite_preview(invite_token_input uuid)
returns table (
  token uuid,
  trip_id uuid,
  trip_name text,
  destination text,
  date_start date,
  date_end date,
  people integer,
  owner_id uuid
)
language sql
security definer
set search_path = public
as $$
  select
    trips.invite_token as token,
    trips.id as trip_id,
    trips.name as trip_name,
    trips.destination,
    trips.date_start,
    trips.date_end,
    trips.people,
    trips.owner_id
  from public.trips
  where trips.invite_token = invite_token_input;
$$;

create or replace function public.accept_trip_invite(invite_token_input uuid, guest_name text default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_trip public.trips;
  current_profile public.profiles;
  next_collaborator jsonb;
  next_collaborators jsonb;
begin
  if auth.uid() is null then
    raise exception 'Authentication is required to accept an invite';
  end if;

  select * into target_trip
  from public.trips
  where invite_token = invite_token_input;

  if target_trip.id is null then
    raise exception 'Invite link not found';
  end if;

  select * into current_profile
  from public.profiles
  where id = auth.uid();

  if current_profile.id is null then
    insert into public.profiles (id, email, name)
    values (
      auth.uid(),
      coalesce(auth.jwt()->>'email', auth.uid()::text || '@guest.local'),
      coalesce(guest_name, auth.jwt()->>'email', '訪客旅伴')
    )
    returning * into current_profile;
  end if;

  next_collaborator = jsonb_build_object(
    'id', current_profile.id,
    'email', current_profile.email,
    'name', coalesce(guest_name, current_profile.name),
    'role', 'editor',
    'isGuest', current_profile.email like '%@guest.local'
  );

  if target_trip.owner_id = auth.uid() or public.is_trip_collaborator(target_trip.collaborators) then
    next_collaborators = target_trip.collaborators;
  else
    next_collaborators = target_trip.collaborators || jsonb_build_array(next_collaborator);
  end if;

  update public.trips
  set collaborators = next_collaborators
  where id = target_trip.id
  returning * into target_trip;

  return jsonb_build_object(
    'tripId', target_trip.id,
    'collaborators', target_trip.collaborators,
    'collaborator', next_collaborator
  );
end;
$$;

alter table public.profiles enable row level security;
alter table public.trips enable row level security;

drop policy if exists profiles_select_authenticated on public.profiles;
create policy profiles_select_authenticated
on public.profiles
for select
to authenticated
using (true);

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists trips_select_owner_or_collaborator on public.trips;
create policy trips_select_owner_or_collaborator
on public.trips
for select
to authenticated
using (owner_id = auth.uid() or public.is_trip_collaborator(collaborators));

drop policy if exists trips_insert_owner on public.trips;
create policy trips_insert_owner
on public.trips
for insert
to authenticated
with check (owner_id = auth.uid());

drop policy if exists trips_update_owner_or_collaborator on public.trips;
create policy trips_update_owner_or_collaborator
on public.trips
for update
to authenticated
using (owner_id = auth.uid() or public.is_trip_collaborator(collaborators))
with check (owner_id = auth.uid() or public.is_trip_collaborator(collaborators));

drop policy if exists trips_delete_owner on public.trips;
create policy trips_delete_owner
on public.trips
for delete
to authenticated
using (owner_id = auth.uid());

grant execute on function public.get_invite_preview(uuid) to anon, authenticated;
grant execute on function public.accept_trip_invite(uuid, text) to authenticated;
