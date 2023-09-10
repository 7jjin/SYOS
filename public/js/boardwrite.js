const heart = document.querySelector('.fa-heart');
const heartNum = document.querySelector('#heart-number');
const commentNum = document.querySelector('#comment-number');
let userId;
let nickName;

// axios로 필요한 데이터 요청
const token = localStorage.getItem('token');
const fetchData = async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/posts/write',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(res);
    // 데이터 불러와서 렌더링
    const writerNickname = document.querySelector('.header-nickname');
    const postImage = document.querySelector('.post-img');
    const postContent = document.querySelector('#post-content');
    const commentList = document.querySelector('#comment-list');
    writerNickname.textContent = `${res.data.nickName}`;
    postImage.src = res.data.postData.image;
    nickName = res.data.currentUserNickname;
    userId = res.data.currentUserId;

    if (res.data.isHeart.length !== 0) {
      heart.classList.remove('fa-regular');
      heart.classList.add('fa-solid');
      heart.style.color = '#ec4141';
    }

    heartNum.textContent = res.data.postData.liked;
    commentNum.textContent = res.data.postData.comment;
    postContent.textContent = res.data.postData.content;

    // 댓글 렌더링
    for (let i = 0; i < res.data.comments.length; i++) {
      const commentBox = document.createElement('li');
      const commentWriter = document.createElement('div');
      const commentText = document.createElement('div');
      commentBox.classList.add('comment-box');
      commentWriter.classList.add('user-name');
      commentText.classList.add('user-comment');
      commentWriter.textContent = `${res.data.commentNickname[i]}`;
      commentText.textContent = `${res.data.comments[i].content}`;
      commentBox.appendChild(commentWriter);
      commentBox.appendChild(commentText);
      commentList.appendChild(commentBox);
    }
  } catch (error) {
    console.error(error);
  }
};

// 페이지 로드될 때 실행
fetchData();

// 좋아요 누를 때 UI 변경 및 DB 업데이트
heart.addEventListener('click', async () => {
  let isHeart;
  if (heart.classList.contains('fa-solid')) {
    heart.classList.remove('fa-solid');
    heart.classList.add('fa-regular');
    heart.style.color = '';
    isHeart = false;
  } else {
    heart.classList.remove('fa-regular');
    heart.classList.add('fa-solid');
    heart.style.color = '#ec4141';
    isHeart = true;
  }
  const res = await axios({
    method: 'PATCH',
    url: '/posts/write/heart',
    data: { isHeart, userId },
  });
  const number = res.data.heartNum;
  heartNum.textContent = `${number}`;
});

// 댓글 입력
const addComment = async(e) => {
  e.preventDefault();
  const comments = document.getElementById('comments');
  const content = comments.value;

  if (!nickName) {
    alert('로그인이 필요합니다.');
    comments.value = '';
    return;
  }
  if (content.trim() === '') {
    alert('Please enter comments.');
    return;
  }

  const result = await axios({
    method: 'POST',
    url: '/posts/write/comment',
    data: {
      user_id: userId,
      content,
    },
  });
  if (result.data.result) {
    const commentList = document.getElementById('comment-list');
    const commentBox = document.createElement('li');
    const commentWriter = document.createElement('div');
    const commentText = document.createElement('div');
    commentBox.classList.add('comment-box');
    commentWriter.classList.add('user-name');
    commentText.classList.add('user-comment');
    commentWriter.textContent = nickName;
    commentText.textContent = content;
    commentBox.appendChild(commentWriter);
    commentBox.appendChild(commentText);
    commentList.appendChild(commentBox);
    comments.value = '';
  }
}
