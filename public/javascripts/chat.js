const events = {
  MESSAGE: 'message',
  CHAT_MESSAGE: 'chat message',
  TYPING: 'typing',
  ONLINE: 'online',
  OFFLINE: 'offline',
  UPDATE_LIST: 'update list'
};

window.onload = () => {
  const form = document.getElementById('chat-form');
  const userId = form.getAttribute('data-id');
  const username = form.getAttribute('data-username');
  const textInput = document.getElementById('msg');
  const button = document.getElementById('submit-button');
  const chat = document.getElementById('chat-container');
  const feedback = document.getElementById('feedback');

  const socket = io('', {
    reconnection: false,
    forceNew: true
  });

  const displayMessage = (data) => {
    let el = document.createElement('div');
    let sender = data.name === username ? '<span class="text-success">Me</span>' : `<i><span class="text-danger">${data.name}</span></i>`;
    el.innerHTML = `<strong>${sender}</strong> <small class="text-muted">(${data.time})</small>): ${data.message}`;

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

  socket.emit(events.ONLINE, username);

  form.addEventListener('submit', event => event.preventDefault());

  textInput.addEventListener('keypress', () => socket.emit(events.TYPING, username));

  setInterval(() => feedback.innerText = '', 60000);

  button.addEventListener('click', sendMessage);

  document.addEventListener('keydown', (event) => {
    if (event.which === 13) {
      event.preventDefault();
      sendMessage();
    }
  });

  socket.on(events.CHAT_MESSAGE, displayMessage);

  socket.on(events.TYPING, data => feedback.innerText = `${data} is typing...`);

  socket.on(events.ONLINE, data => feedback.innerText = `${data} is online.`);

  socket.on(events.OFFLINE, data => feedback.innerText = `${data} is offline.`);
};
