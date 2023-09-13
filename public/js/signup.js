const email = document.querySelector('#email');
const pw = document.querySelector('#pw');
const rePw = document.querySelector('#rePw');
const nickName = document.querySelector('#nickName');
const signUpBtn = document.querySelector('#signUpBtn');

// 모든 요소에 boolean 값 생성
let emailBool = false; // 이메일 유효성 및 중복 체크
let pwBool = false; // 비밀번호 유효성 체크
let rePwBool = false; // 비밀번호 재확인 체크
let nickNameBool = false; // 닉네임 중복 체크

// 이메일 유효성 및 중복 체크
async function emailCheck() {
  let emailValue = email.value; // 이메일 값
  let emailRegExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/; // 알파벳,숫자,특수문자 + @ + 알파벳,숫자 + . + 알파벳
  const emailValid = document.querySelector('.emailValid');

  if (emailValue == '') {
    emailValid.innerText = 'Empty';
    emailValid.style.opacity = '1'; // Empty 문구 띄우기
    email.focus();
    emailBool = false;
    return;
  }

  // 이메일 유효성 검사
  if (!emailRegExp.test(emailValue)) {
    emailValid.innerText = 'Invalid';
    emailValid.style.opacity = '1'; // Invalid 문구 띄우기
    email.focus();
    emailBool = false;
    return;
  } else {
    // 이메일 유효성 검사 통과 후 중복 검사
    emailValid.style.opacity = '0'; // Invalid 문구 없애기

    // 이메일 중복 체크
    const res = await axios({
      method: 'post',
      url: '/signup/emailCheck',
      data: {
        email: emailValue,
      },
    });

    if (res.data.result) {
      // 중복 통과
      console.log('이메일 유효성 및 중복 체크 통과');
      emailValid.style.opacity = '0'; // 경고 문구 없애기
      emailBool = true;
    } else {
      // 중복일 경우
      emailValid.innerText = 'Duplicate';
      emailValid.style.opacity = '1';
      emailValue = ''; // 이메일 값 초기화
      email.focus();
      emailBool = false;
      return;
    }
  }
}

// 닉네임 중복 검사
async function nickNameCheck() {
  let nickNameValue = nickName.value; // 닉네임 값
  const nickNameValid = document.querySelector('.nickNameValid');

  if (nickNameValue == '') {
    nickNameValid.innerText = 'Empty';
    nickNameValid.style.opacity = '1'; // Empty 문구 띄우기
    nickName.focus();
    nickNameBool = false;
    return;
  }

  // 닉네임 중복 체크
  const res = await axios({
    method: 'post',
    url: '/signup/nickNameCheck',
    data: {
      nickName: nickNameValue,
    },
  });

  if (res.data.result) {
    console.log('닉네임 중복 체크 통과');
    nickNameValid.style.opacity = '0'; // 경고 문구 없애기
    nickNameBool = true;
  } else {
    nickNameValid.innerText = 'Duplicate';
    nickNameValid.style.opacity = '1';
    nickName.focus();
    nickNameBool = false;
  }
}

// 비밀번호 유효성 검사
pw.addEventListener('input', pwCheck);

function pwCheck() {
  let pwValue = pw.value; // 비밀번호 값
  let pwRegExp = /^[\w!@#$%^*+=-]{8,16}$/; // 영어 대소문자, 숫자, 특수문자 8~16자리
  const pwValid = document.querySelector('.pwValid');

  if (pwValue == '') {
    pwValid.innerText = 'Empty';
    pwValid.style.opacity = '1'; // Empty 문구 띄우기
    pw.focus();
    pwBool = false;
    return;
  }

  // 비밀번호 유효성 검사

  if (!pwRegExp.test(pwValue)) {
    pwValid.innerText = 'Invalid';
    pwValid.style.color = 'red';
    pwValid.style.opacity = '1'; // Invalid 문구 띄우기
    pw.focus();
    pwBool = false;
  } else {
    // 영어 대소문자, 숫자, 특수문자 3가지를 기준으로 점수 매기기
    let score = 0;
    if (pwValue.search(/[0-9]/g) != -1) score += 1;
    if (pwValue.search(/[a-z]/g) != -1) score += 1;
    if (pwValue.search(/[A-Z]/g) != -1) score += 1;
    if (pwValue.search(/[!@#$%^*+=-]/g) != -1) score += 1;

    // 점수에 따른 등급 매기기
    if (score == 3) {
      // Normal
      pwValid.innerText = 'Normal';
      pwValid.style.opacity = '1';
      pwValid.style.color = 'orange';
    } else if (score == 4) {
      // Strong
      pwValid.innerText = 'Strong';
      pwValid.style.opacity = '1';
      pwValid.style.color = 'green';
    } else {
      // Weak
      pwValid.innerText = 'Weak';
      pwValid.style.opacity = '1';
      pwValid.style.color = 'red';
    }

    pwBool = true;
  }
}

// 비밀번호 재확인 검사
rePw.addEventListener('input', rePwCheck);

function rePwCheck() {
  let pwValue = pw.value; // 비밀번호 값
  let rePwValue = rePw.value; // 비밀번호 재확인 값
  const rePwValid = document.querySelector('.rePwValid');

  if (pwValue != rePwValue) {
    rePwValid.innerText = 'Mismatched';
    rePwValid.style.color = 'red';
    rePwValid.style.opacity = '1'; // Invalid 문구 띄우기
    rePw.focus();
    rePwBool = false;
  } else {
    rePwValid.innerText = 'Matched';
    rePwValid.style.color = 'green';
    rePwBool = true;
  }
}

function pwRule() {
  let pwValue = pw.value; // 비밀번호 값
  let pwRegExp = /^[\w!@#$%^*+=-]{8,16}$/; // 영어 대소문자, 숫자, 특수문자 8~16자리
  const pwValid = document.querySelector('.pwValid');

  if (pwValue == '') {
    pwValid.innerText = 'Empty';
    pwValid.style.opacity = '1'; // Empty 문구 띄우기
    pw.focus();
    pwBool = false;
    return;
  } else if (!pwRegExp.test(pwValue)) {
    alert(
      '* Password: 8~16 characters consisting of letters(A-Z, a-z), numbers, or special characters.'
    );
    pw.focus();
    pwBool = false;
    return;
  }
}

// 회원가입 버튼 클릭
signUpBtn.addEventListener('click', async function signup() {
  await nickNameCheck(); // 닉네임 중복 검사
  rePwCheck(); // 비밀번호 재확인 검사
  // pwCheck(); // 비밀번호 유효성 검사
  pwRule(); // 비밀번호 유효성 검사
  await emailCheck(); // 이메일 유효성 및 중복 검사

  if (emailBool && pwBool && rePwBool && nickNameBool) {
    const res = await axios({
      method: 'post',
      url: '/signup',
      data: {
        email: email.value,
        pw: pw.value,
        nickName: nickName.value,
      },
    });

    if (res.data.result) {
      alert('Welcome to SYOS');
      location.href = '/signin';
    }
  }
});
