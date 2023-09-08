// text editor 사용함수
tinymce.init({
  selector: "#mytextarea",
});

/////// upload할 이미지 미리보기
const imageInput = document.getElementById("image");
const uploadImageLabel = document.querySelector(".upload-image label");
const carmeraIcon = document.querySelector(".upload-image i");
const carmeraTitle = document.querySelector(".upload-image p");
const linkTag = document.querySelector(".add-link-wrapper");

imageInput.addEventListener("change", function (event) {
  // 파일을 경로
  const file = this.files[0];

  // 경로가 있다면 (사진을 올렸을 경우) 실행
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const imageUrl = e.target.result;
      uploadImageLabel.style.backgroundImage = `url('${imageUrl}')`;
      uploadImageLabel.style.backgroundPosition = "center";
      uploadImageLabel.style.backgroundSize = "cover";
      carmeraIcon.style.display = "none";
      carmeraTitle.style.display = "none";

      // 링크 태그 on
      linkTag.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    // 경로가 없을 경우 (사진이 없을 경우)
    uploadImageLabel.style.backgroundImage = "none";
    carmeraIcon.style.display = "block";
    carmeraTitle.style.display = "block";
  }
});
/////////////////////////////////////////////////////

function mousemove() {
  const uploadImage = document.querySelector(".upload-image");
  const mouseFollower = uploadImage.querySelector(".mouse-follower"); // uploadImage 내에서 검색
  // 클릭한 좌표를 저장할 변수
  let clickedX, clickedY;

  uploadImage.addEventListener("mouseenter", () => {
    // 마우스가 들어왔을 때
    mouseFollower.style.display = "block";
  });

  uploadImage.addEventListener("mousemove", (e) => {
    mouseFollower.style.display = "block";
    // 마우스가 움직일 때
    const rect = uploadImage.getBoundingClientRect(); // .upload-image 요소의 위치 정보 가져오기
    const offsetX = e.clientX - rect.left; // 마우스의 상대적인 X 위치 계산
    const offsetY = e.clientY - rect.top; // 마우스의 상대적인 Y 위치 계산

    mouseFollower.style.left = offsetX + "px"; // 원의 중심으로 이동
    mouseFollower.style.top = offsetY + "px";

    // 클릭한 좌표 저장
    clickedX = offsetX;
    clickedY = offsetY;
  });

  uploadImage.addEventListener("click", () => {
    // 클릭한 좌표 출력
    console.log("Clicked at (top, left):", clickedY, clickedX);
  });

  uploadImage.addEventListener("mouseleave", () => {
    // 마우스가 나갔을 때
    mouseFollower.style.display = "none";
  });
}

function addLink() {
  console.log("a");
}
