import { describe, expect, it } from 'vitest'
import {
  addMinutesToTime,
  calculateDayDuration,
  countPlannedSpots,
  normalizeSpotTime,
  recalculateSequentialSpots,
  sortSpotsByTime
} from './planner'
import type { Spot, TripDay } from '@/types/models'

const createSpot = (id: string, timeStart: string, durationMinutes = 60, transportMinutes = 10): Spot => ({
  id,
  spotName: `Spot ${id}`,
  category: 'sightseeing',
  address: 'Kyoto',
  durationMinutes,
  openTime: '09:00',
  closeTime: '21:00',
  priority: 'medium',
  notes: '',
  time: timeStart,
  timeStart,
  timeEnd: '10:00',
  transportMinutes,
  transportNote: '',
  aiReason: ''
})

describe('planner utilities', () => {
  it('sorts spots by start time', () => {
    const spots = [createSpot('2', '14:00'), createSpot('1', '09:30'), createSpot('3', '11:00')]

    expect(sortSpotsByTime(spots).map(spot => spot.id)).toEqual(['1', '3', '2'])
  })

  it('counts planned spots across days', () => {
    const days: TripDay[] = [
      { id: '1', spots: [createSpot('1', '09:30')] },
      { id: '2', spots: [createSpot('2', '10:00'), createSpot('3', '13:00')] }
    ]

    expect(countPlannedSpots(days)).toBe(3)
  })

  it('calculates day duration with transportation time', () => {
    const day: TripDay = {
      id: '1',
      spots: [createSpot('1', '09:30', 90, 0), createSpot('2', '13:00', 60, 25)]
    }

    expect(calculateDayDuration(day)).toBe(175)
  })

  it('calculates end time from start time and duration', () => {
    const spot = createSpot('1', '13:30', 90, 0)

    expect(addMinutesToTime('13:30', 90)).toBe('15:00')
    expect(normalizeSpotTime(spot).timeEnd).toBe('15:00')
  })

  it('recalculates sequential spots after manual reordering', () => {
    const spots = [
      createSpot('2', '11:30', 60, 30),
      createSpot('1', '09:30', 90, 0)
    ]

    expect(recalculateSequentialSpots(spots, '09:30').map(spot => `${spot.id}:${spot.timeStart}-${spot.timeEnd}`)).toEqual([
      '2:11:30-12:30',
      '1:12:30-14:00'
    ])
  })
})
