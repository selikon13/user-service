const ApiError = require('./ApiError');

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().startsWith(date);
}

function validateRegisterInput(data) {
  const errors = [];
  const { fullName, birthDate, email, password, role } = data;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
    errors.push('ФИО должно содержать минимум 2 символа');
  }
  if (!birthDate || !validateDate(birthDate)) {
    errors.push('Дата рождения должна быть в формате YYYY-MM-DD');
  }
  if (!email || !validateEmail(email)) {
    errors.push('Некорректный email');
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.push('Пароль должен содержать минимум 6 символов');
  }
  if (role && !['admin', 'user'].includes(role)) {
    errors.push('Роль должна быть admin или user');
  }

  if (errors.length) {
    throw ApiError.badRequest('Ошибка валидации', errors);
  }
}

function validateLoginInput(data) {
  const errors = [];
  const { email, password } = data;

  if (!email || !validateEmail(email)) errors.push('Некорректный email');
  if (!password) errors.push('Пароль обязателен');

  if (errors.length) {
    throw ApiError.badRequest('Ошибка валидации', errors);
  }
}

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
