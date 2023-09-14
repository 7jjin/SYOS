const express = require('express');
const app = express();
const PORT = 8000;
const db = require('./models');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + '/public'));
app.use('../public/uploads', express.static(__dirname + '/uploads'));

require('dotenv').config(); // .env 파일 사용

const http = require('http');
const SocketIO = require('socket.io');
const server = http.createServer(app);
const io = SocketIO(server);

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router
const router = require('./routes');
const admin = require('./routes/admin');
const socketRouter = require('./routes/socket');
const board = require('./routes/board');
const oauth = require('./routes/oauth');

app.use('/', router);
app.use('/', oauth);
app.use('/admin', admin);
app.use('/board', board);
socketRouter(io);

// 404 error
app.use('*', (req, res) => {
  res.render('404');
});

db.sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
