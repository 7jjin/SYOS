const email = document.querySelector("#email");
const pw = document.querySelector("#pw");
const signInBtn = document.querySelector("#signInBtn");
const googleBtn = document.querySelector("#googleBtn");
const googleDiv = document.querySelector(".google");

// 구글 로그인 버튼 클릭, div 클릭
googleBtn.addEventListener("click", googleLogin);
googleDiv.addEventListener("click", googleLogin);

// 로그인 버튼 클릭
signInBtn.addEventListener("click", async function signin() {
  const emailValue = email.value;
  const pwValue = pw.value;

  if (emailValue == "") {
    email.focus();
    return;
  }

  if (pwValue == "") {
    pw.focus();
    return;
  }

  const res = await axios({
    method: "post",
    url: "/signin",
    data: {
      email: emailValue,
      pw: pwValue,
    },
  });

  result = res.data.result;

  switch (result) {
    case "1":
      alert("There is no user.");
      break;
    case "2":
      alert("Wrong password.");
      break;
    case "3":
      // jwt 저장
      localStorage.setItem("token", res.data.token);
      console.log("token : ", res.data.token);
      // welcome 닉네임
      alert(`Welcome ${res.data.nickName}!!`);
      // 메인 페이지로 이동
      location.href = "/";
      break;
    case "4":
      alert("Please login with Google.");
      break;
  }
});

// 구글 로그인
function googleLogin() {
  // /signin/google 로 요청
  location.href = "/signin/google";
}
