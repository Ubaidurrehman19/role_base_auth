import jwtPkg from 'jsonwebtoken'
const { verify } = jwtPkg

const JWT_SECRET = process.env.JWT_SECRET;

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const user = verify(token, JWT_SECRET)
    req.user = user 
    next()
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }
}
