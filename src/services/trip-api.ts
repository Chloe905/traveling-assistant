import { v4 as uuid } from 'uuid'
import { supabase } from './supabase'
import { useAuthStore } from '@/stores/auth'
import type {
  AcceptInviteResult,
  AiPlanRequest,
  AiPlanResult,
  CandidateSpot,
  Collaborator,
  InviteLink,
  InvitePreview,
  Spot,
  SpotPriority,
  Trip,
  TripDay,
  TripForm
} from '@/types/models'
import { addMinutesToTime } from '@/utils/planner'

interface TripRow {
  id: string
  owner_id: string
  name: string
  date_start: string
  date_end: string
  people: number
  destination: string
  daily_start_time: string
  daily_end_time: string
  travel_style: string
  days: TripDay[]
  candidate_spots: CandidateSpot[]
  collaborators: Collaborator[]
  invite_token: string | null
  updated_at: string
}

interface ProfileRow {
  id: string
  email: string
  name: string
}

const priorityRank: Record<SpotPriority, number> = {
  must: 0,
  high: 1,
  medium: 2,
  low: 3
}

const getCurrentUser = () => useAuthStore().user

const getDayCount = (dateStart: string, dateEnd: string) => {
  const start = new Date(dateStart).getTime()
  const end = new Date(dateEnd).getTime()

  if (Number.isNaN(start) || Number.isNaN(end)) return 1

  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
}

const createDaysForTrip = (payload: Pick<TripForm, 'dateStart' | 'dateEnd'>) => (
  Array.from({ length: getDayCount(payload.dateStart, payload.dateEnd) }, (_, index) => ({
    id: String(index + 1),
    spots: []
  }))
)

const toTrip = (row: TripRow): Trip => ({
  id: row.id,
  userId: row.owner_id,
  ownerId: row.owner_id,
  name: row.name,
  dateStart: row.date_start,
  dateEnd: row.date_end,
  people: row.people,
  destination: row.destination,
  dailyStartTime: row.daily_start_time,
  dailyEndTime: row.daily_end_time,
  travelStyle: row.travel_style,
  days: row.days || [],
  candidateSpots: row.candidate_spots || [],
  collaborators: row.collaborators || [],
  inviteToken: row.invite_token || undefined,
  updatedAt: row.updated_at
})

const toTripRowPatch = (payload: Partial<Trip>) => ({
  ...(payload.name !== undefined && { name: payload.name }),
  ...(payload.dateStart !== undefined && { date_start: payload.dateStart }),
  ...(payload.dateEnd !== undefined && { date_end: payload.dateEnd }),
  ...(payload.people !== undefined && { people: payload.people }),
  ...(payload.destination !== undefined && { destination: payload.destination }),
  ...(payload.dailyStartTime !== undefined && { daily_start_time: payload.dailyStartTime }),
  ...(payload.dailyEndTime !== undefined && { daily_end_time: payload.dailyEndTime }),
  ...(payload.travelStyle !== undefined && { travel_style: payload.travelStyle }),
  ...(payload.days !== undefined && { days: payload.days }),
  ...(payload.candidateSpots !== undefined && { candidate_spots: payload.candidateSpots }),
  ...(payload.collaborators !== undefined && { collaborators: payload.collaborators }),
  ...(payload.inviteToken !== undefined && { invite_token: payload.inviteToken }),
  updated_at: new Date().toISOString()
})

const throwIfError = (error: unknown) => {
  if (error) {
    throw error
  }
}

const buildMockPlan = (trip: Trip, payload: AiPlanRequest): AiPlanResult => {
  const days: TripDay[] = trip.days.length
    ? trip.days.map(day => ({ ...day, spots: [...day.spots] }))
    : createDaysForTrip(trip)
  const plannedCandidateIds = new Set(
    days.flatMap(day => day.spots.map(spot => spot.sourceCandidateId || spot.id))
  )
  const sortedCandidates = [...trip.candidateSpots]
    .filter(candidate => !plannedCandidateIds.has(candidate.id))
    .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
  let dayIndex = 0

  sortedCandidates.forEach(candidate => {
    let day = days[dayIndex] || days[days.length - 1]
    const previousSpot = day.spots.at(-1)
    const transportMinutes = previousSpot ? 25 : 0
    let timeStart = previousSpot
      ? addMinutesToTime(previousSpot.timeEnd, transportMinutes)
      : payload.dailyStartTime || trip.dailyStartTime
    let timeEnd = addMinutesToTime(timeStart, Number(candidate.durationMinutes) || 90)

    if (previousSpot && timeEnd > (payload.dailyEndTime || trip.dailyEndTime) && dayIndex < days.length - 1) {
      dayIndex += 1
      day = days[dayIndex]
      timeStart = payload.dailyStartTime || trip.dailyStartTime
      timeEnd = addMinutesToTime(timeStart, Number(candidate.durationMinutes) || 90)
    }

    const plannedSpot: Spot = {
      ...candidate,
      id: uuid(),
      sourceCandidateId: candidate.id,
      time: timeStart,
      timeStart,
      timeEnd,
      transportMinutes: day.spots.length ? transportMinutes : 0,
      transportNote: day.spots.length
        ? `AI 估算約 ${transportMinutes} 分鐘，可手動改成電車、步行或計程車。`
        : '今日第一站，請依住宿位置確認出發交通。',
      aiReason: candidate.priority === 'must' ? '必去景點優先安排。' : '依優先級與停留時間安排。'
    }

    day.spots.push(plannedSpot)
  })

  const plannedTrip = {
    ...trip,
    ...payload,
    days
  }

  return {
    provider: 'mock',
    summary: '已依候選景點、優先級與每日時間產生可手動調整的行程草案。',
    days,
    trip: plannedTrip
  }
}

export const tripApi = {
  async fetchTrips() {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('updated_at', { ascending: false })

    throwIfError(error)
    return (data || []).map(row => toTrip(row as TripRow))
  },

  async fetchTrip(id: string) {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', id)
      .single()

    throwIfError(error)
    return toTrip(data as TripRow)
  },

  async createTrip(payload: TripForm) {
    const user = getCurrentUser()

    if (!user) {
      throw new Error('User is required')
    }

    const { data, error } = await supabase
      .from('trips')
      .insert({
        owner_id: user.id,
        name: payload.name,
        date_start: payload.dateStart,
        date_end: payload.dateEnd,
        people: payload.people,
        destination: payload.destination,
        daily_start_time: payload.dailyStartTime,
        daily_end_time: payload.dailyEndTime,
        travel_style: payload.travelStyle,
        days: createDaysForTrip(payload),
        candidate_spots: [],
        collaborators: []
      })
      .select()
      .single()

    throwIfError(error)
    return toTrip(data as TripRow)
  },

  async updateTrip(id: string, payload: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update(toTripRowPatch(payload))
      .eq('id', id)
      .select()
      .single()

    throwIfError(error)
    return toTrip(data as TripRow)
  },

  async deleteTrip(id: string) {
    const { error } = await supabase.from('trips').delete().eq('id', id)
    throwIfError(error)
  },

  async addCandidate(tripId: string, payload: Omit<CandidateSpot, 'id'>) {
    const trip = await this.fetchTrip(tripId)
    const candidate = {
      id: uuid(),
      ...payload
    }
    await this.updateTrip(tripId, {
      candidateSpots: [...trip.candidateSpots, candidate]
    })
    return candidate
  },

  async updateCandidate(tripId: string, spotId: string, payload: CandidateSpot) {
    const trip = await this.fetchTrip(tripId)
    const candidateSpots = trip.candidateSpots.map(spot => (spot.id === spotId ? { ...payload, id: spot.id } : spot))
    const candidate = candidateSpots.find(spot => spot.id === spotId)

    if (!candidate) {
      throw new Error('Candidate not found')
    }

    await this.updateTrip(tripId, { candidateSpots })
    return candidate
  },

  async deleteCandidate(tripId: string, spotId: string) {
    const trip = await this.fetchTrip(tripId)
    await this.updateTrip(tripId, {
      candidateSpots: trip.candidateSpots.filter(spot => spot.id !== spotId)
    })
  },

  async runAiPlan(tripId: string, payload: AiPlanRequest) {
    const trip = await this.fetchTrip(tripId)
    const plan = buildMockPlan(trip, payload)
    const updatedTrip = await this.updateTrip(tripId, {
      ...payload,
      days: plan.days
    })

    return {
      ...plan,
      trip: updatedTrip
    }
  },

  async addCollaborator(tripId: string, email: string) {
    const trip = await this.fetchTrip(tripId)
    const { data, error } = await supabase
      .from('profiles')
      .select('id,email,name')
      .eq('email', email)
      .single()

    throwIfError(error)

    const profile = data as ProfileRow
    const collaborator: Collaborator = {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      role: 'editor'
    }
    const collaborators = trip.collaborators.some(member => member.email === email)
      ? trip.collaborators
      : [...trip.collaborators, collaborator]

    await this.updateTrip(tripId, { collaborators })
    return collaborators
  },

  async createInviteLink(tripId: string): Promise<InviteLink> {
    const trip = await this.fetchTrip(tripId)
    const inviteToken = trip.inviteToken || uuid()
    await this.updateTrip(tripId, { inviteToken })
    return { inviteToken }
  },

  async fetchInvite(token: string): Promise<InvitePreview> {
    const { data, error } = await supabase
      .rpc('get_invite_preview', { invite_token_input: token })

    throwIfError(error)

    const row = data?.[0] as {
      token: string
      trip_id: string
      trip_name: string
      destination: string
      date_start: string
      date_end: string
      people: number
      owner_id: string
    } | undefined

    if (!row) {
      throw new Error('Invite link not found')
    }

    return {
      token,
      tripId: row.trip_id,
      tripName: row.trip_name,
      destination: row.destination,
      dateStart: row.date_start,
      dateEnd: row.date_end,
      people: row.people,
      ownerId: row.owner_id
    }
  },

  async acceptInvite(token: string, payload: { guestName?: string; guestId?: string } = {}): Promise<AcceptInviteResult> {
    const user = getCurrentUser()

    if (!user?.email && payload.guestName) {
      const { error } = await supabase.auth.signInAnonymously({
        options: {
          data: {
            name: payload.guestName
          }
        }
      })

      throwIfError(error)
    }

    const { data, error } = await supabase.rpc('accept_trip_invite', {
      invite_token_input: token,
      guest_name: payload.guestName || null
    })

    throwIfError(error)
    return data as AcceptInviteResult
  }
}
