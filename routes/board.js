const express = require('express');
const router = express.Router();
const controller = require('../controller/board');

// 전체 게시물
router.get('/', controller.board);

// 전체 게시물
router.post('/', controller.post_board);

// 게시물 상세 페이지 데이터 가져오기
router.post('/detail', controller.post_data);

// 좋아요 누름
router.patch('/detail/heart', controller.patch_post_heart);

// 댓글 입력
router.post('/detail/comment', controller.post_post_comment);

// 댓글 삭제
router.post('/detail/comment/delete', controller.delete_post_comment);

// 게시물 업로드 페이지
router.get('/upload', controller.uploadPost);

// 게시물 업로드
router.post(
  '/upload',
  controller.upload.single('image'),
  controller.post_uploadPost
);

// ALl 게시물
router.post('/all', controller.post_all);

// 게시물 필터
router.post('/filter', controller.post_board_filter);

// 게시물 상세
router.get('/:post_id', controller.post_detail);

// 게시물 삭제
router.delete('/:postid/delete', controller.post_delete);

// 게시물 수정
router.get('/:postid/edit', controller.post_edit);

// 게시물 수정 (patch)
router.patch('/:postid/edit', controller.patch_post_edit);

// 게시물 삭제
router.delete('/:postid/delete', controller.post_delete);

// 게시물 상세
router.get('/:post_id', controller.post_detail);

module.exports = router;
