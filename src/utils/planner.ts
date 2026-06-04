import type { Spot, TripDay } from '@/types/models'

export const addMinutesToTime = (time: string, minutes: number) => {
  const [hours = 0, mins = 0] = time.split(':').map(Number)
  const date = new Date(2024, 0, 1, hours, mins + minutes)
  return date.toTimeString().slice(0, 5)
}

export const sortSpotsByTime = (spots: Spot[]) => {
  return [...spots].sort((a, b) => a.timeStart.localeCompare(b.timeStart))
}

export const normalizeSpotTime = (spot: Spot) => {
  const durationMinutes = Number(spot.durationMinutes || 0)
  const timeStart = spot.timeStart || spot.time || '09:30'

  return {
    ...spot,
    time: timeStart,
    timeStart,
    timeEnd: addMinutesToTime(timeStart, durationMinutes)
  }
}

export const recalculateSequentialSpots = (spots: Spot[], fallbackStartTime = '09:30') => {
  const baseStartTime = spots[0]?.timeStart || spots[0]?.time || fallbackStartTime

  return spots.reduce<Spot[]>((plannedSpots, spot, index) => {
    const previousSpot = plannedSpots[index - 1]
    const timeStart = index === 0
      ? baseStartTime
      : addMinutesToTime(previousSpot.timeEnd, Number(spot.transportMinutes || 0))
    const durationMinutes = Number(spot.durationMinutes || 0)

    plannedSpots.push({
      ...spot,
      time: timeStart,
      timeStart,
      timeEnd: addMinutesToTime(timeStart, durationMinutes)
    })

    return plannedSpots
  }, [])
}

export const countPlannedSpots = (days: TripDay[]) => {
  return days.reduce((total, day) => total + day.spots.length, 0)
}

export const calculateDayDuration = (day: TripDay) => {
  return day.spots.reduce((total, spot) => total + Number(spot.durationMinutes || 0) + Number(spot.transportMinutes || 0), 0)
}
