const express = require('express');
const router = express.Router();
const ChatController = require("../controllers/chatController.js");
const checkUser = require('../middleware/check-user');

router.get('/chat', checkUser, ChatController.getChat);

module.exports = router;
