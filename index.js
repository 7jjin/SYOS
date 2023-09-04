const express = require("express");
const app = express();
const PORT = 8000;

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/image"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//router
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/Recommend", (req, res) => {
  res.render("Recommend");
});

app.get("/test", (req, res) => {
  res.render("test");
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
