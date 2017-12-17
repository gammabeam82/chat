const events = require('../config/events');
const io = require('socket.io')();
const striptags = require('striptags');
const dateFormat = require('dateformat');

const users = new Set();

const SocketioService = {
  attachEvents: () => {
    let name = '';

    io.on(events.CONNECTION, (socket) => {

      socket.on(events.ONLINE, (data) => {
        name = data;
        socket.broadcast.emit(events.ONLINE, name);
      });

      socket.on(events.MESSAGE, (data) => {
        let msg = striptags(data.message.trim());
        if (!msg.length) {
          return;
        }
        io.emit(events.CHAT_MESSAGE, {
          name: data.name,
          message: msg,
          time: dateFormat(new Date(), 'HH:MM:ss')
        });
      });

      socket.on(events.TYPING, (data) => socket.broadcast.emit('typing', data));

      socket.on(events.DISCONNECT, () => {

      });
    });

    return io;
  }
};

module.exports = SocketioService;
