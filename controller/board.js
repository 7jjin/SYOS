const { User, Post, Like, Comment, Product } = require('../models');

const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET;

///multer
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');

aws.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'ap-northeast-2',
});

//aws s3 인스턴스 생성
const s3 = new aws.S3();
// multer설정 - aws
exports.upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'syos-test2',
    acl: 'public-read', //파일접근권한 (public-read로 해야 업로드된 파일이 공개)
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

// 전체 게시물
exports.board = (req, res) => {
  res.render('board');
};

// 게시물 상세 (get)
exports.post_detail = (req, res) => {
  const { post_id } = req.params;
  res.render('postdetail', { post_id });
};

// 게시물 상세 (post)
exports.post_data = async (req, res) => {
  // 일단 고정 게시물
  const { post_id, login} = req.body;
  try {
    const postData = await Post.findOne({
      where: { post_id },
      include: [{ model: User, attributes: ['nickname'] }],
    });
    // 게시글 정보가 없을 경우 예외처리
    if (!postData) {
      return res.status(404).json({ error: 'Post not found' });
    }
    const user_id = postData.user_id;
    const nickName = postData.user.nickname;
    // 게시글 id에 해당하는 모든 댓글들 가져오기
    const comments = await Comment.findAll({
      where: { post_id },
      order: [['createdAt', 'ASC']],
    });
    const commentNickname = [];
    for (let i = 0; i < comments.length; i++) {
      let result = await User.findOne({
        attributes: ['nickname'],
        where: { user_id: comments[i].user_id },
      });
      commentNickname.push(result.nickname);
    }

     // 이미지 안에 있는 링크 가져오기
     const productInfo = await Product.findAll({
      where: {post_id}
    })
    console.log(productInfo);

    // 현재 사용자의 좋아요 여부 확인
    const [bearer, token] = req.headers.authorization.split(' ');
    let currentUserId;
    let currentUserNickname;
    if (login) {
      const decoded = jwt.verify(token, SECRET);
      currentUserId = decoded.user_id;
      currentUserNickname = decoded.nickName;
    } else{
      return res.json({
        postData,
        user_id,
        nickName,
        comments,
        commentNickname,
        productInfo,
      });
    }
    const isHeart = await Like.findAll({
      where: { post_id, user_id: currentUserId },
    });

   
    return res.json({
      postData,
      user_id,
      nickName,
      comments,
      commentNickname,
      isHeart,
      currentUserId,
      currentUserNickname,
      productInfo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// 좋아요 눌렀을 때
exports.patch_post_heart = async (req, res) => {
  const { post_id, isHeart, user_id } = req.body;
  const post = await Post.findOne({
    attributes: ['liked'],
    where: { post_id },
  });
  let liked = post.liked;
  if (!isHeart) {
    await Like.destroy({
      where: {
        post_id,
        user_id,
      },
    });
    liked -= 1;
  } else {
    await Like.create({
      post_id,
      user_id,
    });
    liked += 1;
  }
  await Post.update({ liked }, { where: { post_id } });
  res.json({ heartNum: liked });
};

// 댓글 추가
exports.post_post_comment = async (req, res) => {
  const { post_id, user_id, content } = req.body;
  await Comment.create({
    post_id,
    user_id,
    content,
  });
  const post = await Post.findOne({ where: { post_id } });
  if (post) {
    await post.update({ comment: post.comment + 1 });
  }
  const result =  await Comment.findOne({
    attributes: ['comment_id'],
    order: [['createdAt', 'DESC']],
    limit: 1,
  });
  res.send({ comment_id: result.comment_id });
};

// 댓글 삭제
exports.delete_post_comment = async (req, res) => { 
  const {post_id, comment_id} = req.body;
  console.log(comment_id);
  const post = await Post.findOne({ where: { post_id } });
  if (post) {
    await post.update({ comment: post.comment - 1 });
  }
  await Comment.destroy({
    where: {comment_id},
  });
  res.send({result: true});
};

// 게시물 삭제
exports.post_delete = async (req, res) => {
  const { post_id } = req.body;
  console.log(post_id);
  await Post.destroy({ where:  {post_id} });
  res.send({ result: true });
};

// 게시물 업로드 페이지
exports.uploadPost = (req, res) => {
  res.render('uploadPost');
};

// 게시물 업로드  (post)
exports.post_uploadPost = async (req, res) => {
  const { title, name, content, category, imageName, photoData } = req.body;
  console.log(photoData)
  const [bearer, token] = req.headers.authorization.split(' ');
  let currentUserId;
  if (bearer === 'Bearer') {
    const decoded = jwt.verify(token, SECRET);
    currentUserId = decoded.user_id;
  }
  await Post.create({
    user_id: currentUserId,
    name: name,
    title: title,
    image: imageName,
    content: content,
    category: category,
  });
  const result = await Post.findOne({
    attributes: ['post_id'],
    order: [['createdAt', 'DESC']],
    limit: 1,
  });
  if(photoData){
    for (let i = 0; i < photoData.length; i++) {
    Product.create({
      post_id: result.post_id,
      product_name: photoData[i].productName,
      product_link: photoData[i].productLink,
      top: photoData[i].top,
      left: photoData[i].left,
      });
    }
    res.json({result:true});  
  }
};

//All 게시물 (처음 한 번)
exports.post_all = async (req, res) => {
  const boardData = await Post.findAll({
    attributes: [
      'post_id',
      'title',
      'image',
      'liked',
      'comment',
    ],
  });
  res.json(boardData);
};

// 게시물 필터
exports.post_board_filter = async (req, res) => {
  const {filter} = req.body;
  let data;
  if(filter === 'modern'){
    data = await Post.findAll({
      where: { category: 0 },
      attributes: ['post_id', 'title', 'image','liked', 'comment']
    });
  }else if (filter === 'natural'){
    data = await Post.findAll({
      where: { category: 1 },
      attributes: ['post_id', 'title', 'image','liked', 'comment']
    });
  }else if (filter === 'game'){
    data = await Post.findAll({
      where: { category: 2 },
      attributes: ['post_id', 'title', 'image','liked', 'comment']
    });
  }else if (filter === 'study'){
    data = await Post.findAll({
      where: { category: 3 },
      attributes: ['post_id', 'title', 'image','liked', 'comment']
    });
  }else if (filter === 'latest'){
    data = await Post.findAll({
      attributes: ['post_id', 'title', 'image','liked', 'comment'],
      order: [['createdAt', 'DESC']],
    });
  }else if (filter === 'oldest'){
    data = await Post.findAll({
      attributes: ['post_id', 'title', 'image','liked', 'comment'],
      order: [['createdAt', 'ASC']],
    });
  }else if (filter === 'like'){
    data = await Post.findAll({
      attributes: ['post_id', 'title', 'image','liked', 'comment'],
      order: [['liked', 'DESC']],
    });
  }
  res.json(data);
};

exports.edit = (req, res) => {
  const post_id = req.params.postid;
  res.render('postEdit', { post_id });
};

exports.post_edit = async (req, res) => {
  const keys = Object.keys(req.body);
  const post_id = String(keys[0]);
  console.log(post_id);
  const postsData = await Post.findOne({
    where: {
      post_id
    },
  });
  const result = await Post.findOne({
    where: { post_id },
    include: [{ model: User, attributes: ['nickname'] }],
  });
  const photo = await Product.findAll({
    where: { post_id },
    
  })
  const nickName = result.user.nickname;
  res.json({ postsData,nickName,photo });
};

// 게시글 수정(posts 테이블)
exports.patch_post_edit = async (req, res) => {
  const {title,content,category,photo} = req.body.data;
  await Post.update({
    title,content,category
  },{
    where:{post_id:req.body.post_id}
  });

  res.json({result_edit:true})
};


// 게시글 수정(product 테이블)
exports.delete_post_delt = async (req, res) => {
  const {title,content,category,photo} = req.body.data;
  console.log(photo)
  await Product.destroy({where:{post_id:req.body.post_id}});
  for (let i = 0; i < photo.length; i++) {
    Product.create({
      post_id: req.body.post_id,
      product_name: photo[i].productName,
      product_link: photo[i].productLink,
      top: photo[i].top,
      left: photo[i].left,
    });
  }
  
  res.json({result_create:true})
};

exports.patch_post_edit = (req, res) => {
  console.log('a');

};


//모두 destory 후 다시 생성