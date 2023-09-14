const menuButton = document.querySelector(".menu-button");
const closeButton = document.querySelector(".menu-button.close");
const nav = document.querySelector("nav");
const githubIcon = document.querySelectorAll(".fa-github");
window.onload = function () {
  switchMenu();
};

menuButton.addEventListener("click", () => {
  nav.style.transform = "translateX(0%)";
});

closeButton.addEventListener("click", () => {
  nav.style.transform = "translateX(-120%)";
});

// 로그인, 로그아웃 버튼 변경 함수
const switchMenu = () => {
  const loginButton = document.querySelector("#login-button");
  const token = localStorage.getItem("token");

  if (token) loginButton.textContent = "Logout";
  else loginButton.textContent = "LogIn";
};

// 로그인, 로그아웃 클릭 함수
const toggleLoginLogout = () => {
  const token = localStorage.getItem("token");

  if (token) {
    location.href = "/";
    localStorage.removeItem("token");
  } else {
    location.href = "/signin";
  }
};

// 마이페이지 버튼 눌렀을 때
const clickMyPage = () => {
  const token = localStorage.getItem("token");

  if (token) {
    axios({
      method: "GET",
      url: "/mypage",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((res) => {
      location.href = "/mypage/" + res.data.user_id;
    });
  } else {
    alert("로그인이 필요합니다.");
    location.href = "/signin";
  }
};

githubIcon.forEach((icon) => {
  icon.addEventListener('mouseover', () => {
    icon.classList.add('fa-bounce');
  })
  icon.addEventListener('mouseleave', () => {
    icon.classList.remove('fa-bounce');
  })
  icon.addEventListener('click', (event) => {
    window.open(`https://github.com/${event.target.id}`, '_blank');
  });
});

