const events = require('../config/events');
const Server = require('socket.io');
const striptags = require('striptags');
const dateFormat = require('dateformat');
const nodeRedis = require('redis');
const {REDIS, LIST_ID, LIMIT} = require('../config/config');
const redisClient = nodeRedis.createClient(REDIS);

const users = new Map();
const io = new Server();

const ChatService = {
  attachEvents: () => {
    io.on(events.CONNECTION, socket => {

      socket.on(events.ONLINE, data => {
        users.set(socket.id, data);

        socket.broadcast.emit(events.ONLINE, data);
        io.emit(events.UPDATE_LIST, Array.from(users.values()));

        redisClient.lrange(LIST_ID, 0, LIMIT, (err, items) => {
          items.reverse().map(item => socket.emit(events.CHAT_MESSAGE, JSON.parse(item)));
        });
      });

      socket.on(events.MESSAGE, data => {
        let msg = striptags(data.message.trim());
        if (!msg.length) {
          return;
        }

        let chatMessage = {
          name: data.name,
          message: msg,
          time: dateFormat(new Date(), 'HH:MM:ss')
        };

        redisClient.lpush(LIST_ID, JSON.stringify(chatMessage), () => redisClient.ltrim(LIST_ID, 0, LIMIT));

        io.emit(events.CHAT_MESSAGE, chatMessage);
        io.emit(events.MESSAGE_NOTIFICATION);
      });

      socket.on(events.TYPING, data => socket.broadcast.emit('typing', data));

      socket.on(events.DISCONNECT, () => {
        let user = users.get(socket.id);
        users.delete(socket.id);

        io.emit(events.OFFLINE, user);
        io.emit(events.UPDATE_LIST, Array.from(users.values()));
      });
    });

    return io;
  }
};

module.exports = ChatService;
