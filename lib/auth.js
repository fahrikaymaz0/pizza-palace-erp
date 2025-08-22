import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId, email, role = 'USER') {
  return jwt.sign(
    { userId, email, role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

export function getTokenFromRequest(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function authenticateUser(req) {
  const token = getTokenFromRequest(req);
  if (!token) {
    return null;
  }
  
  const decoded = verifyToken(token);
  return decoded;
}

