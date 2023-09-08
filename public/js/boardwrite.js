function addComment() {
  const comments = document.getElementById('comments');
  const commentText = comments.value;

  if (commentText.trim() === '') {
    alert('Please enter comments.');
    return;
  }

  const commentList = document.getElementById('comment-list');
  const commentItem = document.createElement('li');
  commentItem.textContent = commentText;
  commentList.appendChild(commentItem);

  comments.value = '';
}


// axios로 필요한 데이터 요청
const token = localStorage.getItem('token');

axios({
  method: 'POST',
  url: '/posts/write',
  headers: {
    Authorization: `Bearer ${token}`,
  },
}).then(res => {
  console.log(res);
});