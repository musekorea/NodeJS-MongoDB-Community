const articleContainer = document.querySelector('#articleContainer');
const commentBtn = document.querySelector('#commentBtn');
const commentForm = document.querySelector('#commentForm');
const commentCancelBtn = document.querySelector('#commentCancelBtn');
const commentInput = document.querySelector('#commentInput');
const commentsContainer = document.querySelector('#commentsContainer');
const commentNumbers = document.querySelectorAll('.commentsNumber');
let commentDeleteBtns = document.querySelectorAll('.commentDeleteBtn');
let nestedDeleteBtns = document.querySelectorAll('.nestedDeleteBtn');

const editBtn = document.querySelector('#editBtn');
const dataSet = document.querySelector('#dataSet');

const currentURL = window.location.href.split('/');
const postID = currentURL[currentURL.length - 1];

let nestedState = false;
let commentState = false;
let commentID;
let parentComment;

const createdAt = (oldTime) => {
  const currentTime = Math.floor(new Date().getTime() / (1000 * 60));
  const targetTime = Math.floor(Number(oldTime / (1000 * 60)));
  const calTime = currentTime - targetTime;
  let resultTime;
  let resultCreatedAt;
  if (calTime < 60) {
    resultTime = calTime;
    return (resultCreatedAt =
      resultTime <= 1 ? `1 minute ago` : `${resultTime} minutes ago`);
  } else if (calTime >= 60 && calTime < 60 * 24) {
    resultTime = Math.floor(calTime / 60);
    return (resultCreatedAt =
      resultTime <= 1 ? `1 hour ago` : `${resultTime} hours ago`);
  } else if (calTime >= 60 * 24 && calTime < 60 * 24 * 30) {
    resultTime = Math.floor(calTime / (60 * 24));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 day ago` : `${resultTime} day ago`);
  } else if (calTime >= 60 * 24 * 30 && calTime < 60 * 24 * 30 * 12) {
    resultTime = Math.floor(calTime / (60 * 24 * 30));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 month ago` : `${resultTime} months ago`);
  } else {
    resultTime = Math.floor(calTime / (60 * 24 * 30 * 12));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 year ago` : `${resultTime} years ago`);
  }
};

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
  commentHeader.innerHTML = `${dataSet.dataset.user} | ${createdAt(
    new Date().getTime()
  )}`;
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
  const commentDeleteJSBtn = document.createElement('a');
  commentDeleteJSBtn.className = `commentDeleteBtn`;
  commentDeleteJSBtn.innerHTML = `
  <button
      style="
        color: white;
        border: none;
        outline: none;
        background-color: steelblue;
        border-radius: 10px;
        position: absolute;
        top: 10px;
        right: 30px;
      "
    >
      Delete
    </button>`;
  commentDiv.append(
    commentHeader,
    commentBody,
    nestedCommentBtn,
    commentDeleteJSBtn
  );
  commentsContainer.prepend(commentDiv);
  commentState = false;
  refreshNestedBtns();
  const nestCommentContainer = document.createElement('div');
  commentsContainer.insertBefore(nestCommentContainer, commentDiv.nextSibling);
  refreshCommentDeleteBtns();
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
  e.preventDefault();
  const comment = commentInput.value;
  try {
    const fetchComment = await fetch(`/community/comments/${postID}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment }),
    });
    if (fetchComment.status === 200) {
      cancelComment();
      createComment(comment);
      let commentID = await fetchComment.json();
      commentID = commentID.commentID;
      const currentComment = commentsContainer.firstElementChild;
      currentComment.id = commentID;
      const nestCommentContainer = currentComment.nextElementSibling;
      nestCommentContainer.className = commentID;
      refreshNestedBtns();
      commentState = false;
      commentNumbers.forEach((commentNumber) => {
        commentNumber.innerText = `${Number(commentNumber.innerText) + 1}`;
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const renderingNestedComment = (nestID, content) => {
  const nickname = dataSet.dataset.user;
  const avatar = dataSet.dataset.avatar;
  const nestedForm = document.querySelector('#nestedForm');
  nestedForm.remove();
  const commentDiv = document.createElement('div');
  commentDiv.className = `mb-3`;
  commentDiv.id = `${nestID}`;
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
  commentHeader.innerHTML = `${nickname} | ${createdAt(new Date().getTime())}`;
  commentAvatar.src = avatar;
  commentAvatar.style = `width:30px;height:30px;border-radius:50%;margin-right:15px`;
  commentHeader.prepend(commentAvatar);
  const commentBody = document.createElement('p');
  commentBody.innerHTML = content;
  const renderNestedDelBtn = document.createElement('a');
  renderNestedDelBtn.className = `nestedDeleteBtn`;
  renderNestedDelBtn.innerHTML = `
  <button
      style="
        color: white;
        border: none;
        outline: none;
        background-color: steelblue;
        border-radius: 10px;
        position: absolute;
        top: 10px;
        right: 30px;
      "
    >
      Delete
    </button>`;
  commentDiv.append(commentHeader, commentBody, renderNestedDelBtn);
  const parentCommentDiv = document.querySelector(`[id="${commentID}"]`);
  parentCommentDiv.nextElementSibling.append(commentDiv);
  refreshNestedBtns();
  refreshNestedDeleteBtns();
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
    const nestFetch = await fetch(`/community/nested/${postID}`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postID,
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
    commentNumbers.forEach((commentNumber) => {
      commentNumber.innerText = `${Number(commentNumber.innerText) + 1}`;
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

const commentDelete = async (e) => {
  e.preventDefault();
  console.log(e);
  const targetComment = e.target.parentElement.parentElement;
  const checkNested = targetComment.nextElementSibling;

  if (checkNested.innerHTML) {
    document.body.style = 'overflow:hidden';
    const nestedModal = document.createElement('div');
    nestedModal.id = `nestedModal`;
    nestedModal.style = `position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.4);overflow:hidden`;
    nestedModal.innerHTML = `
    <div class="modal-dialog" style="top:30%">
      <div class="modal-content">
        <div class="modal-body">
          <p>If the comment has a nested comment, you'cant delete</p>
        </div>
        <div class="modal-footer">
          <button id="nestedModalBtn" type="button" class="btn btn-secondary" >Close</button>
        </div>
      </div>
    </div>
  `;

    articleContainer.append(nestedModal);
    const nestedModalBtn = document.querySelector('#nestedModalBtn');
    nestedModalBtn.addEventListener('click', () => {
      nestedModal.remove();
      document.body.style = 'overflow:auto';
      return;
    });
    return;
  }
  try {
    const deleteComment = await fetch(`/community/comments/${postID}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ commentID: targetComment.id }),
    });
    if (deleteComment.status === 200) {
      const comment = document.querySelector(`[id="${targetComment.id}"]`);
      const nestedCommentContainer = document.querySelector(
        `[class="${targetComment.id}"]`
      );
      commentNumbers.forEach((commentNumber) => {
        commentNumber.innerText = `${Number(commentNumber.innerText) - 1}`;
      });
      comment.remove();
      nestedCommentContainer.remove();
    }
  } catch (error) {
    console.log(error);
  }
};

const nestedDelete = async (e) => {
  const parentNested = e.target.parentElement.parentElement;
  const parentCommentID =
    e.target.parentElement.parentElement.parentElement.className;
  const nestedID = parentNested.id;
  try {
    const deleteNested = await fetch(`/community/nested/${nestedID}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postID, commentID: parentCommentID }),
    });
    if (deleteNested.status === 200) {
      commentNumbers.forEach((commentNumber) => {
        commentNumber.innerText = `${Number(commentNumber.innerText) - 1}`;
      });
      parentNested.remove();
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

const refreshCommentDeleteBtns = () => {
  commentDeleteBtns = document.querySelectorAll(`.commentDeleteBtn`);
  if (commentDeleteBtns) {
    commentDeleteBtns.forEach((commentDeleteBtn) => {
      commentDeleteBtn.addEventListener('click', commentDelete);
    });
  }
};

const refreshNestedBtns = () => {
  if (articleContainer.dataset.isloggedin === 'true') {
    let allNestedBtn = document.querySelectorAll('#nestedCommentBtn');
    allNestedBtn.forEach((nestedBtn) => {
      nestedBtn.addEventListener('click', handleClickNestedComment);
    });
  }
};

const refreshNestedDeleteBtns = () => {
  if (nestedDeleteBtns) {
    nestedDeleteBtns = document.querySelectorAll(`.nestedDeleteBtn`);
    nestedDeleteBtns.forEach((nestedDelBtn) => {
      nestedDelBtn.addEventListener('click', nestedDelete);
    });
  }
};

function init() {
  refreshNestedBtns();
  refreshCommentDeleteBtns();
  refreshNestedDeleteBtns();
}
init();
