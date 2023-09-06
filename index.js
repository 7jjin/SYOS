const express = require("express");
const app = express();
const PORT = 8000;
const db = require("./models");
require("dotenv").config(); // .env 파일 사용

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

//router
const router = require("./routes");
app.use("/", router);

db.sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
});
