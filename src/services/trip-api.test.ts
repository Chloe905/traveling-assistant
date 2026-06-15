import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { TripDay } from '@/types/models'

const baseTripRow = {
  id: 'trip-1',
  owner_id: 'user-1',
  name: '巴黎',
  date_start: '2026-06-24',
  date_end: '2026-06-30',
  people: 1,
  destination: '巴黎',
  daily_start_time: '09:30',
  daily_end_time: '20:30',
  travel_style: 'balanced',
  days: Array.from({ length: 7 }, (_, index) => ({ id: String(index + 1), spots: [] })),
  candidate_spots: [],
  collaborators: [],
  invite_token: null,
  updated_at: '2026-06-15T00:00:00.000Z'
}

let updatePayload: Record<string, unknown> | null = null

vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(async () => ({
            data: baseTripRow,
            error: null
          }))
        }))
      })),
      update: vi.fn((payload: Record<string, unknown>) => {
        updatePayload = payload

        return {
          eq: vi.fn(() => ({
            select: vi.fn(() => ({
              single: vi.fn(async () => ({
                data: {
                  ...baseTripRow,
                  ...payload,
                  daily_start_time: payload.daily_start_time || baseTripRow.daily_start_time,
                  daily_end_time: payload.daily_end_time || baseTripRow.daily_end_time,
                  travel_style: payload.travel_style || baseTripRow.travel_style,
                  candidate_spots: payload.candidate_spots || baseTripRow.candidate_spots,
                  days: payload.days || baseTripRow.days
                },
                error: null
              }))
            }))
          }))
        }
      })
    }))
  }
}))

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ user: { id: 'user-1', email: 'chloe@example.com', name: 'chloe' } })
}))

describe('tripApi preference itinerary planner', () => {
  beforeEach(() => {
    updatePayload = null
  })

  it('generates a full editable itinerary from travel preferences without existing candidates', async () => {
    const { tripApi } = await import('./trip-api')

    const plan = await tripApi.runAiPlan('trip-1', {
      mode: 'preference',
      destination: '巴黎',
      people: 1,
      adultCount: 1,
      childCount: 0,
      playDays: 7,
      season: 'spring',
      routePreference: 'mixed',
      attractionTypes: ['city', 'shopping'],
      mobilityNeeds: 'none',
      dailyStartTime: '09:30',
      dailyEndTime: '20:30',
      travelStyle: 'balanced'
    })

    expect(plan.provider).toBe('preference-mock')
    expect(plan.days).toHaveLength(7)
    expect(plan.days.every(day => day.spots.length > 0)).toBe(true)
    expect(plan.trip.candidateSpots.length).toBeGreaterThan(0)
    expect(plan.trip.days.flatMap((day: TripDay) => day.spots).every(spot => spot.transportNote && spot.aiReason)).toBe(true)
    expect(updatePayload?.days).toHaveLength(7)
    expect(updatePayload?.candidate_spots).toHaveLength(plan.trip.candidateSpots.length)
  })
})
