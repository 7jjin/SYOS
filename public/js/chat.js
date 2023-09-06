const chatButton = document.querySelector('#chat-button');
const chatWrapper = document.querySelector('#chat-wrapper');
const chatForm = document.querySelector('#chat-form');
const chatBox = document.querySelector('#chat-box');
const chatBoxWrap = document.querySelector('#chat-box-wrapper');
const socket = io();
let isOpen = false;
let tempId = Math.random().toString(16).slice(2);

// 버튼 토글
chatButton.addEventListener('click', () => {
  if (!isOpen) {
    chatWrapper.style.animation = 'openChat 0.5s forwards';
  } else {
    // 채팅방 나가기
    socket.emit('leaveRoom');
    // 또한 chatBox의 interface를 초기상태로 변경
    chatBox.innerHTML = '';
    chatBox.innerHTML = `
      <div class="chat other-chat">
        안녕하세요! SYOS에 방문해주셔서 감사합니다 ☺️<br />
        궁금한 점이나 개선 사항이 있으시면 말씀해주세요!
      </div>
      <div id="btn1" class="chat chat-button" onclick="clickBtn1">데스크 셋업 추천? 💻</div>
      <div id="btn2" class="chat chat-button onclick="clickBtn2">SYOS에게 바라는 점 📝</div>
      <div id="connect" class="chat chat-button" onclick="clickConnectButton()">상담원 연결하기 👨‍👩‍👧‍👦</div>
    `;

    chatWrapper.style.animation = 'closeChat 0.5s forwards';
  }
  isOpen = !isOpen;
});

const clickConnectButton = () => {
  const input = document.querySelector('#reply');
  input.removeAttribute('disabled');
  socket.emit('create', `user_${tempId}`, tempId);
  const div = document.createElement('div');
  div.id = 'notice';
  div.innerHTML = `상담원 연결 중입니다 <i class="fa-solid fa-ellipsis fa-fade"></i>`;
  chatBox.appendChild(div);
};

const clickBtn1 = () => {
  const div = document.createElement('div');
  const div2 = document.createElement('div');
  div.classList.add('chat');
  div.classList.add('other-chat');
  div2.classList.add('chat');
  div2.classList.add('other-chat');
  div.innerText =
    '내 방 또는 책상의 사진을 찍은 후 분위기에 맞는 데스크 셋업을 추천 받는 서비스입니다.';
  div2.innerHTML =
    '<a href="https://localhost8080/recommend">바로가기 링크</a>';
  chatBox.appendChild(div);
  chatBox.appendChild(div2);
};

const clickBtn2 = () => {};

socket.on('notice', (res) => {
  const div = document.createElement('div');
  div.id = 'notice';
  if (res.leave) {
    div.innerText = '사용자가 채팅방을 나갔습니다.';
  } else {
    div.innerHTML = `<img src="../images/power.png" alt="charge" style="width: 12px; height: 12px;"/>&nbsp;상담원과 연결되었습니다.`;
  }
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
  div.innerText = message;
  div.classList.add('chat');
  if (tempId === id) {
    div.classList.add('my-chat');
  } else {
    div.classList.add('other-chat');
  }
  chatBox.appendChild(div);
  chatBoxWrap.scrollTop = chatBoxWrap.scrollHeight;
});
