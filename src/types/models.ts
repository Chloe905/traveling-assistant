export type SpotPriority = 'must' | 'high' | 'medium' | 'low'

export interface User {
  id: number | string
  email: string
  name: string
}

export interface Collaborator {
  id?: number | string
  guestId?: string
  email?: string
  name: string
  role: 'editor'
  isGuest?: boolean
}

export interface CandidateSpot {
  id: string
  spotName: string
  category: string
  address: string
  durationMinutes: number
  openTime: string
  closeTime: string
  priority: SpotPriority
  notes: string
}

export interface Spot extends CandidateSpot {
  sourceCandidateId?: string
  time: string
  timeStart: string
  timeEnd: string
  transportMinutes: number
  transportNote: string
  aiReason: string
  description?: string
  isFavorite?: boolean
}

export interface TripDay {
  id: string
  spots: Spot[]
}

export interface Trip {
  id: string
  userId: number | string
  ownerId: number | string
  name: string
  dateStart: string
  dateEnd: string
  people: number
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
  banner?: string
  days: TripDay[]
  candidateSpots: CandidateSpot[]
  collaborators: Collaborator[]
  inviteToken?: string
  updatedAt: string
}

export interface TripForm {
  name: string
  dateStart: string
  dateEnd: string
  people: number
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
}

export interface AiPlanRequest {
  destination: string
  dailyStartTime: string
  dailyEndTime: string
  travelStyle: string
  mode?: 'candidate' | 'preference'
  people?: number
  adultCount?: number
  childCount?: number
  playDays?: number
  season?: 'spring' | 'summer' | 'autumn' | 'winter'
  routePreference?: 'classic' | 'hidden' | 'mixed'
  attractionTypes?: string[]
  mobilityNeeds?: string
  specialRequests?: string
}

export interface AiPlanResult {
  provider: 'mock' | 'gemini-ready' | 'preference-mock'
  summary: string
  days: TripDay[]
  trip: Trip
}

export interface InviteLink {
  inviteToken: string
}

export interface InvitePreview {
  token: string
  tripId: string
  tripName: string
  destination: string
  dateStart: string
  dateEnd: string
  people: number
  ownerId: number | string
}

export interface AcceptInviteResult {
  tripId: string
  collaborators: Collaborator[]
  collaborator: Collaborator
}
