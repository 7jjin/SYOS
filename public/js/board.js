// JavaScript 코드
const moodItemWrap = document.querySelector('.moodItemWrap');
const itemsPerRow = 3; // 한 행당 moodItem의 개수

function addMoodItem() {
  const newMoodItem = document.createElement('div');
  newMoodItem.classList.add('moodItem');
  moodItemWrap.appendChild(newMoodItem);
}

function addNewRow() {
  for (let i = 0; i < itemsPerRow; i++) {
    addMoodItem();
  }
}

// 초기에 한 행을 로드
addNewRow();

// 스크롤 이벤트를 감지하여 행 추가
window.addEventListener('scroll', () => {
  const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    addNewRow(); // 새 행 추가
  }
});
