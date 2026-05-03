const express = require('express');
const usersController = require('./users.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, usersController.getUsersList);
router.get('/:id', authMiddleware, usersController.getUserById);
router.patch('/:id/block', authMiddleware, usersController.blockUser);

module.exports = router;
