const express = require("express");
const app = express();
const PORT = 8000;
const db = require("./models");

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

// 정적 파일
app.use('image', express.static(__dirname + '/public/image'));
// 추후 src 경로에서 "/image/파일명" 으로 접근 가능

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(__dirname + '/public'))

//router
const router = require("./routes");
app.use("/", router);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});