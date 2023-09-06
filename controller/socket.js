const roomList = [];

exports.connection = (io, socket) => {
  socket.on('create', (roomName, userId) => {
    socket.join(roomName);
    socket.room = roomName;
    socket.user = userId;
    // 채팅방 목록 갱신 후 emit
    if (!roomList.includes(roomName)) {
      roomList.push(roomName);
      io.emit('roomList', roomList);
    }
    // 상담원 연결메시지 보내기
    socket.broadcast.to(socket.room).emit('notice', {leave: false});
  });
  
  // 처음에 로드될때 방목록 불러오기 (어드민)
  socket.on('getRoomList', () => {
    socket.emit('roomList', roomList);
  });

  // 메세지 아이디
  socket.on('sendMessage', (message) => {
    console.log(message);
    io.to(socket.room).emit('newMessage', message.message, message.id);
  });
  
  // 배열에서 해당 방 삭제후 사용자 나가기
  socket.on('leaveRoom', () => {
    if (socket.room) {
      const index = roomList.indexOf(socket.room);
      if (index !== -1) {
        roomList.splice(index, 1);
      }
      io.emit('roomList', roomList);
      socket.broadcast.to(socket.room).emit('notice', { leave: true });
    }
  })
  
  socket.on('disconnect', () => {
    if (socket.room) {
      socket.leave(socket.room);
    }
  });
};
