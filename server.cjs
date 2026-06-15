const jsonServer = require('json-server')
const auth = require('json-server-auth')
const path = require('path')
const dotenv = require('dotenv')
const { v4: uuid } = require('uuid')
const authenticateToken = require('./authMiddleware.cjs')

dotenv.config()

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const PORT = process.env.PORT || 4000

const rules = auth.rewriter({
  users: 600
})

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(rules)
server.use(auth)
server.db = router.db
server.use(authenticateToken)
server.use((req, _res, next) => {
  if (req.url.startsWith('/660/trips')) {
    req.url = req.url.replace(/^\/660\/trips/, '/trips')
  }

  next()
})

const getUserId = req => Number.parseInt(req.user?.sub, 10)

const getUserByEmail = email => {
  if (!email) return null
  return router.db.get('users').find({ email }).value()
}

const getTripByInviteToken = token => {
  if (!token) return null
  return router.db.get('trips').find({ inviteToken: token }).value()
}

const canAccessTrip = (trip, userId, userEmail, guestId) => {
  if (!trip) return false
  const ownerId = trip.ownerId || trip.userId
  const collaborators = trip.collaborators || []
  return ownerId === userId || collaborators.some(member => member.email === userEmail || member.guestId === guestId)
}

const getCollaboratorKey = member => member.email || member.guestId

const appendCollaborator = (trip, collaborator) => {
  const collaborators = trip.collaborators || []
  const collaboratorKey = getCollaboratorKey(collaborator)
  const nextCollaborators = collaborators.some(member => getCollaboratorKey(member) === collaboratorKey)
    ? collaborators
    : [...collaborators, collaborator]

  router.db.get('trips').find({ id: trip.id }).assign({
    collaborators: nextCollaborators,
    updatedAt: new Date().toISOString()
  }).write()

  return nextCollaborators
}

const findTripForRequest = (req, res) => {
  const userId = getUserId(req)
  const user = router.db.get('users').find({ id: userId }).value()
  const trip = router.db.get('trips').find({ id: req.params.id }).value()

  if (!trip || !canAccessTrip(trip, userId, user?.email, req.user?.guestId)) {
    res.status(404).json({ error: 'Trip not found' })
    return null
  }

  return trip
}

const normalizeTrip = trip => ({
  candidateSpots: [],
  collaborators: [],
  days: [],
  ownerId: trip.userId,
  updatedAt: new Date().toISOString(),
  ...trip
})

const getDayCount = (dateStart, dateEnd) => {
  if (!dateStart || !dateEnd) return 1
  const start = new Date(dateStart).getTime()
  const end = new Date(dateEnd).getTime()
  if (Number.isNaN(start) || Number.isNaN(end)) return 1
  return Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
}

const createDaysForTrip = trip => {
  const dayCount = getDayCount(trip.dateStart, trip.dateEnd)
  const existingDays = trip.days || []
  return Array.from({ length: dayCount }, (_, index) => {
    const id = String(index + 1)
    return existingDays.find(day => day.id === id) || { id, spots: [] }
  })
}

const addMinutes = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const date = new Date(2024, 0, 1, hours, mins + minutes)
  return date.toTimeString().slice(0, 5)
}

const toMinutes = time => {
  const [hours = 0, mins = 0] = String(time || '00:00').split(':').map(Number)
  return hours * 60 + mins
}

const buildMockPlan = trip => {
  const dayCount = Math.max(1, trip.days?.length || 1)
  const sortedCandidates = [...(trip.candidateSpots || [])].sort((a, b) => {
    const priorityRank = { must: 0, high: 1, medium: 2, low: 3 }
    return (priorityRank[a.priority] ?? 2) - (priorityRank[b.priority] ?? 2)
  })

  const days = Array.from({ length: dayCount }, (_, index) => ({
    id: String(index + 1),
    spots: []
  }))

  let dayIndex = 0

  sortedCandidates.forEach(spot => {
    let day = days[dayIndex] || days[days.length - 1]
    const previousSpot = day.spots.at(-1)
    const travelMinutes = previousSpot ? 25 : 0
    let startTime = previousSpot
      ? addMinutes(previousSpot.timeEnd || previousSpot.time, travelMinutes)
      : trip.dailyStartTime || '09:30'
    const durationMinutes = Number(spot.durationMinutes) || 90
    let timeEnd = addMinutes(startTime, durationMinutes)

    if (previousSpot && toMinutes(timeEnd) > toMinutes(trip.dailyEndTime || '20:30') && dayIndex < days.length - 1) {
      dayIndex += 1
      day = days[dayIndex]
      startTime = trip.dailyStartTime || '09:30'
      timeEnd = addMinutes(startTime, durationMinutes)
    }

    const plannedSpot = {
      ...spot,
      id: uuid(),
      sourceCandidateId: spot.id,
      time: startTime,
      timeStart: startTime,
      timeEnd,
      transportMinutes: day.spots.length ? travelMinutes : 0,
      transportNote: day.spots.length
        ? `AI 估算約 ${travelMinutes} 分鐘，建議依地址區域選擇步行、大眾運輸或計程車。`
        : '今日第一站，請依住宿位置自行確認出發交通。',
      aiReason: `${spot.priority === 'must' ? '必去景點優先安排。' : '依停留時間與行程節奏排序。'}`
    }

    day.spots.push(plannedSpot)
  })

  return {
    provider: process.env.GEMINI_API_KEY ? 'gemini-ready' : 'mock',
    summary: '已依優先級、停留時間與每日節奏產生可手動調整的行程草案。',
    days
  }
}

const clampNumber = (value, fallback, min, max) => {
  const number = Number(value)
  if (Number.isNaN(number)) return fallback
  return Math.min(max, Math.max(min, number))
}

const destinationGuides = {
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
    { name: '盧森堡公園與拉丁區書店', category: 'sightseeing', zone: '5-6區拉丁區', duration: 115, types: ['forest', 'shopping', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' },
    { name: '龐畢度中心與雷阿爾商圈', category: 'museum', zone: '4區龐畢度', duration: 120, types: ['city', 'shopping', 'family'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'mixed', priority: 'medium' },
    { name: '巴黎地下墓穴或蒙帕納斯觀景', category: 'sightseeing', zone: '14區蒙帕納斯', duration: 105, types: ['city'], seasons: ['summer', 'winter'], route: 'hidden', priority: 'medium' },
    { name: '布洛涅森林與路易威登基金會', category: 'museum', zone: '16區布洛涅', duration: 150, types: ['forest', 'city', 'family'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' },
    { name: '巴黎迪士尼一日選配', category: 'sightseeing', zone: '馬恩拉瓦萊', duration: 360, types: ['family'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'medium' }
  ]
}

const genericGuideTemplates = [
  { name: '城市代表地標與歷史街區', category: 'sightseeing', zone: '市中心', duration: 110, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'must' },
  { name: '熱門博物館或文化展館', category: 'museum', zone: '文化區', duration: 120, types: ['city', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'classic', priority: 'high' },
  { name: '主要商圈與在地選物店', category: 'shopping', zone: '商圈區', duration: 110, types: ['shopping', 'city'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'mixed', priority: 'high' },
  { name: '森林公園與自然散步', category: 'sightseeing', zone: '森林區', duration: 100, types: ['forest', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' },
  { name: '郊區山景或觀景步道', category: 'sightseeing', zone: '山景區', duration: 140, types: ['mountain', 'forest'], seasons: ['spring', 'summer', 'autumn'], route: 'hidden', priority: 'medium' },
  { name: '海岸散步與港邊餐廳', category: 'food', zone: '海岸區', duration: 110, types: ['beach', 'family', 'senior'], seasons: ['spring', 'summer', 'autumn'], route: 'mixed', priority: 'medium' },
  { name: '雪景體驗與暖湯休息', category: 'sightseeing', zone: '雪景區', duration: 130, types: ['snow', 'family'], seasons: ['winter'], route: 'mixed', priority: 'medium' },
  { name: '在地市場與小吃街', category: 'food', zone: '市場區', duration: 95, types: ['shopping', 'city'], seasons: ['spring', 'summer', 'autumn', 'winter'], route: 'hidden', priority: 'medium' }
]

const getPreferenceSpotCount = (travelStyle, mobilityNeeds) => {
  if (mobilityNeeds === 'senior' || mobilityNeeds === 'kids') return 2
  if (travelStyle === 'packed') return 4
  if (travelStyle === 'relaxed') return 2
  return 3
}

const getPreferenceTransportMinutes = (previousSpot, nextSpot, travelStyle) => {
  if (!previousSpot) return 0
  if (previousSpot.zone === nextSpot.zone) return travelStyle === 'packed' ? 12 : 15
  return travelStyle === 'relaxed' ? 35 : 25
}

const getPreferencePriority = (index, mobilityNeeds) => {
  if (index === 0) return 'must'
  if (mobilityNeeds === 'kids' || mobilityNeeds === 'senior') return index < 3 ? 'high' : 'medium'
  return index < 4 ? 'high' : 'medium'
}

const getGuideKey = destination => {
  const normalized = String(destination || '').toLowerCase()
  if (normalized.includes('paris') || normalized.includes('巴黎')) return 'paris'
  return 'generic'
}

const getDestinationGuide = destination => {
  const guideKey = getGuideKey(destination)
  if (guideKey === 'paris') return destinationGuides.paris
  return genericGuideTemplates.map(item => ({
    ...item,
    name: `${destination}${item.name}`
  }))
}

const getRouteScore = (spot, routePreference) => {
  if (routePreference === 'classic') {
    return spot.route === 'classic' ? 5 : spot.route === 'mixed' ? 2 : 0
  }
  if (routePreference === 'hidden') {
    return spot.route === 'hidden' ? 5 : spot.route === 'mixed' ? 3 : 1
  }
  return spot.route === 'mixed' ? 4 : 3
}

const getSeasonScore = (spot, season) => {
  if (!season || !spot.seasons?.length) return 1
  return spot.seasons.includes(season) ? 3 : 0
}

const getTypeScore = (spot, attractionTypes) => {
  if (!attractionTypes.length) return 1
  return spot.types?.some(type => attractionTypes.includes(type)) ? 4 : 0
}

const getAudienceScore = (spot, childCount, mobilityNeeds) => {
  let score = 0
  if (childCount > 0 && spot.types?.includes('family')) score += 2
  if (mobilityNeeds === 'senior' && spot.types?.includes('senior')) score += 2
  return score
}

const getPriorityScore = priority => {
  const scores = { must: 5, high: 3, medium: 1, low: 0 }
  return scores[priority] ?? 1
}

const rotateBySeason = (spots, season) => {
  const seasonOffset = { spring: 0, summer: 1, autumn: 2, winter: 3 }[season] || 0
  if (!spots.length) return spots
  return [...spots.slice(seasonOffset), ...spots.slice(0, seasonOffset)]
}

const scoreGuideSpot = (spot, context) => (
  getTypeScore(spot, context.attractionTypes) +
  getSeasonScore(spot, context.season) +
  getRouteScore(spot, context.routePreference) +
  getAudienceScore(spot, context.childCount, context.mobilityNeeds) +
  getPriorityScore(spot.priority)
)

const selectGuideSpots = (guide, neededSpotCount, context) => {
  const scored = rotateBySeason(guide, context.season)
    .map((spot, index) => ({ spot, index, score: scoreGuideSpot(spot, context) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)

  const positiveMatches = scored.filter(item => item.score > 0).map(item => item.spot)
  const fallback = scored.map(item => item.spot)
  const baseSelection = positiveMatches.length >= neededSpotCount ? positiveMatches : [...positiveMatches, ...fallback]
  const selected = []

  while (selected.length < neededSpotCount) {
    const nextSpot = baseSelection[selected.length % baseSelection.length]
    selected.push(nextSpot)
  }

  return selected
}

const buildPreferencePlan = trip => {
  const playDays = clampNumber(trip.playDays, trip.days?.length || 3, 1, 14)
  const people = clampNumber(trip.people, 2, 1, 30)
  const adultCount = clampNumber(trip.adultCount, people, 0, people)
  const childCount = clampNumber(trip.childCount, Math.max(0, people - adultCount), 0, people)
  const attractionTypes = Array.isArray(trip.attractionTypes) && trip.attractionTypes.length
    ? trip.attractionTypes
    : ['city', 'shopping']
  const mobilityNeeds = trip.mobilityNeeds || (childCount > 0 ? 'kids' : 'none')
  const routePreference = trip.routePreference || 'mixed'
  const season = trip.season || 'spring'
  const specialRequests = String(trip.specialRequests || '').trim()
  const spotsPerDay = getPreferenceSpotCount(trip.travelStyle, mobilityNeeds)
  const neededSpotCount = playDays * spotsPerDay
  const guide = getDestinationGuide(trip.destination)
  const selectedGuideSpots = selectGuideSpots(guide, neededSpotCount, {
    attractionTypes,
    childCount,
    mobilityNeeds,
    routePreference,
    season
  })
  const generatedCandidates = selectedGuideSpots.map((template, index) => {
    const dayHint = Math.floor(index / spotsPerDay) + 1
    return {
      id: uuid(),
      spotName: template.name,
      category: template.category,
      address: template.zone,
      zone: template.zone,
      durationMinutes: mobilityNeeds === 'senior' ? Math.min(template.duration, 90) : template.duration,
      openTime: '09:00',
      closeTime: '21:00',
      priority: template.priority || getPreferencePriority(index, mobilityNeeds),
      notes: [
        `依偏好自動推薦：第 ${dayHint} 天安排在${template.zone}，符合${routePreference === 'classic' ? '第一次旅遊必去' : routePreference === 'hidden' ? '秘境探索' : '經典加私房'}路線。`,
        specialRequests ? `使用者補充：${specialRequests}` : ''
      ].filter(Boolean).join(' ')
    }
  })

  const days = Array.from({ length: playDays }, (_, dayIndex) => {
    const spotsForDay = generatedCandidates.slice(dayIndex * spotsPerDay, (dayIndex + 1) * spotsPerDay)
    const plannedSpots = spotsForDay.reduce((spots, candidate) => {
      const previousSpot = spots.at(-1)
      const transportMinutes = getPreferenceTransportMinutes(previousSpot, candidate, trip.travelStyle)
      const timeStart = previousSpot
        ? addMinutes(previousSpot.timeEnd || previousSpot.time, transportMinutes)
        : trip.dailyStartTime || '09:30'
      const timeEnd = addMinutes(timeStart, candidate.durationMinutes)

      spots.push({
        ...candidate,
        id: uuid(),
        sourceCandidateId: candidate.id,
        time: timeStart,
        timeStart,
        timeEnd,
        transportMinutes,
        transportNote: previousSpot
          ? `依區域估算從「${previousSpot.address}」到「${candidate.address}」約 ${transportMinutes} 分鐘，實際可依大眾運輸或計程車再調整。`
          : '今日第一站，建議依住宿位置選擇最近交通方式出發。',
        aiReason: `根據 ${people} 人、${adultCount} 位大人、${childCount} 位小孩、${season} 季節、${routePreference} 路線與 ${trip.travelStyle || 'balanced'} 節奏安排。`
      })

      return spots
    }, [])

    return {
      id: String(dayIndex + 1),
      spots: plannedSpots
    }
  })

  return {
    provider: 'preference-mock',
    summary: `已依 ${season} 季節、${routePreference} 路線與旅遊偏好產生 ${playDays} 天 ${Math.max(0, playDays - 1)} 夜行程草案，並以區域相近性、交通估算與${trip.travelStyle || 'balanced'}節奏安排。`,
    candidateSpots: generatedCandidates.map(({ zone, ...candidate }) => candidate),
    days
  }
}

server.get('/trips', (req, res) => {
  const userId = getUserId(req)
  const user = router.db.get('users').find({ id: userId }).value()
  const trips = router.db
    .get('trips')
    .value()
    .filter(trip => canAccessTrip(trip, userId, user?.email, req.user?.guestId))
    .map(normalizeTrip)

  return res.json(trips)
})

server.post('/trips', (req, res) => {
  const userId = getUserId(req)
  const newTrip = normalizeTrip({
    id: uuid(),
    userId,
    ownerId: userId,
    candidateSpots: [],
    collaborators: [],
    ...req.body,
    updatedAt: new Date().toISOString()
  })

  newTrip.days = createDaysForTrip(newTrip)

  router.db.get('trips').push(newTrip).write()
  return res.status(201).json(newTrip)
})

server.get('/trips/:id', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const normalizedTrip = normalizeTrip(trip)

  if (req.query.days) {
    const day = normalizedTrip.days.find(dayItem => dayItem.id == req.query.days)
    return res.json(day?.spots || [])
  }

  return res.json(normalizedTrip)
})

server.put('/trips/:id', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const updatedTrip = normalizeTrip({
    ...trip,
    ...req.body,
    id: trip.id,
    updatedAt: new Date().toISOString()
  })
  updatedTrip.days = createDaysForTrip(updatedTrip)

  router.db.get('trips').find({ id: trip.id }).assign(updatedTrip).write()
  return res.json(updatedTrip)
})

server.delete('/trips/:id', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return

  if (req.query.days && req.query.spot) {
    const day = trip.days?.find(dayItem => dayItem.id == req.query.days)
    if (!day) return res.status(404).json({ error: 'Day not found' })
    day.spots = (day.spots || []).filter(spot => spot.id !== req.query.spot)
    router.db.get('trips').find({ id: trip.id }).assign({ ...trip, updatedAt: new Date().toISOString() }).write()
    return res.json({ message: 'Spot deleted successfully' })
  }

  router.db.get('trips').remove({ id: trip.id }).write()
  return res.json({ message: 'Trip deleted successfully' })
})

server.post('/trips/:id/candidates', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const candidate = {
    id: uuid(),
    durationMinutes: 90,
    priority: 'medium',
    ...req.body
  }
  const candidateSpots = [...(trip.candidateSpots || []), candidate]
  router.db.get('trips').find({ id: trip.id }).assign({ candidateSpots, updatedAt: new Date().toISOString() }).write()
  return res.status(201).json(candidate)
})

server.put('/trips/:id/candidates/:spotId', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const candidateSpots = (trip.candidateSpots || []).map(spot =>
    spot.id === req.params.spotId ? { ...spot, ...req.body, id: spot.id } : spot
  )
  router.db.get('trips').find({ id: trip.id }).assign({ candidateSpots, updatedAt: new Date().toISOString() }).write()
  return res.json(candidateSpots.find(spot => spot.id === req.params.spotId))
})

server.delete('/trips/:id/candidates/:spotId', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const candidateSpots = (trip.candidateSpots || []).filter(spot => spot.id !== req.params.spotId)
  router.db.get('trips').find({ id: trip.id }).assign({ candidateSpots, updatedAt: new Date().toISOString() }).write()
  return res.json({ message: 'Candidate deleted successfully' })
})

server.post('/trips/:id/ai-plan', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const tripWithPreferences = normalizeTrip({ ...trip, ...req.body })
  const plan = tripWithPreferences.mode === 'preference'
    ? buildPreferencePlan(tripWithPreferences)
    : buildMockPlan(tripWithPreferences)
  const updatedTrip = normalizeTrip({
    ...tripWithPreferences,
    candidateSpots: plan.candidateSpots || tripWithPreferences.candidateSpots,
    days: plan.days
  })

  router.db.get('trips').find({ id: trip.id }).assign(updatedTrip).write()
  return res.json({ ...plan, trip: updatedTrip })
})

server.post('/trips/:id/collaborators', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const user = getUserByEmail(req.body.email)

  if (!user) {
    return res.status(404).json({ error: 'User email not found' })
  }

  const nextCollaborators = appendCollaborator(trip, {
    id: user.id,
    email: user.email,
    name: user.name,
    role: 'editor'
  })
  return res.status(201).json(nextCollaborators)
})

server.post('/trips/:id/invite-link', (req, res) => {
  const trip = findTripForRequest(req, res)
  if (!trip) return
  const inviteToken = trip.inviteToken || uuid()
  const updatedTrip = {
    ...trip,
    inviteToken,
    updatedAt: new Date().toISOString()
  }

  router.db.get('trips').find({ id: trip.id }).assign(updatedTrip).write()
  return res.status(201).json({ inviteToken })
})

server.get('/invites/:token', (req, res) => {
  const trip = getTripByInviteToken(req.params.token)

  if (!trip) {
    return res.status(404).json({ error: 'Invite link not found' })
  }

  return res.json({
    token: req.params.token,
    tripId: trip.id,
    tripName: trip.name,
    destination: trip.destination,
    dateStart: trip.dateStart,
    dateEnd: trip.dateEnd,
    people: trip.people,
    ownerId: trip.ownerId || trip.userId
  })
})

server.post('/invites/:token/accept', (req, res) => {
  const trip = getTripByInviteToken(req.params.token)

  if (!trip) {
    return res.status(404).json({ error: 'Invite link not found' })
  }

  const authHeader = req?.headers?.authorization
  let collaborator

  if (authHeader) {
    try {
      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET || 'json-server-auth-123456')
      const userId = Number.parseInt(decoded.sub, 10)
      const user = router.db.get('users').find({ id: userId }).value()
      if (user) {
        collaborator = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: 'editor'
        }
      }
    } catch {
      collaborator = null
    }
  }

  if (!collaborator) {
    const guestName = String(req.body.guestName || '').trim()
    if (!guestName) {
      return res.status(400).json({ error: 'Guest name is required' })
    }

    collaborator = {
      guestId: req.body.guestId || uuid(),
      name: guestName,
      role: 'editor',
      isGuest: true
    }
  }

  const collaborators = appendCollaborator(trip, collaborator)
  return res.status(201).json({ tripId: trip.id, collaborators, collaborator })
})

server.use(router)
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`)
})
