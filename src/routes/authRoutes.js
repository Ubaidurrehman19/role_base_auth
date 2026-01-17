import express from 'express'
import STATUS from '../constants/statusCodes.js';
import AuthService from '../services/authService.js'

const router = express.Router()
const authService = new AuthService()

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const result = await authService.register(username, password, role);
    return res.status(STATUS.CREATED).json({ success: true, message: result.message, data: result.user});
  } catch (err) {
     return res.status(STATUS.BAD_REQUEST).json({ success: false, message: err.message});
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login(username, password);
    return res.status(STATUS.OK).json({ success: true, message: 'Login successful', data: result });
   } catch (err) {
    return res.status(STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
});

export default router
