const events = {
  MESSAGE: 'message',
  CHAT_MESSAGE: 'chat_message',
  TYPING: 'typing',
  ONLINE: 'online',
  OFFLINE: 'offline',
  UPDATE_LIST: 'update_list',
  MESSAGE_NOTIFICATION: 'message_notification'
};

window.onload = () => {
  const form = document.getElementById('chat-form');
  const userId = form.dataset.id;
  const username = form.dataset.username;
  const textInput = document.getElementById('msg');
  const button = document.getElementById('submit-button');
  const chat = document.getElementById('chat-container');
  const feedback = document.getElementById('feedback');
  const online = document.getElementById('online');
  const soundMessage = document.getElementById('sound-message');
  const soundOnline = document.getElementById('sound-online');
  const soundOffline = document.getElementById('sound-offline');
  const soundTyping = document.getElementById('sound-typing');

  const socket = io('', {
    reconnection: false,
    forceNew: true
  });

  const displayMessage = data => {
    let el = document.createElement('div');
    let sender = data.name === username ? '<span class="text-success">Me</span>' : `<i><span class="text-danger">${data.name}</span></i>`;
    el.innerHTML = `<strong>${sender}</strong> <small class="text-muted">(${data.time})</small>): ${data.message}<hr/>`;

    chat.appendChild(el);
    el.scrollIntoView();
    feedback.innerText = '';
  };

  const sendMessage = () => {
    let text = textInput.value;

    if (!text.length) {
      return;
    }

    socket.emit(events.MESSAGE, {
      id: userId,
      name: username,
      message: text
    });

    textInput.value = '';
    feedback.innerText = '';
  };

  $('[data-toggle="popover"]').popover({
    html: true,
    trigger: 'hover',
    placement: 'bottom'
  });

  socket.emit(events.ONLINE, username);

  form.addEventListener('submit', event => event.preventDefault());

  textInput.addEventListener('keypress', () => socket.emit(events.TYPING, username));

  setInterval(() => feedback.innerText = '', 60000);

  button.addEventListener('click', sendMessage);

  document.addEventListener('keydown', event => {
    if (event.which === 13) {
      event.preventDefault();
      sendMessage();
    }
  });

  socket.on(events.CHAT_MESSAGE, displayMessage);

  socket.on(events.MESSAGE_NOTIFICATION, () => soundMessage.play());

  socket.on(events.ONLINE, data => {
    feedback.innerText = `${data} is online.`;
    soundOnline.play();
  });

  socket.on(events.OFFLINE, data => {
    feedback.innerText = `${data} is offline.`;
    soundOffline.play();
  });

  socket.on(events.TYPING, data => {
    feedback.innerText = `${data} is typing...`;
    soundTyping.play();
  });

  socket.on(events.UPDATE_LIST, data => {
    online.innerText = `Online: ${data.length}`;
    online.dataset.content = data.map(item => `${item}<br/>`).join('');
  });
};
