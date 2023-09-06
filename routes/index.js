const express = require("express");
const router = express.Router();
const controller = require("../controller");

// 메인 페이지 이동
router.get("/", controller.main);

// 추천 페이지 이동
router.get("/recommend", controller.recommend);

// 모든 포스트 내보내기
router.post("/recommend", controller.post_recommend);

// 테스트 페이지
router.get("/test", controller.test);

// 회원가입 페이지 이동
router.get("/signup", controller.signup);

// 로그인 페이지 이동
router.get("/signin", controller.signin);

// 비밀번호 찾기 페이지 이동
router.get("/findpw", controller.findpw);

// 전체 게시물
router.get("/posts", controller.posts);

// 게시물 상세
router.get("/posts/write", controller.post_write);

// 회원가입
router.post("/signup", controller.post_signup);

// 로그인
router.post("/signin", controller.post_signin);

// 이메일 중복 체크
router.post("/signup/emailCheck", controller.post_emailCheck);

// 닉네임 중복 체크
router.post("/signup/nickNameCheck", controller.post_nickName);

module.exports = router;
