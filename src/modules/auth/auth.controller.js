const authService = require('./auth.service');
const { validateRegisterInput, validateLoginInput } = require('../../utils/validators');

function register(req, res, next) {
  try {
    validateRegisterInput(req.body);
    const result = authService.registerUser(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

function login(req, res, next) {
  try {
    validateLoginInput(req.body);
    const result = authService.loginUser(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login };
