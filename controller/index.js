const { User, Post } = require("../models"); // index.js 생략
const bcrypt = require("bcrypt");
const saltNumber = 10;

// 메인 페이지 이동
const main = (req, res) => {
  res.render("index");
};

// 추천 페이지 이동
const recommend = (req, res) => {
  res.render("recommend");
};

const post_recommend = (req, res) => {
  Post.findAll({}).then((result) => {
    res.json({ data: result });
  });
};

// 테스트 페이지 이동
const test = (req, res) => {
  res.render("test");
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
  console.log(req.body);
  // 로그인 구현 해야 함
  // const { userid, pw } = req.body;
  // const result = await User.findOne({
  //   where: {
  //     userid,
  //   },
  // });

  // if (result == null) {
  //   res.json({ result: "1" });
  // } else {
  //   const dbPw = result.dataValues.pw;

  //   if (comparePassword(pw, dbPw)) {
  //     res.json({ result: "3", data: result.dataValues });
  //   } else {
  //     res.json({ result: "2" });
  //   }
  // }
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
  recommend,
  test,
  signup,
  signin,
  findpw,
  posts,
  post_write,
  post_signin,
  post_signup,
  post_emailCheck,
  post_nickName,
  post_recommend,
};

// 암호화
const bcryptPassword = (password) => {
  return bcrypt.hashSync(password, saltNumber);
};
// 비교
const comparePassword = (password, dbPassword) => {
  return bcrypt.compareSync(password, dbPassword);
};
