function addComment() {
  const comments = document.getElementById('comments');
  const commentText = comments.value;

  if (commentText.trim() === '') {
    alert('Please enter comments.');
    return;
  }

  const commentList = document.getElementById('commentList');
  const commentItem = document.createElement('li');
  commentItem.textContent = commentText;
  commentList.appendChild(commentItem);

  comments.value = '';
}
