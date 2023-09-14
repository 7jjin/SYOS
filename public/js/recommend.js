//S3 이미지 경로
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;

// 추천에 맞는 포스트 추가 함수

const recommendPost = document.querySelector('.recommend-posts');

const result = document.querySelectorAll('.result');

// 웹캠 설정 부분 시작

const per = document.querySelectorAll('.per');
const URL = 'https://teachablemachine.withgoogle.com/models/mxuNZiol6/';

let model, webcam, labelContainer, maxPredictions, maxIndex;
let data = [];

// 이미지 모델을 분석 및 웹캠 설정
const uploadImageForm = document.querySelector('.upload-image-form');
uploadImageForm.addEventListener('click', init);
async function init() {
  uploadImageForm.removeEventListener('click', init);

  const cameraIcon = document.querySelector('.fa-camera');
  cameraIcon.style.display = 'none';
  const modelURL = URL + 'model.json';
  const metadataURL = URL + 'metadata.json';
  const webcamContainer = document.querySelectorAll('#webcam-container');
  const loading = document.createElement('div');
  loading.className = 'loading';
  uploadImageForm.appendChild(loading);

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  //
  const flip = true;
  webcam = new tmImage.Webcam(700, 400, flip); // 높이, 너비, 상태
  await webcam.setup();
  await webcam.play();
  uploadImageForm.removeChild(loading);
  window.requestAnimationFrame(loop);
  document.querySelector('.upload-image-wrapper').style.border = 'none';

  // 웹캠에 화면 출력
  document.getElementById('webcam-container').appendChild(webcam.canvas);

  // 5초 후에 웹캠을 멈추는 함수
  setTimeout(() => {
    webcam.stop();
    // 웹캠이 꺼진 후 배열에 가장 높은 비율의 카테고리 index를 구하는 함수 (0:moden, 1:office, 2:study, 3:natural)
    let array = [];
    per.forEach((item) => {
      array.push(item.innerText);
    });
    let intArr = array.map(function (value) {
      return parseInt(value.replace('%', ''));
    });

    // 최댓값을 구합니다.
    let maxValue = Math.max.apply(null, intArr);

    // 최댓값의 인덱스를 찾습니다.
    maxIndex = intArr.indexOf(maxValue);
    console.log(maxIndex);
    result[maxIndex].firstElementChild.style.backgroundColor = 'rgb(33, 53, 85)';

    // 선택된 카테고리 포스터만 보이게 하기
    const postElements = document.querySelectorAll('.post1');
    postElements.forEach((element) => {
      element.style.display = 'none';
    });

    // 'type0' 클래스를 가진 요소들만 표시합니다.
    const modenPosts = document.querySelectorAll(`.type${maxIndex}`);
    modenPosts.forEach((element, index) => {
      recommendPost.style.display = 'block';
      if (index < 4) element.style.display = 'block';
      recommendPost.scrollIntoView({ behavior: 'smooth' });
    });
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

// 추천 post 만들기
function createPost(post_id, image, category, liked, product_link, title, comment) {
  const postContainer = document.querySelector('.posts-box');
  const newPost = document.createElement('div');
  newPost.className = `post1 type${category}`;
  newPost.innerHTML = `
    <div class="post-text" >
        <image src='${IMG + image}'style="height:100%">
        <div class="hidden-box">
            <div class="text-box">
                <span>${title}</span>
            </div>
            <div class="post-bar">
                <div class="heart-box">
                    <div class="heart">
                        <i class="fa-solid fa-heart"></i>
                        <p class="count">${liked}</p>
                    </div>
                </div>
                <div class="review-box">
                    <div class="review">
                        <i class="fa-brands fa-speakap"></i>
                        <p class="count">${comment}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
      `;
  postContainer.appendChild(newPost);
}

// DB에서 보낸 데이터들을 불러와서 포스트를 만드는 함수의 매개변수에 넣는다.
axios({
  method: 'POST',
  url: '/recommend',
  data,
}).then((res) => {
  res.data.data.forEach((item) => {
    createPost(item.post_id, item.image, item.category, item.liked, item.product_link, item.title, item.comment); // 모든 포스터를 가져온다.
  });
});

///////////////////////////////////////// 카테고리별 눌렀을 때 기능 //////////////////////////////////
// 'moden-box result'를 클릭할 때

const modenBox = document.querySelector('.moden-box');
const officeBox = document.querySelector('.office-box');
const studyBox = document.querySelector('.study-box');
const naturalBox = document.querySelector('.natural-box');

modenBox.addEventListener('click', function () {
  clickColor(modenBox);

  // 'post1' 클래스를 가진 포스트들을 숨깁니다.
  const postElements = document.querySelectorAll('.post1');
  postElements.forEach((element) => {
    element.style.display = 'none';
  });

  // 'type0' 클래스를 가진 포스트들만 표시합니다.
  const modenPosts = document.querySelectorAll('.type0');
  modenPosts.forEach((element, index) => {
    if (index < 4) element.style.display = 'block';
  });
});

// 'office-box result'를 클릭할 때
officeBox.addEventListener('click', function () {
  clickColor(officeBox);
  // 'post1' 클래스를 가진 포스트들을 숨깁니다.
  const postElements = document.querySelectorAll('.post1');
  postElements.forEach((element) => {
    element.style.display = 'none';
  });

  // 'type1' 클래스를 가진 포스트들만 표시합니다.
  const officePosts = document.querySelectorAll('.type1');
  officePosts.forEach((element, index) => {
    if (index < 4) element.style.display = 'block';
  });
});

// 'study-box result'를 클릭할 때
studyBox.addEventListener('click', function () {
  clickColor(studyBox);
  // 'post1' 클래스를 가진 포스트들을 숨깁니다.
  const postElements = document.querySelectorAll('.post1');
  postElements.forEach((element) => {
    element.style.display = 'none';
  });

  // 'type2' 클래스를 가진 포스트들만 표시합니다.
  const officePosts = document.querySelectorAll('.type2');
  officePosts.forEach((element, index) => {
    if (index < 4) element.style.display = 'block';
  });
});

// 'natural-box result'를 클릭할 때
naturalBox.addEventListener('click', function () {
  clickColor(naturalBox);
  // 'post1' 클래스를 가진 포스트들을 숨깁니다.
  const postElements = document.querySelectorAll('.post1');
  postElements.forEach((element) => {
    element.style.display = 'none';
  });

  // 'type3' 클래스를 가진 포스트들만 표시합니다.
  const officePosts = document.querySelectorAll('.type3');
  officePosts.forEach((element, index) => {
    if (index < 4) element.style.display = 'block';
  });
});

// 클릭된 버튼만 색 바뀌는 함수
function clickColor(clicked) {
  result.forEach((element) => {
    element.firstElementChild.style.backgroundColor = 'white';
  });
  clicked.firstElementChild.style.backgroundColor = '#213555';
}
/////////////////////////////////////////////////////////////////////////////////////////////

const gopost = document.querySelector('.move-box-inner');
gopost.addEventListener('click', function () {
  window.location.href = '/board';
});
