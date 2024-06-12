const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()
const secret = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  const reqHeader = req?.headers
  const authHeader = reqHeader?.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, secret)
    req.user = decoded
    next()
  } catch (err) {
    console.error('Token verification failed:', err.message)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = authenticateToken
