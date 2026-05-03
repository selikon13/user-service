const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { db } = require('../../config/db');
const config = require('../../config/env');
const ApiError = require('../../utils/ApiError');

const PUBLIC_USER_FIELDS = `
  id,
  full_name AS fullName,
  birth_date AS birthDate,
  email,
  role,
  is_active AS isActive,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function registerUser({ fullName, birthDate, email, password, role = 'user' }) {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
  if (existingUser) {
    throw ApiError.conflict('Пользователь с таким email уже существует');
  }

  const passwordHash = bcrypt.hashSync(password, 12);

  const result = db.prepare(`
    INSERT INTO users (full_name, birth_date, email, password_hash, role)
    VALUES (?, ?, ?, ?, ?)
  `).run(fullName.trim(), birthDate, normalizedEmail, passwordHash, role);

  const user = db.prepare(`SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = ?`).get(result.lastInsertRowid);

  return { user, token: generateToken(user) };
}

function loginUser({ email, password }) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase().trim());

  if (!user) throw ApiError.unauthorized('Неверный email или пароль');
  if (!user.is_active) throw ApiError.forbidden('Пользователь заблокирован');

  const isPasswordValid = bcrypt.compareSync(password, user.password_hash);
  if (!isPasswordValid) throw ApiError.unauthorized('Неверный email или пароль');

  const publicUser = db.prepare(`SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = ?`).get(user.id);
  return { user: publicUser, token: generateToken(publicUser) };
}

module.exports = { registerUser, loginUser };
