// S3 이미지
const IMG = `https://syos-test2.s3.ap-northeast-2.amazonaws.com/`;

const post_id = document.querySelector('#post_id').innerHTML;
const titleValue = document.querySelector('#title');
const nameValue = document.querySelector('#name');
const imageValue = document.querySelector('.upload-image label');
const carmeraIcon = document.querySelector('.upload-image i');
const carmeraTitle = document.querySelector('.upload-image p');
const linkTag = document.querySelector('.add-link-wrapper');
const uploadImage = document.querySelector('.upload-image');
const imageBox = document.querySelector('.image-box');
const imageInput = document.getElementById('image');
const uploadImageLabel = document.querySelector('.upload-image label');

let number = 0;
let photo = [];

async function load() {
  imageInput.disabled = true;
  const res = await axios({
    method: 'POST',
    url: `/board/${post_id}/edit`,
    data: post_id,
  });
  const { category, comment, content, createAt, image, liked, postid, title, updateAt, user_id } = res.data.postsData;
  const nickname = res.data.nickName;
  const photoData = res.data.photo;
  titleValue.value = title;
  nameValue.value = nickname;
  imageValue.style.backgroundImage = `url('${IMG + image}')`;
  imageValue.style.backgroundPosition = 'center';
  imageValue.style.backgroundSize = 'cover';
  imageValue.style.backgroundRepeat = 'no-repeat';
  carmeraIcon.style.display = 'none';
  carmeraTitle.style.display = 'none';
  linkTag.style.display = 'block';

  nameValue.disabled = true;

  // text-editor 설정
  tinymce.init({
    selector: '#mytextarea',
    setup: function (editor) {
      editor.on('init', function (e) {
        editor.setContent(`${content}`);
      });
    },
  });

  if (category === 0) {
    document.querySelector('.moden-tag').classList.add('selected');
  } else if (category === 1) {
    document.querySelector('.natural-tag').classList.add('selected');
  } else if (category === 2) {
    document.querySelector('.game-tag').classList.add('selected');
  } else if (category === 3) {
    document.querySelector('.study-tag').classList.add('selected');
  }

  // 클릭된 좌표에 점 표시
  for (let i = 0; i < photoData.length; i++) {
    const point = document.createElement('div');
    point.className = `product${number} point`;
    point.setAttribute('id', number);
    point.classList.add('circle');
    point.innerHTML = '<i class="fa-solid fa-plus" style="color: #ffffff;"></i>';
    point.style.left = photoData[number].left + '%';
    point.style.top = photoData[number].top + '%';
    uploadImage.appendChild(point);

    // 제품 정보를 나타내는 div 생성
    const productInfoBox = document.createElement('div');
    productInfoBox.className = 'product-info-box';
    productInfoBox.setAttribute('id', number);

    // 제품명과 링크를 표시
    productInfoBox.innerHTML = `
    <div class="product-innerbox">
    <div class="product-top"> 
      <h4>⚫ 제품 </h4>
      <button type="button" onclick="deleteProduct(event)">X</button>
    </div>
    <p>제품명: ${photoData[number].product_name}</p>
    <p>링크: ${photoData[number].product_link}</p>
    </div>
    `;

    //기존 데이터 객체에 추가
    //photo는 추가된 제품들이 들어있는 배열
    photo[number] = {
      productName: photoData[number].product_name,
      productLink: photoData[number].product_link,
      top: photoData[number].top,
      left: photoData[number].left,
    };

    number++;
    // 이미지 아래에 제품 정보를 추가
    imageBox.appendChild(productInfoBox);
  }
}

load();

// 제품 삭제 함수
function deleteProduct(e) {
  let id = e.target.parentNode.parentNode.parentNode.getAttribute('id');
  let deleteBox = document.getElementById(`${id}`);
  imageBox.removeChild(e.target.parentNode.parentNode.parentNode);
  uploadImage.removeChild(deleteBox);
  const newProductinfobox = document.querySelectorAll('.product-info-box');
  const newPoint = document.querySelectorAll('.point');

  // 선택된 요소를 객체에서 삭제
  number--;
  photo.splice(number, 1); // 해당 인덱스의 항목을 삭제

  // 남은 항목들의 키 값을 업데이트
  for (let i = id; i < number; i++) {
    const item = photo[i];
    item.key = i; // 예를 들어, "key"라는 속성에 새로운 키 값을 설정
    newProductinfobox[i].id = i; // productBox의 id값을 재할당
    newPoint[i].id = i; // point의 id값을 재할당
  }
}

let tagNum;

// 클릭된 태그들만 색 변하는 함수
const tags = document.querySelectorAll('.tag');
tags.forEach((tag) => {
  tag.addEventListener('click', () => {
    // 선택한 태그의 클래스를 변경하여 스타일을 조절합니다.
    tag.classList.toggle('selected');
    if (tag.classList.contains('moden-tag')) {
      tagNum = 0;
    } else if (tag.classList.contains('natural-tag')) {
      tagNum = 1;
    } else if (tag.classList.contains('game-tag')) {
      tagNum = 2;
    } else if (tag.classList.contains('study-tag')) {
      tagNum = 3;
    }
    // 다른 태그의 선택 상태를 해제합니다.
    tags.forEach((otherTag) => {
      if (otherTag !== tag) {
        otherTag.classList.remove('selected');
      }
    });
  });
});

/////////////////////////////////////////////////////

// 클릭한 좌표를 저장할 변수
let clickedX, clickedY, realclickX, realclickY;
// 클릭한 점과 제품명 및 링크를 입력할 div 요소
const clickPoint = document.createElement('div');
clickPoint.className = 'click-point';
const productInfo = document.createElement('div');
productInfo.className = 'product-info';
const productNum = document.createElement('div');
productNum.className = 'product-num';
const productNameInput = document.createElement('input');
productNameInput.type = 'text';
productNameInput.className = 'product-name';
productNameInput.placeholder = '제품명';
const productLinkInput = document.createElement('input');
productLinkInput.type = 'text';
productLinkInput.className = 'product-link';
productLinkInput.placeholder = '링크';

let photoData = {};
let index = 0;

// 최대 3개의 점을 저장하는 배열
let points = [];

// 완료 버튼 생성
const completeButton = document.createElement('button');
completeButton.type = 'button';
completeButton.textContent = '완료';

function mousemove() {
  const mouseFollower = uploadImage.querySelector('.mouse-follower'); // uploadImage 내에서 검색

  uploadImageLabel.addEventListener('mouseenter', () => {
    // 마우스가 들어왔을 때
    mouseFollower.style.display = 'block';
  });

  uploadImageLabel.addEventListener('mousemove', (e) => {
    mouseFollower.style.display = 'block';
    // 마우스가 움직일 때
    const rect = uploadImage.getBoundingClientRect(); // .upload-image 요소의 위치 정보 가져오기
    const offsetX = e.clientX - rect.left; // 마우스의 상대적인 X 위치 계산
    const offsetY = e.clientY - rect.top; // 마우스의 상대적인 Y 위치 계산

    // 화면 크기에 대한 퍼센트로 변환
    const widthPercent = (offsetX / rect.width) * 100;
    const heightPercent = (offsetY / rect.height) * 100;
    mouseFollower.style.left = widthPercent + '%'; // 원의 중심으로 이동
    mouseFollower.style.top = heightPercent + '%';
    // 클릭한 좌표 저장
    clickedX = widthPercent;
    clickedY = heightPercent;
  });
  uploadImageLabel.addEventListener('click', () => {
    if (number >= 3) {
      // 최대 3개의 점을 생성했을 경우 무시
      alert('3개까지 가능합니다.');

      return;
    }
    realclickX = clickedX;
    realclickY = clickedY;
    mouseFollower.style.display = 'none';

    // product-info 박스 초기화 시켜주기
    productInfo.style.display = 'block';
    productNameInput.value = '';
    productLinkInput.value = '';

    // 클릭한 좌표에 점 표시
    const point = document.createElement('div');
    point.className = `product${number} point`;
    point.setAttribute('id', number);
    point.classList.add('circle');
    point.innerHTML = '<i class="fa-solid fa-plus" style="color: #ffffff;"></i>';
    point.style.left = clickedX + '%';
    point.style.top = clickedY + '%';
    uploadImage.appendChild(point);

    // 제품 정보 입력하는 div 박스 생성 및 위치 설정
    productInfo.style.left = clickedX + '%';
    productInfo.style.top = clickedY + '%';
    productInfo.appendChild(productNameInput);
    productInfo.appendChild(productLinkInput);
    productInfo.appendChild(completeButton); // 완료 버튼 추가
    uploadImage.appendChild(productInfo);
    // 모든 div.product-info 안의 자식 요소를 가져옵니다.

    const children = productInfo.children;

    // input 요소와 button 요소를 제외한 요소를 비활성화합니다.
    for (const child of children) {
      // console.log(child);
      if (child.tagName !== 'INPUT' && child.tagName !== 'BUTTON') {
        child.style.pointerEvents = 'none'; // 클릭 비활성화
      }
    }

    // input 요소를 클릭해도 점이 다시 생기지 않도록 이벤트 제거
    productNameInput.addEventListener('click', stopPropagation);
    productLinkInput.addEventListener('click', stopPropagation);

    // 생성된 점을 배열에 추가
    points.push({ point, productInfo });
  });

  uploadImageLabel.addEventListener('mouseleave', () => {
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
    stopPropagation(event); // 완료 버튼을 클릭하면 점이 생기지 않게 막음
    number++;
  });
  // 완료 버튼을 눌렀을 때 제품 정보를 표시하는 함수
  function displayProductInfo() {
    // 선택된 제품 정보 가져오기
    const productName = productNameInput.value;
    const productLink = productLinkInput.value;
    photo[number] = {
      productName: productNameInput.value,
      productLink: productLinkInput.value,
      top: realclickY,
      left: realclickX,
    };

    // 현재의 점에 해당하는 productInfo를 찾음
    const currentPoint = points[points.length - 1];
    const { point, productInfo } = currentPoint;

    // 제품 정보를 나타내는 div 생성
    const productInfoBox = document.createElement('div');
    productInfoBox.className = 'product-info-box';
    productInfoBox.setAttribute('id', number);

    // 제품명과 링크를 표시
    productInfoBox.innerHTML = `
    <div class="product-innerbox"> 
    <div class="product-top"> 
      <h4>⚫ 제품</h4>
      <button type="button" onclick="deleteProduct(event)">X</button>
    </div>
    <p>제품명: ${productName}</p>
    <p>링크: ${productLink}</p>
    </div>
    `;

    // 이미지 아래에 제품 정보를 추가
    imageBox.appendChild(productInfoBox);

    // 제품 정보 입력하는 div 박스 숨김
    productInfo.style.display = 'none';
  }
}

/// 폼 전송하기

async function uploadPost() {
  const token = localStorage.getItem('token');
  const form = document.forms['upload-post'];
  const data = {
    title: form.title.value,
    content: tinyMCE.get('mytextarea').getContent(),
    category: tagNum,
    photo,
  };
  if (Object.keys(photo).length === 0) {
    alert('제품을 추가해주세요');
  } else {
    // url:/board/upload
    const dataForm = await axios({
      method: 'patch',
      url: `/board/${post_id}/edit`,
      data: { post_id, data },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const photoForm = await axios({
      method: 'delete',
      url: `/board/${post_id}/edit`,
      data: { post_id, data },
    });
    if (photoForm.data.result === true) {
      alert('편집이 완료되었습니다.');
      window.location.href = `/board/${photoForm.data.data}`;
    }
  }
}
