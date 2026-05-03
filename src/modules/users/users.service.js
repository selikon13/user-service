const { db } = require('../../config/db');
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

function parseUserId(userId) {
  const id = Number(userId);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest('Некорректный ID пользователя');
  }
  return id;
}

function getUserById(requestUser, userId) {
  const id = parseUserId(userId);

  if (requestUser.role !== 'admin' && requestUser.id !== id) {
    throw ApiError.forbidden('Можно получить только собственный профиль');
  }

  const user = db.prepare(`SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = ?`).get(id);
  if (!user) throw ApiError.notFound('Пользователь не найден');

  return user;
}

function getUsersList(requestUser) {
  if (requestUser.role !== 'admin') {
    throw ApiError.forbidden('Список пользователей доступен только администратору');
  }

  return db.prepare(`SELECT ${PUBLIC_USER_FIELDS} FROM users ORDER BY id ASC`).all();
}

function blockUser(requestUser, userId) {
  const id = parseUserId(userId);

  if (requestUser.role !== 'admin' && requestUser.id !== id) {
    throw ApiError.forbidden('Можно заблокировать только себя');
  }

  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(id);
  if (!user) throw ApiError.notFound('Пользователь не найден');

  db.prepare(`
    UPDATE users
    SET is_active = 0,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(id);

  return db.prepare(`SELECT ${PUBLIC_USER_FIELDS} FROM users WHERE id = ?`).get(id);
}

module.exports = { getUserById, getUsersList, blockUser };
