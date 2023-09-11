const express = require('express');
const router = express.Router();
const controller = require('../controller/oauth');

// 회원가입 페이지 이동
router.get('/signup', controller.signup);

// 로그인 페이지 이동
router.get('/signin', controller.signin);

// 비밀번호 찾기 페이지 이동
router.get('/resetPw', controller.resetPw);

// 회원가입
router.post('/signup', controller.post_signup);

// 로그인
router.post('/signin', controller.post_signin);

// 이메일 중복 체크
router.post('/signup/emailCheck', controller.post_emailCheck);

// 닉네임 중복 체크
router.post('/signup/nickNameCheck', controller.post_nickName);

// 구글 로그인
router.get('/signin/google', controller.google_signin);

// 액세스 토큰 받기
router.get('/signin/google/redirect', controller.google_redirect);

// 비밀번호 재설정
router.post('/resetPw', controller.post_resetPw);

// 비밀번호 재설정 patch
router.patch('/resetPw', controller.patch_resetPw);

module.exports = router;