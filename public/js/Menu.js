const menuButton = document.querySelector('.menu-button');
const closeButton = document.querySelector('.menu-button.close');
const nav = document.querySelector('nav');

menuButton.addEventListener('click', () => {
  console.log('clicked');
  nav.style.display = 'block';
});

closeButton.addEventListener('click', () => {
  nav.style.display = 'none';
});
