// 서버에서 받은 데이터 저장할 변수들
let user_id;
let user_nickname;
let created_at;
const profileSince = document.querySelector('.profileSince');

//S3 이미지 경로
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;

// ejs에서 saveId 함수에 user_id를 넘겨주면 user_id에 저장
function saveId(userId) {
  user_id = userId;
}

// ejs에서 saveNickname 함수에 user_nickname을 넘겨주면 user_nickname에 저장
function saveNickname(nickName) {
  user_nickname = nickName;
}

// ejs에서 saveDate 함수에 created_at을 넘겨주면 created_at에 저장
function saveDate(date) {
  dateString = date;
  formatDate(dateString);
}

// Since 문구 생성
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  profileSince.innerText = `Since ${year}.${month}.${day}`;
}

// -------------------- //

// 내가 쓴 게시물
const myPost = document.querySelector('.myPost');
const myPostCarousel = document.querySelector('#myPostCarousel');
const myPostInner = myPostCarousel.querySelector('.carousel-inner');
const myPostBtn1 = myPost.querySelectorAll('button')[0];
const myPostBtn2 = myPost.querySelectorAll('button')[1];

// 내가 쓴 게시물 가져오기
async function getMyPost() {
  const res = await axios({
    method: 'post',
    url: `/mypage/${user_id}`,
    data: {
      user_id,
    },
  });

  const { result, myPost } = res.data;
  console.log(myPost);

  switch (result) {
    case '1': // 게시물 없음
      const postDiv = document.createElement('div');
      postDiv.classList.add('carousel-item');
      postDiv.classList.add('active');
      postDiv.classList.add('no');
      postDiv.innerText = 'There is no post.';
      myPostInner.appendChild(postDiv);
      break;
    case '2': // 게시물 있을 때 생성하는 곳
      let cnt = 0; // cnt 0일 때 active 생성하려고

      if (myPost.length == 1) { // 게시물 1개면 버튼 없애기
        myPostBtn1.style.display = 'none';
        myPostBtn2.style.display = 'none';
      }

      myPost.forEach((post) => {
        const postDiv = document.createElement('div');

        postDiv.addEventListener('click', () => {
          location.href = `/board/${post.post_id}`;
        });

        postDiv.classList.add('carousel-item');
        postDiv.classList.add('item-box');

        if (cnt === 0) {
          // 첫번째 게시물에 active 추가
          postDiv.classList.add('active');
        }

        postDiv.innerHTML = `
            <img src="${IMG + post.image}" />

              <div class="text-container">
                <div class="text-box">
                    <div class="title"> ${post.title}</div>
                </div>
              </div>

              <div class="res-container">
                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #000000;"></i>
                        <p class="liked">${post.liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                        <p class="comment">${post.comment}</p>
                    </div>
                </div>
              </div>`;
        // const postImg = document.createElement('img');
        // postImg.src = `${IMG + post.image}`;
        // postDiv.appendChild(postImg);
        myPostInner.appendChild(postDiv);
        cnt++;
      });
      break;
  }
}

// -------------------- //

// 내가 댓글 단 게시물
const myComment = document.querySelector('.myComment');
const myCommentCarousel = document.querySelector('#myCommentCarousel');
const myCommentInner = myCommentCarousel.querySelector('.carousel-inner');
const myCommentBtn1 = myComment.querySelectorAll('button')[0];
const myCommentBtn2 = myComment.querySelectorAll('button')[1];

// 내가 댓글 단 게시물 가져오기
async function getMyComment() {
  const res = await axios({
    method: 'post',
    url: `/mypage/comment/${user_id}`,
    data: {
      user_id,
    },
  });

  const { result, myCommentPost } = res.data;

  switch (result) {
    case '1': // 댓글 없음
      myCommentBtn1.style.display = 'none';
      myCommentBtn2.style.display = 'none';
      const commentDiv = document.createElement('div');
      commentDiv.classList.add('carousel-item');
      commentDiv.classList.add('active');
      commentDiv.classList.add('no');
      commentDiv.innerText = 'There is no comment.';
      myCommentInner.appendChild(commentDiv);
      break;
    case '2': // 댓글 있을 때 생성하는 곳
      let cnt = 0; // cnt 0일 때 active 생성하려고

      if (myCommentPost.length == 1) { // 게시물 1개면 버튼 없애기
        myCommentBtn1.style.display = 'none';
        myCommentBtn2.style.display = 'none';
      }

      myCommentPost.forEach((post) => {
        const commentDiv = document.createElement('div');

        commentDiv.addEventListener('click', () => {
          location.href = `/board/${post.post_id}`;
        });

        commentDiv.classList.add('carousel-item');
        commentDiv.classList.add('item-box');

        if (cnt === 0) {
          // 첫번째 게시물에 active 추가
          commentDiv.classList.add('active');
        }

        commentDiv.innerHTML = `
            <img src="${IMG + post.image}" />

              <div class="text-container">
                <div class="text-box">
                    <div class="title"> ${post.title}</div>
                </div>
              </div>

              <div class="res-container">
                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #000000;"></i>
                        <p class="liked">${post.liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                        <p class="comment">${post.comment}</p>
                    </div>
                </div>
              </div>`;
        // const commentImg = document.createElement('img');
        // commentImg.src = `${IMG + post.image}`;
        // commentDiv.appendChild(commentImg);
        myCommentInner.appendChild(commentDiv);
        cnt++;
      });
      break;
  }
}

// -------------------- //

// 내가 좋아요 누른 게시물
const myLiked = document.querySelector('.myLiked');
const myLikedCarousel = document.querySelector('#myLikedCarousel');
const myLikedInner = myLikedCarousel.querySelector('.carousel-inner');
const myLikedBtn1 = myLiked.querySelectorAll('button')[0];
const myLikedBtn2 = myLiked.querySelectorAll('button')[1];

// 내가 좋아요 누른 게시물 가져오기
async function getMyLiked() {
  const res = await axios({
    method: 'post',
    url: `/mypage/like/${user_id}`,
    data: {
      user_id,
    },
  });

  const { result, myLikedPost } = res.data;

  switch (result) {
    case '1': // 좋아요 한 게시물 없음
      myLikedBtn1.style.display = 'none';
      myLikedBtn2.style.display = 'none';
      const likedDiv = document.createElement('div');
      likedDiv.classList.add('carousel-item');
      likedDiv.classList.add('active');
      likedDiv.classList.add('no');
      likedDiv.innerText = 'There is no liked post.';
      myLikedInner.appendChild(likedDiv);
      break;
    case '2': // 좋아요 한 게시물 있을 때 생성하는 곳
      let cnt = 0; // cnt 0일 때 active 생성하려고
      
      if (myLikedPost.length == 1) { // 게시물 1개면 버튼 없애기
        myLikedBtn1.style.display = 'none';
        myLikedBtn2.style.display = 'none';
      }

      myLikedPost.forEach((post) => {
        const likedDiv = document.createElement('div');

        likedDiv.addEventListener('click', () => {
          location.href = `/board/${post.post_id}`;
        });

        likedDiv.classList.add('carousel-item');
        likedDiv.classList.add('item-box');

        if (cnt === 0) {
          // 첫번째 게시물에 active 추가
          likedDiv.classList.add('active');
        }

        likedDiv.innerHTML = `
            <img src="${IMG + post.image}" />
            
              <div class="text-container">
                <div class="text-box">
                    <div class="title"> ${post.title}</div>
                </div>
              </div>

              <div class="res-container">
                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #000000;"></i>
                        <p class="liked">${post.liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                        <p class="comment">${post.comment}</p>
                    </div>
                </div>
              </div>`;
        // const likedImg = document.createElement('img');
        // likedImg.src = `${IMG + post.image}`;
        // likedDiv.appendChild(likedImg);
        myLikedInner.appendChild(likedDiv);
        cnt++;
      });
      break;
  }
}
