const jsonServer = require('json-server')

const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const PORT = 4000

server.use(middlewares)

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
      const day = trip.days.find(day => day.id == dayId)
      if (day) {
        return res.json(day.spots)
      }
      return res.status(404).json({ error: 'Day not found' })
    }
    return res.json(trip)
  }
  return res.status(404).json({ error: 'Trip not found' })
})

// Use default router
server.use(router)

server.listen(PORT, () => {
  console.log('JSON Server is running on port 4000')
})
