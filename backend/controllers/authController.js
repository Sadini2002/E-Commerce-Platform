import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateTokens = (id) => ({
  accessToken: jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' }),
  refreshToken: jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
});

export const register = async (req, res) => {
  const user = await User.create(req.body);
  const tokens = generateTokens(user._id);
  res.json({ user, ...tokens });
};

export const login = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await user.comparePassword(req.body.password)))
    return res.status(401).json({ message: 'Invalid credentials' });

  const tokens = generateTokens(user._id);
  res.json({ user, ...tokens });
};