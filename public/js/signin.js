const email = document.querySelector("#email");
const pw = document.querySelector("#pw");
const signInBtn = document.querySelector("#signInBtn");

const GOOGLE_CLIENT_ID =
  "19192735270-plrk2sbfb5hjcr7gqd23h2hes6c428k7.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
const GOOGLE_REDIRECT_URI = "http://localhost:3000/login/redirect";

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
      alert(` Welcome ${res.data.nickName}`);
      // 메인 페이지로 이동
      location.href = "/";
      break;
  }
});
