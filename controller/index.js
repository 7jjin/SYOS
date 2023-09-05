const { User } = require("../models"); // index.js 생략
const bcrypt = require("bcrypt");
const saltNumber = 10;
const jwt = require("jsonwebtoken");
const SECRET = "secretkey";

// 메인 페이지 이동
const main = (req, res) => {
  res.render("index");
};

// 회원가입 페이지 이동
const signup = (req, res) => {
  res.render("signup");
};

// 로그인 페이지 이동
const signin = (req, res) => {
  res.render("signin");
};

// 비밀번호 찾기 페이지 이동
const findpw = (req, res) => {
  res.render("findPw");
};

const posts = (req, res) => {
  res.render("board");
};

const post_write = (req, res) => {
  res.render("boardwrite");
};
//로그인
const post_signin = async (req, res) => {
  const { email, pw } = req.body;

  // 이메일로 유저가 존재하는지 먼저 확인
  const result = await User.findOne({
    where: {
      email,
    },
  });

  if (result == null) {
    // 유저 존재 X
    res.send({ result: "1" });
  } else {
    if (comparePassword(pw, result.password)) {
      // 로그인 성공
      const token = jwt.sign(
        { user_id: result.user_id, nickName: result.nickname },
        SECRET
      );
      console.log("token : ", token);
      res.json({ result: "3", nickName: result.nickname, token });
    } else {
      // 비밀번호 틀림
      res.send({ result: "2" });
    }
  }
};

// 회원가입
const post_signup = async (req, res) => {
  const { email, pw, nickName } = req.body;

  // bcrypt 암호화
  const hashPw = bcryptPassword(pw);

  const result = await User.create({
    email,
    password: hashPw,
    nickname: nickName,
  });

  res.json({ result: true });
};

// 이메일 중복 체크
const post_emailCheck = async (req, res) => {
  const { email } = req.body;
  const result = await User.findOne({
    where: {
      email,
    },
  });

  console.log("이메일 중복 체크 : ", result);

  if (result == null) {
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
};

// 닉네임 중복 체크
const post_nickName = async (req, res) => {
  const { nickName } = req.body;
  const result = await User.findOne({
    where: {
      nickName,
    },
  });

  console.log("닉네임 중복 체크 : ", result);

  if (result == null) {
    res.json({ result: true });
  } else {
    res.json({ result: false });
  }
};

module.exports = {
  main,
  signup,
  signin,
  findpw,
  posts,
  post_write,

  post_signin,
  post_signup,
  post_emailCheck,
  post_nickName,
};

// 암호화
const bcryptPassword = (password) => {
  return bcrypt.hashSync(password, saltNumber);
};
// 비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};
