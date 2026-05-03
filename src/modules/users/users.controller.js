const usersService = require('./users.service');

function getUserById(req, res, next) {
  try {
    const user = usersService.getUserById(req.user, req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

function getUsersList(req, res, next) {
  try {
    const users = usersService.getUsersList(req.user);
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

function blockUser(req, res, next) {
  try {
    const user = usersService.blockUser(req.user, req.params.id);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = { getUserById, getUsersList, blockUser };
