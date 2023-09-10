const express = require('express');
const router = express.Router();
const controller = require('../controller');

// 메인 페이지 이동
router.get('/', controller.main);

// 추천 페이지 이동
router.get('/recommend', controller.recommend);

// 모든 포스트 내보내기
router.post('/recommend', controller.post_recommend);

// 포스트 업로드 페이지
router.get('/uploadPost', controller.uploadPost);

// 포스트 업로드
router.post(
  '/uploadPost',
  controller.upload.single('image'),
  controller.post_uploadPost
);

// 회원가입 페이지 이동
router.get('/signup', controller.signup);

// 로그인 페이지 이동
router.get('/signin', controller.signin);

// 비밀번호 찾기 페이지 이동
router.get('/resetPw', controller.resetPw);

// 전체 게시물
router.get('/posts', controller.posts);

// 전체 게시물
router.post('/posts', controller.post_posts);

// 게시물 상세
router.get('/posts/write', controller.post_write);

// 마이페이지
router.get('/mypage', controller.mypage);

// 마이페이지
router.get('/mypage/:user_id', controller.mypage_user_id);

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

// 게시물 상세 페이지 데이터 가져오기
router.post('/posts/write', controller.post_write_data);

module.exports = router;
