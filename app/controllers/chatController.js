const ChatController = {
  getChat: (req, res, next) => {
    res.render('chat/chat', {
      user: req.user
    });
  }
};

module.exports = ChatController;
