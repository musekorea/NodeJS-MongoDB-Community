const articleContainer = document.querySelector('#articleContainer');
const commentBtn = document.querySelector('#commentBtn');
const commentForm = document.querySelector('#commentForm');
const commentCancelBtn = document.querySelector('#commentCancelBtn');
const commentInput = document.querySelector('#commentInput');

const createComment = (comment) => {
  const commentDiv = document.createElement('div');
  commentDiv.className = `mb-3`;
  commentDiv.style = `
  border: 1px solid rgba(90, 40, 40, 0.1);
  border-top:none;
  border-left:none;
  border-radius: 20px;
  background-color: aliceblue;
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.2);
  padding:10px 20px 10px 20px;
`;
  const commentHeader = document.createElement('div');
  commentHeader.className = `mb-3`;
  const commentAvatar = document.createElement('img');
  commentHeader.innerHTML = `${commentForm.dataset.user} | 6 hours ago`;
  commentAvatar.src = commentForm.dataset.avatar;
  commentAvatar.style = `width:30px;height:30px;border-radius:50%;margin-right:15px`;
  commentHeader.prepend(commentAvatar);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = comment;
  commentDiv.append(commentHeader, commentBody);
  articleContainer.append(commentDiv);
};

const addComment = (e) => {
  e.preventDefault();
  commentBtn.classList.add('hide');
  commentForm.classList.remove('hide');
};
const cancelComment = (e) => {
  commentInput.value = '';
  commentBtn.classList.remove('hide');
  commentForm.classList.add('hide');
};

const submitComment = async (e) => {
  e.preventDefault();
  const comment = commentInput.value;
  try {
    const fetchComment = await fetch(`/community/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });

    if (fetchComment.status === 200) {
      console.log(`success`);
      cancelComment();
      createComment(comment);
    }
  } catch (error) {
    console.log(error);
  }
};

if (commentBtn) {
  commentBtn.addEventListener('click', addComment);
}

if (commentCancelBtn) {
  commentCancelBtn.addEventListener('click', cancelComment);
}

if (commentForm) {
  commentForm.addEventListener('submit', submitComment);
}
