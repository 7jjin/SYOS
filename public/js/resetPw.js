const email = document.getElementById('email'); // 이메일 입력
const sendBtn = document.getElementById('send'); // 이메일 전송 버튼

const authDiv = document.getElementsByClassName('authDiv')[0]; // 인증번호 div
const authNum = document.getElementById('authNum'); // 인증번호 입력
const authBtn = document.getElementById('auth'); // 인증번호 확인 버튼

const pwDiv = document.getElementsByClassName('pwDiv')[0]; // 비밀번호 변경 div
const pw = document.getElementById('pw'); // 비밀번호 입력
const submit = document.getElementById('submit'); // 비밀번호 변경 버튼

const pwValid = document.getElementsByClassName('pwValid')[0]; // 비밀번호 유효성 검사 div

let emailAuthNum;

sendBtn.addEventListener('click', async () => {
  if (email.value === '') {
    email.focus();
    return;
  } else {
    const res = await axios({
      method: 'post',
      url: '/resetPw',
      data: {
        email: email.value,
      },
    });

    // 결과랑 인증번호 분해 할당
    const { result, ranNum } = res.data;

    switch (result) {
      case '1':
        // 유저가 존재하지 않을 경우
        alert('There is no user.');
        break;
      case '2':
        // 구글로 가입한 유저일 경우
        alert('The user is signed up with Google.');
        break;
      case '3':
        // 이메일 전송 실패
        alert('Failed to send email.');
        break;
      case '4':
        // 이메일 전송 성공
        sendBtn.style.backgroundColor = 'green';
        authDiv.style.visibility = 'visible';
        emailAuthNum = ranNum; // 전역변수에 저장
        break;
    }
  }
});

// 인증번호 확인 버튼 클릭
authBtn.addEventListener('click', () => {
  const authNumValue = authNum.value;

  if (authNumValue == emailAuthNum) {
    authBtn.style.backgroundColor = 'green';
    pwDiv.style.visibility = 'visible';
    pwValid.style.visibility = 'visible';
  } else {
    alert('The authentication number is incorrect.');
  }
});

// 비밀번호 변경 버튼 클릭
submit.addEventListener('click', async () => {
  // 비밀번호 유효성 검사
  if (pwCheck()) {
    const pwValue = pw.value;

    const res = await axios({
      method: 'patch',
      url: '/resetPw',
      data: {
        email: email.value,
        pw: pwValue,
      },
    });

    const { result } = res.data;

    if (result) {
      alert('Password changed successfully.');
      window.location.href = '/signin';
    }
  }
});

function pwCheck() {
  let pwValue = pw.value; // 비밀번호 값
  let pwRegExp = /^[\w!@#$%^*+=-]{8,16}$/; // 영어 대소문자, 숫자, 특수문자 8~16자리

  if (pwValue == '') {
    pw.focus();
    return false;
  }

  if (!pwRegExp.test(pwValue)) {
    pw.focus();
    return false;
  } else {
    return true;
  }
}
