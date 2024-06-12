const jsonServer = require('json-server')
const auth = require('json-server-auth')
const path = require('path')
const authenticateToken = require('./authMiddleware')
const dotenv = require('dotenv')
const { v4: uuid } = require('uuid')

dotenv.config()

const server = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const middlewares = jsonServer.defaults()
const PORT = 4000

const rules = auth.rewriter({
  users: 600,
  trips: 660,
  'trips/:id': 660
})

server.use(middlewares)
server.use(jsonServer.bodyParser)
server.use(rules)
server.use(auth)
server.db = router.db   
server.use(authenticateToken)

server.get('/trips', (req, res) => {
  const db = router.db
  const userId = parseInt(req.user.sub, 10)
  const trips = db.get('trips').filter({ userId }).value()
  return res.json(trips)
})

server.post('/trips', (req, res) => {
  const db = router.db
  const userId = parseInt(req.user.sub, 10)

  const newTrip = {
    id: uuid(),
    userId,
    ...req.body,
  }

  db.get('trips').push(newTrip).write()
  return res.status(201).json(newTrip)
})

// Route to handle query parameters for days
server.get('/trips/:id', (req, res) => {
  const db = router.db
  const tripId = req.params.id
  const dayId = req.query.days
  const userId = parseInt(req.user.sub, 10)

  // Find the trip by ID
  const trips = db.get('trips').filter({ userId }).value()

  const trip = trips.find({ id: tripId }).value()

  if (trip) {
    if (dayId) {
      // Find the day by ID within the trip
      const day = trip.days.find(day => day.id === dayId)

      if (!day) {
        return
        // return res.status(404).json({ error: 'Day not found' })
      }
      if (day && day.spots) {
        return res.json(day.spots)
      }
    }
    return res.json(trip)
  }
  return res.status(404).json({ error: 'Trip not found' })
})

// Route to handle adding a new spot
server.post('/trips/:id', (req, res) => {
  const db = router.db
  const tripId = req.params.id
  const dayId = req.query.days
  const userId = parseInt(req.user.sub, 10)
  const newSpot = req.body

  // Find the trip by ID
  const trip = db.get('trips').find({ id: tripId }).value()

  if (trip) {
    if (!trip.days) {
      trip.days = []
    }

    let day = trip.days.find(day => day.id == dayId)

    if (!day) {
      day = { id: dayId, spots: [] }
      trip.days.push(day)
    }

    // Add the new spot to the day
    day.spots.push(newSpot)
    db.write()

    console.log('New spot added successfully:', newSpot)

    return res.status(201).json(newSpot)
  }
  return res.status(404).json({ error: 'Trip not found' })
})

// Route to handle editing a spot
server.put('/trips/:id', (req, res) => {
  const db = router.db
  const tripId = req.params.id
  const dayId = req.query.days
  const editedSpot = req.body

  // Find the trip by ID
  const trip = db.get('trips').find({ id: tripId }).value()


  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' })
  }

  if (!trip.days) {
    trip.days = []
  }

  let day = trip.days.find(day => day.id == dayId)

  if (!day) {
    return res.status(404).json({ error: 'Day not found' })
  }

  let spotIndex = day.spots.findIndex(spot => spot.id === editedSpot.id)

  if (spotIndex !== -1) {
    // Update existing spot
    day.spots[spotIndex] = editedSpot
  } else {
    return res.status(404).json({ error: 'Spot not found' })
  }
  db.write()

  console.log('Spot updated successfully:', editedSpot)
  return res.status(200).json(editedSpot)
})

server.delete('/trips/:id', (req, res) => {
  const db = router.db
  const tripId = req.params.id
  const dayId = req.query.days
  const spotId = req.query.spot
  const trip = db.get('trips').find({ id: tripId }).value()

  if (!trip) {
    return res.status(404).json({ error: 'Trip not found' })
  }

  if (!spotId || !dayId) {
    // delete whole trip
    db.get('trips').remove({ id: tripId }).write()
    return res.status(200).json({ message: 'Trip deleted successfully' })
  }

  if (spotId) {
    // If spotId is provided, delete the specific spot
    const day = trip.days.find(day => day.id == dayId)
    if (!day) {
      return res.status(404).json({ error: 'Day not found' })
    }

    const spotIndex = day.spots.findIndex(spot => spot.id == spotId)
    if (spotIndex !== -1) {
      day.spots.splice(spotIndex, 1)
      db.write()

      return res.status(200).json({ message: 'Spot deleted successfully' })
    } else {
      return res.status(404).json({ error: 'Spot not found' })
    }
  }
})

server.use(router)
server.listen(PORT, () => {
  console.log('JSON Server is running on port 4000')
})
