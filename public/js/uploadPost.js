// text editor 사용함수
tinymce.init({
  selector: '#mytextarea',
});

/////// upload할 이미지 미리보기
const imageBox = document.querySelector('.image-box');
const imageInput = document.getElementById('image');
const uploadImageLabel = document.querySelector('.upload-image label');
const carmeraIcon = document.querySelector('.upload-image i');
const carmeraTitle = document.querySelector('.upload-image p');
const linkTag = document.querySelector('.add-link-wrapper');
const uploadImage = document.querySelector('.upload-image');

let IsfileUpload = true;

imageInput.addEventListener('change', function (event) {
  // 파일을 경로
  const file = this.files[0];

  // 경로가 있다면 (사진을 올렸을 경우) 실행
  if (file) {
    console.log(IsfileUpload);
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      uploadImageLabel.style.backgroundImage = `url('${imageUrl}')`;
      uploadImageLabel.style.backgroundPosition = 'center';
      uploadImageLabel.style.backgroundSize = 'cover';
      carmeraIcon.style.display = 'none';
      carmeraTitle.style.display = 'none';

      imageInput.disabled = true;
      // 링크 태그 on
      linkTag.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    // 경로가 없을 경우 (사진이 없을 경우)
    IsfileUpload = false;
    console.log(IsfileUpload);
    uploadImageLabel.style.backgroundImage = 'none';
    carmeraIcon.style.display = 'block';
    carmeraTitle.style.display = 'block';
  }
});
/////////////////////////////////////////////////////

// 클릭한 좌표를 저장할 변수
let clickedX, clickedY;
// 클릭한 점과 제품명 및 링크를 입력할 div 요소
const clickPoint = document.createElement('div');
clickPoint.className = 'click-point';
const productInfo = document.createElement('div');
productInfo.className = 'product-info';
const productNameInput = document.createElement('input');
productNameInput.type = 'text';
productNameInput.className = 'product-name';
productNameInput.placeholder = '제품명';
const productLinkInput = document.createElement('input');
productLinkInput.type = 'text';
productLinkInput.className = 'product-link';
productLinkInput.placeholder = '링크';

let photoData = {};

// 최대 3개의 점을 저장하는 배열
let points = [];

// 완료 버튼 생성
const completeButton = document.createElement('button');
completeButton.type = 'button';
completeButton.textContent = '완료';
completeButton.addEventListener('click', displayProductInfo);

function mousemove() {
  const mouseFollower = uploadImage.querySelector('.mouse-follower'); // uploadImage 내에서 검색
  if (!IsfileUpload) {
    mouseFollower.style.display = 'none';
  }
  uploadImage.addEventListener('mouseenter', () => {
    // 마우스가 들어왔을 때
    mouseFollower.style.display = 'block';
  });

  uploadImage.addEventListener('mousemove', (e) => {
    mouseFollower.style.display = 'block';
    // 마우스가 움직일 때
    const rect = uploadImage.getBoundingClientRect(); // .upload-image 요소의 위치 정보 가져오기
    const offsetX = e.clientX - rect.left; // 마우스의 상대적인 X 위치 계산
    const offsetY = e.clientY - rect.top; // 마우스의 상대적인 Y 위치 계산

    mouseFollower.style.left = offsetX + 'px'; // 원의 중심으로 이동
    mouseFollower.style.top = offsetY + 'px';

    // 클릭한 좌표 저장
    clickedX = offsetX;
    clickedY = offsetY;
  });
  uploadImage.addEventListener('click', () => {
    if (points.length >= 3) {
      // 최대 3개의 점을 생성했을 경우 무시
      return;
    }
    //console.log('Clicked at (top, left):', clickedY, clickedX);
    mouseFollower.style.display = 'none';

    // product-info 박스 초기화 시켜주기
    productInfo.style.display = 'block';
    productNameInput.value = '';
    productLinkInput.value = '';

    // 클릭한 좌표에 점 표시
    const point = document.createElement('div');
    point.className = 'point';
    point.style.left = clickedX + 'px';
    point.style.top = clickedY + 'px';
    uploadImage.appendChild(point);

    // 제품 정보 입력하는 div 박스 생성 및 위치 설정
    productInfo.style.left = clickedX + 'px';
    productInfo.style.top = clickedY + 'px';
    productInfo.appendChild(productNameInput);
    productInfo.appendChild(productLinkInput);
    productInfo.appendChild(completeButton); // 완료 버튼 추가
    uploadImage.appendChild(productInfo);

    // input 요소를 클릭해도 점이 다시 생기지 않도록 이벤트 제거
    productNameInput.addEventListener('click', stopPropagation);
    productLinkInput.addEventListener('click', stopPropagation);

    // 생성된 점을 배열에 추가
    points.push({ point, productInfo });
  });

  uploadImage.addEventListener('mouseleave', () => {
    // 마우스가 나갔을 때
    mouseFollower.style.display = 'none';
  });
  // 이벤트 전파 중지 함수
  function stopPropagation(event) {
    event.stopPropagation();
  }

  // 완료 버튼을 클릭하면 제품 정보를 표시하고 폼 전송을 막음
  completeButton.addEventListener('click', (event) => {
    displayProductInfo();
    console.log(points);
    stopPropagation(event); // 완료 버튼을 클릭하면 점이 생기지 않게 막음
  });
  // 완료 버튼을 눌렀을 때 제품 정보를 표시하는 함수
  function displayProductInfo() {
    // 선택된 제품 정보 가져오기
    const productName = productNameInput.value;
    const productLink = productLinkInput.value;
    console.log(productName);
    console.log(productLink);

    // 현재의 점에 해당하는 productInfo를 찾음
    const currentPoint = points[points.length - 1];
    const { point, productInfo } = currentPoint;

    // 제품 정보를 나타내는 div 생성
    const productInfoBox = document.createElement('div');
    productInfoBox.className = 'product-info-box';

    // 제품명과 링크를 표시
    productInfoBox.innerHTML = `<p>제품명: ${productName}</p><p>링크: ${productLink}</p>`;

    // 이미지 아래에 제품 정보를 추가
    imageBox.appendChild(productInfoBox);

    // 제품 정보 입력하는 div 박스 숨김
    productInfo.style.display = 'none';

    // // 완료 버튼 숨김
    // completeButton.style.display = 'none';
  }
}
