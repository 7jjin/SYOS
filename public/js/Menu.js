const menuButton = document.querySelector('.menu-button');
const closeButton = document.querySelector('.menu-button.close');
const nav = document.querySelector('nav');


window.onload = function () {
  switchMenu();
};


menuButton.addEventListener('click', () => {
  nav.style.transform = 'translateX(0%)';
});

closeButton.addEventListener('click', () => {
    nav.style.transform = 'translateX(-120%)';
});

// 로그인, 로그아웃 버튼 변경 함수
const switchMenu = () => {
  const loginButton = document.querySelector('#login-button');
  const token = localStorage.getItem('token');

  if(token) loginButton.textContent = 'Logout';
  else loginButton.textContent = "LogIn";

}

// 로그인, 로그아웃 버튼 변경 함수
const toggleLoginLogout = () => {
  const token = localStorage.getItem('token');
  
  if(token) {
    location.href='/';
    localStorage.removeItem("token");
  }
  else {
    location.href='/signin'; 
  }
}