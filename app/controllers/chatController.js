const ChatController = {
  getChat: (req, res, next) => {
    res.render('chat/chat', {});
  }
};

module.exports = ChatController;
