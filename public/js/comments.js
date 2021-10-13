const articleContainer = document.querySelector('#articleContainer');
const commentBtn = document.querySelector('#commentBtn');
const commentForm = document.querySelector('#commentForm');
const commentCancelBtn = document.querySelector('#commentCancelBtn');
const commentInput = document.querySelector('#commentInput');
const commentsContainer = document.querySelector('#commentsContainer');
const editBtn = document.querySelector('#editBtn');
const dataSet = document.querySelector('#dataSet');

let nestedState = false;
let commentState = false;
let commentID;
let parentComment;

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
  commentsContainer.prepend(commentDiv);
  commentState = false;
  refreshNestedBtns();
  console.log(`sibling`, commentDiv.nextSibling);
  const nestCommentContainer = document.createElement('div');
  nestCommentContainer.id = 'xxxx';
  commentsContainer.insertBefore(nestCommentContainer, commentDiv.nextSibling);
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
      commentsContainer.firstElementChild.id = commentID; //이거임
      refreshNestedBtns();
      commentState = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const renderingNestedComment = (nestID, content) => {
  const nickname = dataSet.dataset.user;
  const avatar = dataSet.dataset.avatar;
  const createdAt = new Date().getTime();
  console.log(nestID, content, nickname, avatar, createdAt);
  const nestedForm = document.querySelector('#nestedForm');
  nestedForm.remove();
  const commentDiv = document.createElement('div');
  commentDiv.className = `mb-3`;
  commentDiv.style = `
  border: 1px solid rgba(90, 40, 40, 0.1);
  border-top:none;
  border-left:none;
  border-radius: 20px;
  background-color: thistle;
  box-shadow: 6px 6px 6px rgba(0, 0, 0, 0.2);
  padding:10px 20px 10px 20px;
  position:relative;
  left:20%;
  width:80%
`;
  const commentHeader = document.createElement('div');
  commentHeader.className = `mb-3`;
  const commentAvatar = document.createElement('img');
  commentHeader.innerHTML = `${nickname} | ${createdAt}`;
  commentAvatar.src = avatar;
  commentAvatar.style = `width:30px;height:30px;border-radius:50%;margin-right:15px`;
  commentHeader.prepend(commentAvatar);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = content;
  commentDiv.append(commentHeader, commentBody);
  const parentCommentDiv = document.querySelector(`[id="${commentID}"]`);
  parentCommentDiv.nextElementSibling.append(commentDiv);
  refreshNestedBtns();
  nestedState = false;
  commentState = false;
};

const submitNestedComment = async (e) => {
  e.preventDefault();
  nestedState = false;
  const content = e.target.children[0].value;
  if (content === '' || !content) {
    const replyInput = document.querySelector('#nestedInput');
    replyInput.placeholder = `Must not be empty 🤸‍♀️`;
    replyInput.classList.add('placeholderError');
    return;
  }
  try {
    console.log(`아이디예요`, commentID);
    const nestFetch = await fetch('/community/addNestedComment', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        commentID,
        content,
      }),
    });
    const nestJson = await nestFetch.json();
    if (nestFetch.status === 200) {
      nestedState = false;
      commentState = false;
      renderingNestedComment(nestJson.nestedCommentID, content);
    }
    commentBtn.style = `pointer-events: auto`;
    editBtn.style = `pointer-events: auto`;
  } catch (error) {
    console.log(error);
  }
};

const handleClickNestedComment = (e) => {
  if (commentState === true) {
    return;
  }
  if (nestedState === false) {
    parentComment = e.target.parentElement;
    commentID = parentComment.id;
    const nestedForm = document.createElement('form');
    nestedForm.id = 'nestedForm';
    nestedForm.className = `input-group mb-3`;
    const nestedInput = document.createElement('input');
    nestedInput.id = `nestedInput`;
    nestedInput.className = `form-control`;
    nestedInput.placeholder = `Add a comment`;
    nestedInput.ariaRoleDescription = `button-addon2`;
    const nestedInputButton = document.createElement('button');
    nestedInputButton.className = `btn btn-outline-secondary`;
    nestedInputButton.id = `button-addon2`;
    nestedInputButton.innerHTML = `reply`;
    nestedInputButton.style = `background-color:tomato;color:white`;
    nestedForm.append(nestedInput);
    nestedForm.append(nestedInputButton);
    commentsContainer.insertBefore(nestedForm, parentComment.nextSibling);
    commentBtn.style = `pointer-events: none`;
    editBtn.style = `pointer-events: none`;
    nestedForm.addEventListener('submit', submitNestedComment);
    nestedState = true;
  } else {
    const nestedForm = document.querySelector('#nestedForm');
    nestedForm.remove();
    nestedState = false;
    commentBtn.style = `pointer-events: auto`;
    editBtn.style = `pointer-events: auto`;
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

const refreshNestedBtns = () => {
  if (articleContainer.dataset.isloggedin === 'true') {
    let allNestedBtn = document.querySelectorAll('#nestedCommentBtn');
    allNestedBtn.forEach((nestedBtn) => {
      nestedBtn.addEventListener('click', handleClickNestedComment);
    });
  }
};

function init() {
  refreshNestedBtns();
}
init();
