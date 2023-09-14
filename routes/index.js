const express = require('express');
const router = express.Router();
const controller = require('../controller');

// 메인 페이지 이동
router.get('/', controller.main);

// 추천 페이지 이동
router.get('/recommend', controller.recommend);

// 모든 포스트 내보내기
router.post('/recommend', controller.post_recommend);

// 마이페이지
router.get('/mypage', controller.mypage);

// 마이페이지
router.get('/mypage/:user_id', controller.mypage_user_id);

// 마이페이지 내가 쓴 글
router.post('/mypage/:user_id', controller.post_mypage_user_id);

// 마이페이지 내가 댓글 단 글
router.post('/mypage/comment/:user_id', controller.mypage_comment);

// 마이페이지 내가 좋아요 한 글
router.post('/mypage/like/:user_id', controller.mypage_like);

module.exports = router;
