// 무한 스크롤 기능
document.addEventListener("DOMContentLoaded", function () {
  const postContainer = document.querySelector(".posts-box");
  let lastPost = document.querySelector(".post1:last-child");

  const options = {
    threshold: 0.8, // 80%이상 보일 경우 콜백
  };

  // Intersection Observer 콜백 함수
  function handleIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        observer.unobserve(document.querySelector(".post1:last-child"));
        // 새로운 포스트를 4개 추가
        for (let i = 0; i < 4; i++) {
          createPost();
        }
        // 기존 마지막 포스트 업데이트
        lastPost = document.querySelector(".post1:last-child");
        observer.observe(lastPost); // 새로운 마지막 포스트를 관찰 시작
      }
    });
  }

  const observer = new IntersectionObserver(handleIntersection, options);
  observer.observe(lastPost); // 초기에 마지막 포스트를 관찰 시작
});

// 올린 이미지에 맞는 스타일 추가
function createPost() {
  const postContainer = document.querySelector(".posts-box");
  const newPost = document.createElement("div");
  newPost.className = "post1";
  newPost.innerHTML = `
    <div class="post-text" >
        <image src="/images/desk.jpg" alt="책상" style="height:100%">
        <div class="hidden-box">
            <div class="text-box">
                <span>desk: 국내 최고 목수가 만든 책상</span>
                <span>chair: 고오급 의자</span>
                <span>desktop: 최고사양 컴퓨터</span>
            </div>
            <div class="post-bar">
                <div class="heart-box">
                    <div class="heart">
                        <i class="fa-solid fa-heart"></i>
                        <p class="count">1,379</p>
                    </div>
                </div>
                <div class="review-box">
                    <div class="review">
                        <i class="fa-brands fa-speakap"></i>
                        <p class="count">123</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
      `;
  postContainer.appendChild(newPost);
}

// 이미지 올리기
const formsFile = document.forms["upload-image-form"];
const button = document.querySelector(".search");
const uploadImageForm = document.querySelector(".upload-image-form");
const uploadImageWrapper = document.querySelector(".upload-image-wrapper");
const btnUpload = document.querySelector(".btn-upload");
const inputImage = document.querySelector("#input-image");

inputImage.addEventListener("change", () => {
  const selectFile = inputImage.files[0]; // input에서 선택된 파일
  if (selectFile) {
    const imageUrl = URL.createObjectURL(selectFile);
    uploadImageForm.style.backgroundImage = `url('${imageUrl}')`;
    uploadImageForm.style.backgroundSize = "cover";
    uploadImageForm.style.backgroundRepeat = "no-repeat";
    uploadImageForm.style.borderRadius = "20px";
    uploadImageWrapper.style.border = "none";
    btnUpload.innerHTML = "";
  }
});
