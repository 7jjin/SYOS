//S3 이미지 경로
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`

// //무한 스크롤 기능
// document.addEventListener("DOMContentLoaded", function () {
//     const postContainer = document.querySelector(".mood-box");
//     let lastPost = document.querySelector(".mood-itemwrap:last-child");

//     const options = {
//         threshold: 0.8, // 80%이상 보일 경우 콜백
//     };

//     // Intersection Observer 콜백 함수
//     function handleIntersection(entries, observer) {
//         entries.forEach((entry) => {
//             if (entry.isIntersecting) {
//                 observer.unobserve(document.querySelector(".mood-itemwrap:last-child"));
//                 // 새로운 포스트를 3개 추가
//                 for (let i = 0; i < 3; i++) {
//                     createPost();
//                 }
//                 // 기존 마지막 포스트 업데이트
//                 lastPost = document.querySelector(".mood-itemwrap:last-child");
//                 observer.observe(lastPost); // 새로운 마지막 포스트를 관찰 시작
//             }
//         });
//     }

//     const observer = new IntersectionObserver(handleIntersection, options);
//     observer.observe(lastPost); // 초기에 마지막 포스트를 관찰 시작
// });

// // 스크롤이 마지막에 도달할 때 이미지 추가
// function createPost(user_id, title, content, image, category, liked, createAt) {
//     const postContainer = document.querySelector(".mood-box");
//     const newPost = document.createElement("div");
//     console.log(image)
//     // newPost.className = `mood type${category}`
//     newPost.className = "mood-itemwrap";
//     newPost.innerHTML = `
//     <div class="mood-item" >
//         <img src='${IMG + image}' alt="">
//     </div>
//     <div class="mood-item">
//         <img src='${IMG + image}' alt="">
//     </div>
//     <div class="mood-item">
//         <img src='${IMG + image}' alt="">
//     </div>
//       `;
//     postContainer.appendChild(newPost);
// }

//카테고리 버튼
document.addEventListener("DOMContentLoaded", function () {
  const filter = document.querySelectorAll(".filter");

  filter.forEach(function (filterBtn) {
    filterBtn.addEventListener("click", function () {
      filter.forEach(function (btn) {
        btn.classList.remove("active");
      });
      this.classList.add("active");
    });
  });
});



// 페이지 렌더될 때 데이터 가져오기
const fetchData = async () => {
  const res = await axios({
    method: 'POST',
    url: '/board/all',
  });
  console.log(res);

  // 게시물 생성
  for (let i = 0; i < res.data.length; i++) {
    const postCreate = document.createElement('div');
    const container = document.getElementById('mood-itemwrap');
    postCreate.classList.add('item-box');

    // 게시물과 post_id 연결
    postCreate.addEventListener('click', () => {
      location.href = `/board/${res.data[i].post_id}`;
    });

    postCreate.innerHTML = `
            <img src="${res.data[i].image}" />

              <div class="text-container">
                <div class="text-box">
                    <div class="title"> ${res.data[i].title}</div>
                </div>
              </div>   

              <div class="res-container">
                <div class="res-box">
                    <div class="heart-box">
                        <i class="fa-solid fa-heart" style="color: #000000;"></i>                          
                        <p class="liked">${res.data[i].liked}</p>
                    </div>
                    <div class="comment-box">
                        <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                        <p class="comment">${res.data[i].comment}</p>
                    </div>
                </div>
              </div>`;

    // 게시물 랜덤 페이드인 효과 (0.4초)
    const randomDelay = Math.floor(Math.random() * 400);
    postCreate.style.animation = `fadeIn 1s forwards ${randomDelay}ms`;

    container.appendChild(postCreate);
  }
};

fetchData();

// 버튼 선택할 때마다 axios로 값 보내주기
const filter = document.querySelectorAll('input[name="filter"]');
filter.forEach((filter) => {
  filter.addEventListener('change', async () => {
    const posts = await axios({
      method: 'POST',
      url: '/board/filter',
      data: { filter: filter.value },
    });
    console.log(posts);
    const container = document.getElementById('mood-itemwrap');
    container.innerHTML = ``;
    // 게시물 생성
    for (let i = 0; i < posts.data.length; i++) {
      console.log(i);
      const postCreate = document.createElement('div');
      postCreate.classList.add('item-box');
      // 게시물과 post_id 연결
      postCreate.addEventListener('click', () => {
        location.href = `/board/${posts.data[i].post_id}`;
      });

      postCreate.innerHTML = `
                <img src="${posts.data[i].image}" />

                
                <div class="text-container" >
                    <div class="text-box">
                        <div class="title">${posts.data[i].title}</div>
                    </div>
                </div>   
    
                <div class="res-container">
                    <div class="res-box">
                        <div class="heart-box">
                            <i class="fa-solid fa-heart" style="color: #000000;"></i>                           
                            <p class="liked">${posts.data[i].liked}</p>
                        </div>
                        <div class="comment-box">
                            <i class="fa-solid fa-comment fa-flip-horizontal" style="color: #000000;"></i>
                            <p class="comment">${posts.data[i].comment}</p>
                        </div>
                    </div>
                  </div>`;

      const randomDelay = Math.floor(Math.random() * 500);
      postCreate.style.animation = `fadeIn 2s forwards ${randomDelay}ms`;

      container.appendChild(postCreate);
    }
  });
});

// write 버튼 누르면 작성 페이지로 이동 
const write = document.querySelector(".write");
write.addEventListener('click', () => {
  axios({
    method: "GET",
    url: "/board/upload",
  }).then((res) => {
    location.href = "/board/upload";
  })
})