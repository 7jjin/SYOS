// 스와이퍼
const swiper = new Swiper('.swiper', {
  // Optional parameters
  direction: 'horizontal',
  loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
  },

  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },

  // And if we need scrollbar
  scrollbar: {
    el: '.swiper-scrollbar',
  },
});

// 서버에서 받은 데이터 저장할 변수들
let user_id;
let user_nickname;
let created_at;
const profileSince = document.querySelector('.profileSince');

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

// 사용자가 쓴 게시물
const myPost = document.querySelector('.myPost');
const myPostSwiper = myPost.querySelector('.swiper-wrapper');

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
    case '1':
      const noPost = document.createElement('div');
      noPost.classList.add('no');
      noPost.innerText = 'There is no post';
      myPostSwiper.appendChild(noPost);
      break;
    case '2':
      console.log(myPost.length);
      myPost.forEach((post) => {
        const postBox = document.createElement('div');
        postBox.classList.add('swiper-slide');
        postBox.innerHTML = `${post.title}
          <a href="/posts/${post.post_id}">
            <img src="${post.image}" />
          </a>
        `;
        // 맨앞에서부터 추가
        myPostSwiper.insertBefore(postBox, myPostSwiper.firstChild);
      });
  }

  // posts.forEach((post) => {
  //   const postBox = document.createElement('div');
  //   postBox.classList.add('swiper-slide');
  //   postBox.classList.add('postBox');
  //   postBox.innerHTML = `
  //     <a href="/posts/${post.id}">
  //       <img src="${post.image}" alt="postImage" />
  //     </a>
  //   `;
  //   myPostSwiper.appendChild(postBox);
  // });
}

// 사용자가 댓글 단 게시물

// 사용자가 좋아요 누른 게시물
