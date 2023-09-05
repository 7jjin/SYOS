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

// 웹캠 설정 부분 시작

const per = document.querySelectorAll(".per");
const URL = "https://teachablemachine.withgoogle.com/models/Is29DJcYn/";

let model, webcam, labelContainer, maxPredictions;
let data = [];

// 이미지 모델을 분석 및 웹캠 설정
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  //
  const flip = true;
  webcam = new tmImage.Webcam(700, 400, flip); // 높이, 너비, 상태
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  // 웹캠에 화면 출력
  document.getElementById("webcam-container").appendChild(webcam.canvas);

  // 5초 후에 웹캠을 멈추는 함수
  setTimeout(() => {
    webcam.stop();
  }, 5000);
}

// 웹캠이 동작 할 동안 계속 화면을 업데이트 시켜주는 함수
async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

// 웹캠을 분석해서 그에 맞는 결과를 출력해주는 함수
async function predict() {
  const prediction = await model.predict(webcam.canvas);
  for (let i = 0; i < maxPredictions; i++) {
    // 결과값을 백분위로 분석해서 각각의 카테고리에 추가
    const classPrediction = `${prediction[i].probability.toFixed(1) * 100}%`;
    per[i].childNodes[1].innerHTML = classPrediction;
  }
}
