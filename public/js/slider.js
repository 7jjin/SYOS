// 슬라이더 설정
const swiper = new Swiper('.swiper', {
  slidesPerView: 3,
  slidesPerGroup: 3,
  spaceBetween: 30,
  direction: 'horizontal',
  loop: true,
  autoplay: {
    delay: 0,
    disableOnInteraction: false,
    waitForTransition: true,
  },
  speed: 30000,
  allowTouchMove: false,
});


// 스크롤 이벤트
function checkVisibility(element, className, threshold) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const elementHeight = rect.bottom - rect.top;
  
  const thresholdPosition = windowHeight - (elementHeight * threshold);

  if (rect.bottom >= thresholdPosition && rect.top <= windowHeight) {
    element.classList.add(className);
  }
}

addEventListener('scroll', function () {
  const bestBox1 = document.querySelector('.best-box.left');
  const bestBox2 = document.querySelector('.best-box.right');

  checkVisibility(bestBox1, 'fadeInLeft', 1);
  checkVisibility(bestBox2, 'fadeInRight', 1);
});