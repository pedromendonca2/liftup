// backend/src/controllers/userController.js

const userService = require('../services/userService');

/**
 * Controller para criar um novo usuário.
 */
async function createUser(req, res) {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = {
  createUser,
};