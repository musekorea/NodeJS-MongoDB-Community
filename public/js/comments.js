const articleContainer = document.querySelector('#articleContainer');
const commentBtn = document.querySelector('#commentBtn');
const commentForm = document.querySelector('#commentForm');
const commentCancelBtn = document.querySelector('#commentCancelBtn');
const commentInput = document.querySelector('#commentInput');
const editBtn = document.querySelector('#editBtn');
const dataSet = document.querySelector('#dataSet');

let allNestedBtn = document.querySelectorAll('#nestedCommentBtn');
let nestedState = false;
let commentState = false;
let commentID;

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
  position:relative;
`;
  const commentHeader = document.createElement('div');
  commentHeader.className = `mb-3`;
  const commentAvatar = document.createElement('img');
  commentHeader.innerHTML = `${dataSet.dataset.user} | 6 hours ago`;
  commentAvatar.src = dataSet.dataset.avatar;
  commentAvatar.style = `width:30px;height:30px;border-radius:50%;margin-right:15px`;
  commentHeader.prepend(commentAvatar);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = comment;
  const nestedCommentBtn = document.createElement('button');
  nestedCommentBtn.innerHTML = `↩`;
  nestedCommentBtn.id = `nestedCommentBtn`;
  nestedCommentBtn.style = `   
    position: absolute;
    bottom: 15px;
    right: 30px;
    border: none;
    outline: none;
    border-radius: 50%;
    background-color: lightslategray;
    font-weight: bolder;
    color: white;
  `;
  commentDiv.append(commentHeader, commentBody, nestedCommentBtn);
  articleContainer.append(commentDiv);
};

const addComment = (e) => {
  e.preventDefault();
  commentBtn.classList.add('hide');
  commentForm.classList.remove('hide');
  editBtn.classList.add('hide');
  commentState = true;
};

const cancelComment = (e) => {
  commentInput.value = '';
  commentBtn.classList.remove('hide');
  commentForm.classList.add('hide');
  editBtn.classList.remove('hide');
  commentState = false;
};

const submitComment = async (e) => {
  const currentURL = window.location.href.split('/');
  const postID = currentURL[currentURL.length - 1];
  e.preventDefault();
  const comment = commentInput.value;
  try {
    const fetchComment = await fetch(`/community/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment, postID }),
    });
    if (fetchComment.status === 200) {
      console.log(`success`);
      cancelComment();
      createComment(comment);
      commentsNumbers = document.querySelectorAll('.commentsNumber');

      let commentID = await fetchComment.json();
      commentID = commentID.commentID;
      console.log(commentID);
      articleContainer.lastChild.id = commentID;
      allNestedBtn = document.querySelectorAll('#nestedCommentBtn');
      console.log(allNestedBtn);
      commentState = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const addNestedComment = async (e) => {
  e.preventDefault();
  const content = e.target.children[0].value;
  try {
    const nestFeth = await fetch('/community/addNestedComment', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentID,
        content,
      }),
    });
  } catch (error) {
    console.log(error);
  }
};

const handleClickNestedComment = (e) => {
  if (commentState === true) {
    return;
  }
  if (nestedState === false) {
    const parentComment = e.target.parentElement;
    commentID = parentComment.id;
    const nestedForm = document.createElement('form');
    nestedForm.id = 'nestedForm';
    nestedForm.className = `input-group mb-3`;
    const nestedInput = document.createElement('input');
    nestedInput.className = `form-control`;
    nestedInput.ariaLabel = `Recipient's username`;
    nestedInput.ariaRoleDescription = `button-addon2`;
    const nestedInputButton = document.createElement('button');
    nestedInputButton.className = `btn btn-outline-secondary`;
    nestedInputButton.id = `button-addon2`;
    nestedInputButton.innerHTML = `reply`;
    nestedInputButton.style = `background-color:tomato;color:white`;
    nestedForm.append(nestedInput);
    nestedForm.append(nestedInputButton);
    articleContainer.insertBefore(nestedForm, parentComment.nextSibling);
    commentBtn.style = `pointer-events: none`;
    nestedState = true;
    nestedForm.addEventListener('submit', addNestedComment);
  } else {
    const nestedForm = document.querySelector('#nestedForm');
    nestedForm.remove();
    nestedState = false;
    commentBtn.style = `pointer-events: auto`;
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

if (allNestedBtn && articleContainer.dataset.isloggedin === 'true') {
  allNestedBtn.forEach((nestedBtn) => {
    nestedBtn.addEventListener('click', handleClickNestedComment);
  });
}
