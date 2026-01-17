import bcrypt from 'bcrypt'
import jwtPkg from 'jsonwebtoken'
import User from '../models/user.js';

const { sign } = jwtPkg

export default class AuthService {

  // Register User
  async register(username, password, role) {
    const existingUser = await User.findOne({ username });

    if (existingUser) throw new Error('User already exists');
    if (!username || !password) throw new Error("Username and password required");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: role});
    await newUser.save();
    return { message: 'User registered successfully', user: { username, role }}
  }

  // Login User
  async login(username, password) {
    const user = await User.findOne({ username });
    if (!user) throw new Error('Invalid username or password');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error('Invalid username or password');

    const token = sign({ 
        userId: user._id, username: user.username, role: user.role
     }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
}
