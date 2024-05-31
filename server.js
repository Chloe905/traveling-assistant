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
    // if (dayId) {
    //   // Find the day by ID within the trip
    //   const dayIndex = trip.days.findIndex(day => day.id == dayId)
    //   if (dayIndex !== -1) {
    //     // Add the new spot to the day
    //     trip.days[dayIndex].spots.push(newSpot)
    //     db.write()
    //     return res.status(201).json(newSpot)
    //   }
    //   return res.status(404).json({ error: 'Day not found' })
    // }
    // return res.status(400).json({ error: 'Day parameter is required' })
  }
  return res.status(404).json({ error: 'Trip not found' })
})


// Use default router
server.use(router)

server.listen(PORT, () => {
  console.log('JSON Server is running on port 4000')
})
