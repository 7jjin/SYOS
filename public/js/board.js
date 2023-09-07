
//S3 이미지 경로 
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;

// 무한 스크롤 기능
document.addEventListener("DOMContentLoaded", function () {
    const postContainer = document.querySelector(".mood-box");
    let lastPost = document.querySelector(".mood-itemwrap:last-child");

    const options = {
        threshold: 0.8, // 80%이상 보일 경우 콜백
    };

    // Intersection Observer 콜백 함수
    function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                observer.unobserve(document.querySelector(".mood-itemwrap:last-child"));
                // 새로운 포스트를 3개 추가
                for (let i = 0; i < 3; i++) {
                    createPost();
                }
                // 기존 마지막 포스트 업데이트
                lastPost = document.querySelector(".mood-itemwrap:last-child");
                observer.observe(lastPost); // 새로운 마지막 포스트를 관찰 시작
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(lastPost); // 초기에 마지막 포스트를 관찰 시작
});

// 스크롤이 마지막에 도달할 때 이미지 추가
function createPost(post_id, user_id, title, content, image, category, liked, createAt, updateAt) {
    const postContainer = document.querySelector(".mood-box");
    const newPost = document.createElement("div");
    newPost.className = `mood type${category}`
    newPost.className = "mood-itemwrap";
    newPost.innerHTML = `
    <div class="mood-item">
        <img src='${IMG + image}' alt="">
    </div>
    <div class="mood-item">
        <img src='${IMG + image}' alt="">
    </div>
    <div class="mood-item">
        <img src='${IMG + image}' alt="">
    </div>
      `;
    postContainer.appendChild(newPost);
}

//mood 카테고리 버튼 눌렀을 때 기능
const button = document.querySelectorAll(".button");

const modernBox = document.querySelector(".modern");
const naturalBox = document.querySelector(".natural");
const gameBox = document.querySelector(".game");
const studyofficeBox = document.querySelector(".study");

button.forEach(function (button) {
    button.addEventListener("click", function () {
        // 클릭된 버튼의 스타일을 변경
        button.style.backgroundColor = "white";
        button.style.color = "black";

    });
});

// //카테고리 버튼 모두 가져옴 
// const categoryBtn = document.querySelector(".mood-header");
// //카테고리별 아이템들 가져옴
// const items = document.querySelectorAll(".mood-item");

// categoryBtn.addEventListener("click", (e) => {
//     const filter = e.target.dataset.filter;
//     console.log(filter); //e.target값 확인

//     if (filter == null) {
//         return;
//     }
// });

// items.forEach((item) => {
//     if (filter === "*" || filter === item.dataset.type) {
//         item.classList.remove("invisible");
//     } else {
//         item.classList.add("invisible");
//     }
// })


axios({
    method: "POST",
    url: "/posts",
}).then((res) => {
    res.data.data.forEach((item) => {
        createPost(
            item.post_id,
            item.user_id,
            item.title,
            item.content,
            item.image,
            item.category,
            item.liked,
            item.createAt,
            item.updateAt
        );

    });
});






