import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password) {
  return password && password.length >= 6;
}

export function validatePhone(phone) {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  return phoneRegex.test(phone);
}

export async function hashPassword(password) {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

export async function comparePassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role || 'user',
      firstName: user.firstName,
      lastName: user.lastName
    },
    secret,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
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

