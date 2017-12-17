const express = require('express');
const router = express.Router();
const AuthController = require("../controllers/authController.js");

router.get('/register', AuthController.getRegisterForm);

router.post('/register', AuthController.register);

router.get('/login', AuthController.getLoginForm);

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

module.exports = router;
