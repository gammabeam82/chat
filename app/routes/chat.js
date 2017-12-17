const express = require('express');
const router = express.Router();
const ChatController = require("../controllers/chatController.js");

router.get('/chat', (req, res, next) => {
  if (req.user) {
    next()
  } else {
    req.flash('error', 'Allowed authenticated users only.');
    return res.redirect('/login');
  }
}, ChatController.getChat);

module.exports = router;
