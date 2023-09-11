const { User, Post } = require('../models'); // index.js 생략

const jwt = require('jsonwebtoken');

// 메인 페이지 이동
const main = async (req, res) => {
  try {
    const mostLikedPost = await Post.findOne({
      attributes: ['post_id', 'title', 'image', 'liked', 'comment'],
      order: [['liked', 'DESC']],
    });

    const mostCommentedPost = await Post.findOne({
      attributes: ['post_id', 'title', 'image', 'comment', 'liked', 'comment'],
      order: [['comment', 'DESC']],
    });

    console.log('가장 많이 좋아요 받은 포스트:', mostLikedPost);
    console.log('가장 많은 댓글이 달린 포스트:', mostCommentedPost);

    res.render('index', {
      likeId: mostLikedPost.post_id,
      // likeTitle: mostLikedPost.title,
      likeImage: mostLikedPost.image,
      likeLiked: mostLikedPost.liked,
      likeComment: mostLikedPost.comment,
      commentId: mostCommentedPost.post_id,
      // commentTitle: mostCommentedPost.title,
      commentImage: mostCommentedPost.image,
      commentLiked: mostCommentedPost.liked,
      commentComment: mostCommentedPost.comment,
    });
  } catch (error) {
    console.error();
  }
};

// 추천 페이지 이동
const recommend = (req, res) => {
  res.render('recommend');
};

const post_recommend = (req, res) => {
  Post.findAll({}).then((result) => {
    res.json({ data: result });
  });
};

// 마이페이지
const mypage = (req, res) => {
  // jwt 토큰으로 유저 정보 가져오기
  const [bearer, token] = req.headers.authorization.split(' ');
  if (bearer === 'Bearer') {
    try {
      const decoded = jwt.verify(token, SECRET);
      const { user_id } = decoded;
      res.json({ user_id });
    } catch (err) {
      res.render('signin');
    }
  } else {
    res.render('signin');
  }
};

const mypage_user_id = async (req, res) => {
  const { user_id } = req.params;

  const result = await User.findOne({
    where: {
      user_id,
    },
  });

  res.render('myPage', { user: result });
};

// 마이페이지 정보 가져오기
const post_mypage_user_id = async (req, res) => {
  const { user_id } = req.params;

  const myPost = await Post.findAll({
    where: {
      user_id,
    },
  });

  console.log(myPost);

  if (myPost.length == 0) {
    console.log('게시물 없음!!!!!!');
    res.json({ result: '1' });
  } else {
    console.log('게시물 있음 !!!!!');
    res.json({ result: '2', myPost });
  }
};

module.exports = {
  main,
  recommend,
  mypage,
  mypage_user_id,

  post_recommend,
  post_mypage_user_id,
};