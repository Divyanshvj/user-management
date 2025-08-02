const { User, Token } = require('../models');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/email');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { generateAccessToken, generateRefreshToken } = require('../utils/generateToken');
const redisClient = require('../config/redis');

// Helper to generate and send tokens
async function createTokenAndSend(user, res) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  await redisClient.set(`refresh-${user.id}`, refreshToken, { EX: 7 * 24 * 60 * 60 });
  res.json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name, role: user.role, profileImage: user.profileImage } });
}

// 1. Register
exports.register = async (req, res) => {
  await body('email').isEmail().run(req);
  await body('password').isLength({ min: 6 }).run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password } = req.body;
  let user = await User.findOne({ where: { email } });
  if (user) return res.status(409).json({ message: 'Email already exists.' });

  const hashed = await bcrypt.hash(password, 10);
  user = await User.create({ name, email, password: hashed, isVerified: false });
  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hr

  await Token.create({ userId: user.id, token, type: 'emailVerify', expires });

  // Email Verification
  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${token}`;
  await sendEmail(user.email, 'Verify your Email', `<p>Click <a href="${verifyLink}">here</a> to verify your email</p>`);
  res.json({ message: 'Registered. Please check your email to verify.' });
};

// 2. Verify Email
exports.verifyEmail = async (req, res) => {
  const tokenRow = await Token.findOne({ where: { token: req.params.token, type: 'emailVerify' } });
  if (!tokenRow || tokenRow.expires < new Date()) return res.status(400).json({ message: 'Token invalid or expired.' });
  const user = await User.findByPk(tokenRow.userId);
  if (!user) return res.status(400).json({ message: 'User invalid' });
  user.isVerified = true;
  await user.save();
  await Token.destroy({ where: { token: req.params.token } });
  res.json({ message: 'Email successfully verified. You can now login.' });
};

// 3. Login
exports.login = async (req, res) => {
  await body('email').isEmail().run(req);
  await body('password').notEmpty().run(req);
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) return res.status(401).json({ message: 'Invalid credentials' });
  if (!user.isVerified) return res.status(403).json({ message: 'Please verify your email' });

  await createTokenAndSend(user, res);
};

// 4. Refresh Token
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  let userData;
  try {
    userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }

  const redisToken = await redisClient.get(`refresh-${userData.id}`);
  if (redisToken !== refreshToken) return res.status(403).json({ message: 'Invalid refresh token' });

  const user = await User.findByPk(userData.id);
  if (!user) return res.status(401).json({ message: 'User not found' });

  await createTokenAndSend(user, res);
};

// 5. Logout
exports.logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.json({ message: 'Logged out' });
  let userData;
  try {
    userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    await redisClient.del(`refresh-${userData.id}`);
  } catch {/**/}
  res.json({ message: 'Logged out.' });
};

// 6. Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.json({ message: 'If that email is registered, you will receive a reset link.' });

  const token = uuidv4();
  const expires = new Date(Date.now() + 60 * 60 * 1000);
  await Token.create({ userId: user.id, token, type: 'passwordReset', expires });

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendEmail(user.email, 'Reset your password', `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`);
  res.json({ message: 'If that email is registered, you will receive a reset link.' });
};

// 7. Reset Password
exports.resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const tokenRow = await Token.findOne({ where: { token, type: 'passwordReset' } });
  if (!tokenRow || tokenRow.expires < new Date()) return res.status(400).json({ message: 'Token invalid or expired.' });

  const user = await User.findByPk(tokenRow.userId);
  if (!user) return res.status(400).json({ message: 'User not found' });

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  await user.save();
  await Token.destroy({ where: { token } });
  res.json({ message: 'Password reset successful.' });
};

exports.getCurrentUser = async (req, res) => {
  try {
    // req.user should be set by your authenticateToken middleware
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Google OAuth2 Login - left as placeholder (implement as per `google-auth-library` docs)

// Implement verify Google token, check/create user, respond with JWT.
