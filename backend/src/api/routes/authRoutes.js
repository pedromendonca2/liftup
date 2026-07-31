const express = require('express');

const authController = require('../../controllers/authController');
const userController = require('../../controllers/userController');

const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', authController.login);

module.exports = router;
