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
  const plan = buildMockPlan(tripWithPreferences)
  const updatedTrip = normalizeTrip({ ...tripWithPreferences, days: plan.days })

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
