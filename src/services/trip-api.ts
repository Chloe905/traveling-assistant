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

interface GuideSpot {
  name: string
  category: string
  zone: string
  duration: number
  types: string[]
  seasons: string[]
  route: 'classic' | 'hidden' | 'mixed'
  priority: SpotPriority
}

const destinationGuides: Record<string, GuideSpot[]> = {
  paris: [
    { name: '艾菲爾鐵塔與戰神廣場', category: 'sightseeing', zone: '7區鐵塔周邊', duration: 110, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'must' },
    { name: '塞納河遊船與左岸散步', category: 'sightseeing', zone: '塞納河左岸', duration: 90, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'classic', priority: 'high' },
    { name: '羅浮宮精華參觀', category: 'museum', zone: '1區羅浮宮', duration: 150, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'must' },
    { name: '杜樂麗花園與橘園美術館', category: 'museum', zone: '1區杜樂麗', duration: 110, types: ['forest', 'city', 'senior'], seasons: ['spring', 'autumn', 'winter'], route: 'mixed', priority: 'high' },
    { name: '奧賽美術館與聖日耳曼咖啡散步', category: 'museum', zone: '7區左岸', duration: 140, types: ['city', 'shopping', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
    { name: '蒙馬特、聖心堂與小丘街景', category: 'sightseeing', zone: '18區蒙馬特', duration: 130, types: ['city', 'shopping'], seasons: ['spring', 'summer', 'autumn'], route: 'classic', priority: 'high' },
    { name: '瑪黑區選物店與孚日廣場', category: 'shopping', zone: '3-4區瑪黑', duration: 130, types: ['shopping', 'city', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'mixed', priority: 'high' },
    { name: '聖禮拜堂、巴黎古監獄與西堤島', category: 'sightseeing', zone: '西堤島', duration: 120, types: ['city', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
    { name: '巴黎歌劇院與老佛爺百貨屋頂', category: 'shopping', zone: '9區歌劇院', duration: 120, types: ['shopping', 'city', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
    { name: '香榭麗舍大道與凱旋門', category: 'sightseeing', zone: '8區香榭麗舍', duration: 100, types: ['shopping', 'city', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
    { name: '聖馬丁運河與在地咖啡小店', category: 'food', zone: '10區聖馬丁運河', duration: 110, types: ['city', 'shopping'], seasons: ['spring', 'summer', 'autumn'], route: 'hidden', priority: 'medium' },
    { name: '巴士底市場與阿里格市集', category: 'food', zone: '11-12區巴士底', duration: 100, types: ['shopping', 'city'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'hidden', priority: 'medium' },
    { name: '貝爾維爾街區與街頭藝術散步', category: 'sightseeing', zone: '20區貝爾維爾', duration: 105, types: ['city'], seasons: ['spring', 'summer', 'autumn'], route: 'hidden', priority: 'medium' },
    { name: '拉雪茲神父公墓與安靜街區', category: 'sightseeing', zone: '20區拉雪茲', duration: 90, types: ['forest', 'city'], seasons: ['spring', 'autumn'], route: 'hidden', priority: 'medium' },
    { name: '凡爾賽宮與花園半日遊', category: 'sightseeing', zone: '凡爾賽', duration: 240, types: ['city', 'forest', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'classic', priority: 'high' },
    { name: '盧森堡公園與拉丁區書店', category: 'sightseeing', zone: '5-6區拉丁區', duration: 115, types: ['forest', 'shopping', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' }
  ]
}

const genericGuide: GuideSpot[] = [
  { name: '城市代表地標與歷史街區', category: 'sightseeing', zone: '市中心', duration: 110, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'must' },
  { name: '熱門博物館或文化展館', category: 'museum', zone: '文化區', duration: 120, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
  { name: '主要商圈與在地選物店', category: 'shopping', zone: '商圈區', duration: 110, types: ['shopping', 'city'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'mixed', priority: 'high' },
  { name: '森林公園與自然散步', category: 'sightseeing', zone: '森林區', duration: 100, types: ['forest', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' },
  { name: '在地市場與小吃街', category: 'food', zone: '市場區', duration: 95, types: ['shopping', 'city'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'hidden', priority: 'medium' }
]

const clampNumber = (value: number | undefined, fallback: number, min: number, max: number) => (
  Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : fallback))
)

const getDestinationGuide = (destination: string) => {
  const normalized = destination.toLowerCase()
  if (normalized.includes('paris') || normalized.includes('巴黎')) return destinationGuides.paris
  return genericGuide.map(spot => ({ ...spot, name: `${destination}${spot.name}` }))
}

const scoreGuideSpot = (spot: GuideSpot, payload: AiPlanRequest, childCount: number) => {
  const attractionTypes = payload.attractionTypes?.length ? payload.attractionTypes : ['city', 'shopping']
  const routePreference = payload.routePreference || 'mixed'
  const routeScore = routePreference === 'classic'
    ? (spot.route === 'classic' ? 5 : spot.route === 'mixed' ? 2 : 0)
    : routePreference === 'hidden'
      ? (spot.route === 'hidden' ? 5 : spot.route === 'mixed' ? 3 : 1)
      : (spot.route === 'mixed' ? 4 : 3)
  const typeScore = spot.types.some(type => attractionTypes.includes(type)) ? 4 : 0
  const seasonScore = payload.season && spot.seasons.includes(payload.season) ? 3 : 0
  const audienceScore = (childCount > 0 && spot.types.includes('family') ? 2 : 0) + (payload.mobilityNeeds === 'senior' && spot.types.includes('senior') ? 2 : 0)

  return routeScore + typeScore + seasonScore + audienceScore + priorityRank[spot.priority]
}

const getPreferenceSpotCount = (travelStyle: string, mobilityNeeds?: string) => {
  if (mobilityNeeds === 'senior' || mobilityNeeds === 'kids') return 2
  if (travelStyle === 'packed') return 4
  if (travelStyle === 'relaxed') return 2
  return 3
}

const getPreferenceTransportMinutes = (previousSpot: (Spot & { zone?: string }) | undefined, nextSpot: CandidateSpot & { zone?: string }, travelStyle: string) => {
  if (!previousSpot) return 0
  if (previousSpot.zone && previousSpot.zone === nextSpot.zone) return travelStyle === 'packed' ? 12 : 15
  return travelStyle === 'relaxed' ? 35 : 25
}

const buildPreferencePlan = (trip: Trip, payload: AiPlanRequest): AiPlanResult => {
  const playDays = clampNumber(payload.playDays, trip.days.length || 3, 1, 14)
  const people = clampNumber(payload.people, trip.people || 2, 1, 30)
  const adultCount = clampNumber(payload.adultCount, people, 0, people)
  const childCount = clampNumber(payload.childCount, Math.max(0, people - adultCount), 0, people)
  const travelStyle = payload.travelStyle || trip.travelStyle
  const spotsPerDay = getPreferenceSpotCount(travelStyle, payload.mobilityNeeds)
  const neededSpotCount = playDays * spotsPerDay
  const guide = getDestinationGuide(payload.destination || trip.destination)
  const selectedSpots = [...guide]
    .map((spot, index) => ({ spot, index, score: scoreGuideSpot(spot, payload, childCount) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
  const generatedCandidates = Array.from({ length: neededSpotCount }, (_, index) => {
    const template = selectedSpots[index % selectedSpots.length].spot
    const dayHint = Math.floor(index / spotsPerDay) + 1

    return {
      id: uuid(),
      spotName: template.name,
      category: template.category,
      address: template.zone,
      zone: template.zone,
      durationMinutes: payload.mobilityNeeds === 'senior' ? Math.min(template.duration, 90) : template.duration,
      openTime: '09:00',
      closeTime: '21:00',
      priority: template.priority,
      notes: `依偏好自動推薦：第 ${dayHint} 天安排在${template.zone}。${payload.specialRequests ? `使用者補充：${payload.specialRequests}` : ''}`
    }
  })

  const days: TripDay[] = Array.from({ length: playDays }, (_, dayIndex) => {
    const spotsForDay = generatedCandidates.slice(dayIndex * spotsPerDay, (dayIndex + 1) * spotsPerDay)
    const spots = spotsForDay.reduce<Array<Spot & { zone?: string }>>((plannedSpots, candidate) => {
      const previousSpot = plannedSpots.at(-1)
      const transportMinutes = getPreferenceTransportMinutes(previousSpot, candidate, travelStyle)
      const timeStart = previousSpot ? addMinutesToTime(previousSpot.timeEnd, transportMinutes) : payload.dailyStartTime || trip.dailyStartTime
      const timeEnd = addMinutesToTime(timeStart, Number(candidate.durationMinutes) || 90)

      plannedSpots.push({
        ...candidate,
        id: uuid(),
        sourceCandidateId: candidate.id,
        time: timeStart,
        timeStart,
        timeEnd,
        transportMinutes,
        transportNote: previousSpot
          ? `依區域估算從「${previousSpot.address}」到「${candidate.address}」約 ${transportMinutes} 分鐘，可再依地鐵、步行或計程車調整。`
          : '今日第一站，建議依住宿位置選擇最近交通方式出發。',
        aiReason: `根據 ${people} 人、${adultCount} 位大人、${childCount} 位小孩、${payload.season || 'spring'} 季節、${payload.routePreference || 'mixed'} 路線與 ${travelStyle} 節奏安排。`
      })

      return plannedSpots
    }, [])

    return {
      id: String(dayIndex + 1),
      spots: spots.map(({ zone: _zone, ...spot }) => spot)
    }
  })

  const candidateSpots = generatedCandidates.map(({ zone: _zone, ...candidate }) => candidate)
  const plannedTrip = {
    ...trip,
    ...payload,
    people,
    candidateSpots,
    days
  }

  return {
    provider: 'preference-mock',
    summary: `已依${payload.season || 'spring'}季節、${payload.routePreference || 'mixed'}路線與旅遊偏好產生 ${playDays} 天行程草案。`,
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
    const plan = payload.mode === 'preference'
      ? buildPreferencePlan(trip, payload)
      : buildMockPlan(trip, payload)

    if (payload.mode === 'preference') {
      this.updateTrip(tripId, {
        destination: payload.destination,
        people: plan.trip.people,
        dailyStartTime: payload.dailyStartTime,
        dailyEndTime: payload.dailyEndTime,
        travelStyle: payload.travelStyle,
        candidateSpots: plan.trip.candidateSpots,
        days: plan.days
      }).catch(error => {
        console.warn('AI preference plan was generated locally but could not be persisted.', error)
      })

      return plan
    }

    try {
      const updatedTrip = await this.updateTrip(tripId, {
        ...payload,
        candidateSpots: plan.trip.candidateSpots,
        days: plan.days
      })

      return {
        ...plan,
        trip: updatedTrip
      }
    } catch (error) {
      throw error
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
