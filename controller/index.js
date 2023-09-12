const { User, Post, Comment, Like } = require('../models'); // index.js 생략

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

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
    res.json({ result: '1' });
  } else {
    res.json({ result: '2', myPost });
  }
};

// 마이페이지 댓글 가져오기
const mypage_comment = async (req, res) => {
  const { user_id } = req.params;

  const myComments = await Comment.findAll({
    where: {
      user_id,
    },
    attributes: ['post_id'],
    distinct: true,
  });

  // 댓글이 없는 경우
  if (myComments.length == 0) {
    res.json({ result: '1' });
  } else {
    // 댓글 있을 때 찾은 게시물의 post_id로 정보 다시 찾기
    const myCommentPost = [];

    for (let i = 0; i < myComments.length; i++) {
      const post = await Post.findOne({
        where: {
          post_id: myComments[i].post_id,
        },
      });
      myCommentPost.push(post);
    }

    res.json({ result: '2', myCommentPost });
  }
};

// 마이페이지 좋아요 가져오기
const mypage_like = async (req, res) => {
  const { user_id } = req.params;

  const myLiked = await Like.findAll({
    where: {
      user_id,
    },
    attributes: ['post_id'],
    distinct: true,
  });

  // 좋아요 한 게시물이 없는 경우
  if (myLiked.length == 0) {
    res.json({ result: '1' });
  } else {
    // 좋아요 한 게시물이 있는 경우 post_id로 정보 다시 찾기
    const myLikedPost = [];

    for (let i = 0; i < myLiked.length; i++) {
      const post = await Post.findOne({
        where: {
          post_id: myLiked[i].post_id,
        },
      });
      myLikedPost.push(post);
    }

    res.json({ result: '2', myLikedPost });
  }
};

module.exports = {
  main,
  recommend,
  mypage,
  mypage_user_id,

  post_recommend,
  post_mypage_user_id,
  mypage_comment,
  mypage_like,
};
