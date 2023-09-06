const express = require("express");
const app = express();
const PORT = 8000;
const db = require("./models");
require("dotenv").config(); // .env 파일 사용

const http = require('http');
const SocketIO = require('socket.io');
const server = http.createServer(app);
const io = SocketIO(server);

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//router
const router = require("./routes");
app.use("/", router);

const admin = require("./routes/admin");
app.use("/admin", admin);

const socketRouter = require('./routes/socket');
socketRouter(io);

db.sequelize.sync({ force: false }).then(() => {
  server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
