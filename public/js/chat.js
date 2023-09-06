const chatButton = document.querySelector('#chat-button');
const chatWrapper = document.querySelector('#chat-wrapper');
const chatForm = document.querySelector('#chat-form');
const chatBox = document.querySelector('#chat-box');
const socket = io();
let isOpen = false;
let tempId = Math.random().toString(16).slice(2);

// 버튼 토글
chatButton.addEventListener('click', () => {
  if (!isOpen) {
    chatWrapper.style.animation = 'openChat 0.5s forwards';
  } 
  else {
    chatWrapper.style.animation = 'closeChat 0.5s forwards';
  }
  isOpen = !isOpen;
});

document.querySelector("#connect").addEventListener('click', () => {
  const input = document.querySelector("#reply");
  input.removeAttribute("disabled");
  socket.emit('create', tempId, tempId);
});

document.querySelector("#btn1").addEventListener('click', () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  div.classList.add('chat');
  div.classList.add('other-chat');
  div2.classList.add('chat');
  div2.classList.add('other-chat');
  div.innerText = '내 방 또는 책상의 사진을 찍은 후 분위기에 맞는 데스크 셋업을 추천 받는 서비스입니다.';
  div2.innerHTML = '<a href="https://localhost8080/recommend">바로가기 링크</a>'
  chatBox.appendChild(div);
  chatBox.appendChild(div2);
});

socket.on('notice', () => {
  const div = document.createElement('div');
  div.id = "notice"
  div.innerHTML = `<img src="../images/power.png" alt="charge" style="width: 12px; height: 12px;"/>&nbsp;상담원과 연결되었습니다.`;
  chatBox.appendChild(div);
});

// 메세지 보내기
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = document.querySelector('#reply');
  const msg = {
    id: tempId,
    message: message.value,
  };
  socket.emit('sendMessage', msg);
  message.value = '';
});

//메세지 띄우기
socket.on('newMessage', (message, id) => {
  const div = document.createElement('div');
  const p = document.createElement('p');
  p.innerText = message;
  if (tempId === id) {
    div.classList.add('my-chat');
  } else {
    div.classList.add('other-chat');
  }
  div.appendChild(p);
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
});
