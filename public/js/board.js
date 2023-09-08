
//S3 이미지 경로 
//const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`
const IMG = 'http://localhost:8000';


//무한 스크롤 기능
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


// // 스크롤이 마지막에 도달할 때 이미지 추가
function createPost(post_id, user_id, title, content, image, category, liked, createAt, updateAt) {
    const postContainer = document.querySelector(".mood-box");
    const newPost = document.createElement("div");
    console.log(image)
    // newPost.className = `mood type${category}`
    newPost.className = "mood-itemwrap";
    newPost.innerHTML = `
    <div class="mood-item" >
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


//카테고리 버튼 
const button = document.querySelectorAll('.button');
const itemBox = document.querySelectorAll('.item-box');
console.log(button, itemBox)
for (let i = 0; i < button.length; i++) {
    button[i].addEventListener('click', function () {
        console.log(i)
        for (let j = 0; j < button.length; j++) {
            button[j].classList.remove('active');
        }
        this.classList.add('active');

        let dataFilter = this.getAttribute('data-filter');
        console.log("datafileter", dataFilter)
        for (let k = 0; k < itemBox.length; k++) {
            itemBox[k].classList.remove('active');
            itemBox[k].classList.add('hide');


            if (itemBox[k].getAttribute('data-item') == dataFilter ||
                dataFilter == "all") {
                itemBox[k].classList.remove('hide');
                itemBox[k].classList.add('active');
            }
        }
    })
}


axios({
    method: "POST",
    url: "/posts",
}).then((res) => {
    const postData = res.data.data;
    // // 좋아요 순으로 정렬
    // function sortByLikes(posts) {
    //     return posts.sort((a, b) => b.liked - a.liked);
    // }

    // // 최신순으로 정렬
    // function sortByDate(posts) {
    //     return posts.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
    // }

    // // 오래된 순으로 정렬
    // function sortByOldest(posts) {
    //     return posts.sort((a, b) => new Date(a.createAt) - new Date(b.createAt));
    // }

    // document.getElementById('latest').addEventListener('click', filterByLatest);
    // document.getElementById('oldest').addEventListener('click', filterByOldest);
    // document.getElementById('most-like').addEventListener('click', filterByLikes);

    // const postsSortedByLikes = sortByLikes([...postData]);
    // const postsSortedByDate = sortByDate([...postData]);
    // const postsSortedByOldest = sortByOldest([...postData]);

    postData.forEach((item) => {
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
})
    .catch((error) => {
        console.error(error);
    });






