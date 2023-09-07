const { User, Post } = require("../models"); // index.js 생략
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const axios = require("axios");

// 암호화 관련 정보
const saltNumber = parseInt(process.env.SALT);
const SECRET = process.env.SECRET;

// 구글 로그인 정보
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

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

const uploadPost = (req, res) => {
  res.render("uploadPost");
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

// 전체 게시물
const posts = (req, res) => {
  res.render("board");
};

const post_posts = (req, res) => {
  Post.findAll({}).then((result) => {
    res.json({ data: result });
  });
};

// 구글 로그인 페이지로 이동
const google_signin = (req, res) => {
  let url = "https://accounts.google.com/o/oauth2/v2/auth";
  url += `?client_id=${GOOGLE_CLIENT_ID}`;
  url += `&redirect_uri=${GOOGLE_REDIRECT_URI}`;
  url += "&response_type=code";
  url += "&scope=email profile";
  res.redirect(url);
};

// 구글에서 넘어온 정보 처리
const google_redirect = async (req, res) => {
  const { code } = req.query;
  console.log("code : ", code);

  // 액세스 토큰 받기
  const resp = await axios({
    method: "post",
    url: GOOGLE_TOKEN_URL,
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_URI,
      grant_type: "authorization_code",
      code,
    },
  });

  // 토큰을 활용하여 구글 계정 정보 가져오기
  const resp2 = await axios({
    method: "get",
    url: GOOGLE_USERINFO_URL,
    headers: {
      Authorization: `Bearer ${resp.data.access_token}`,
    },
  });

  // 이메일, 닉네임 추출
  const { email, name } = resp2.data;

  // 해당 이메일로 가입된 유저가 있는지 확인
  const emailResult = await User.findOne({
    where: {
      email,
    },
  });

  // 해당 이메일로 가입한 유저가 없다면 회원가입 진행
  if (emailResult == null) {
    // DB에 유저 이메일, 닉네임 저장
    const result = await User.create({
      email,
      password: "google",
      nickname: name,
    });

    // JWT 토큰 생성
    const token = jwt.sign(
      { user_id: result.user_id, nickName: result.nickname },
      SECRET
    );

    // data.ejs로 토큰 전달 -> data.ejs는 토큰 받아서 로컬스토리지에 저장하고 메인 페이지로 이동
    res.render("data", { nickName: result.nickname, token });
  } else {
    // 해당 이메일로 가입된 유저가 있다면 로그인 진행
    // JWT 토큰 생성
    const token = jwt.sign(
      { user_id: emailResult.user_id, nickName: emailResult.nickname },
      SECRET
    );

    // data.ejs로 토큰 전달 -> data.ejs는 토큰 받아서 로컬스토리지에 저장하고 메인 페이지로 이동
    res.render("data", { nickName: emailResult.nickname, token });
  }
};

// 게시물 상세 -> 추후 게시물 작성으로 변경해야함!!
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
      // 로그인 성공시 JWT 토큰 생성
      const token = jwt.sign(
        { user_id: result.user_id, nickName: result.nickname },
        SECRET
      );
      console.log("token : ", token); // 확인용
      res.json({ result: "3", nickName: result.nickname, token });
    } else {
      // 비밀번호 틀림
      if (result.password == "google") {
        res.send({ result: "4" });
      } else {
        res.send({ result: "2" });
      }
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

// 소셜 로그인
module.exports = {
  main,
  recommend,
  uploadPost,
  signup,
  signin,
  findpw,
  posts,
  post_posts,
  post_write,
  google_signin,
  google_redirect,

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
