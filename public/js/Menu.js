const menuButton = document.querySelector('.menu-button');
const closeButton = document.querySelector('.menu-button.close');
const nav = document.querySelector('nav');

menuButton.addEventListener('click', () => {
  console.log('clicked');
  nav.style.transform = 'translateX(0%)';
});

closeButton.addEventListener('click', () => {
    nav.style.transform = 'translateX(-120%)';
});
