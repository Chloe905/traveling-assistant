const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const PORT = 4000

server.use(middlewares)
server.use(jsonServer.bodyParser)

// Route to handle query parameters for days
server.get('/trips/:id', (req, res) => {
  const db = router.db
  const tripId = req.params.id
  const dayId = req.query.days

  // Find the trip by ID
  const trip = db.get('trips').find({ id: tripId }).value()

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


// Use default router
server.use(router)

server.listen(PORT, () => {
  console.log('JSON Server is running on port 4000')
})
