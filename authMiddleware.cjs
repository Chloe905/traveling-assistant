const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const secret = process.env.JWT_SECRET || 'json-server-auth-123456'

const authenticateToken = (req, res, next) => {
  const publicPaths = ['/login', '/register', '/signup', '/invites']

  if (publicPaths.some(path => req.path.startsWith(path))) {
    next()
    return
  }

  const authHeader = req?.headers?.authorization
  const guestId = req?.headers?.['x-guest-id']

  if (guestId) {
    req.user = { guestId }
    next()
    return
  }

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authenticateToken
