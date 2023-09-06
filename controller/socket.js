exports.connection = (io, socket) => {
  socket.on('create', (roomName, userId) => {
    socket.join(roomName);
    socket.room = roomName;
    socket.user = userId;
    io.to(roomName).emit('notice');
  });

  socket.on('sendMessage', (message) => {
    console.log(message);
    io.to(socket.room).emit('newMessage', message.message, message.id);
  });

  socket.on('disconnect', () => {
    if (socket.room) {
      socket.leave(socket.room);
    }
  });
};
