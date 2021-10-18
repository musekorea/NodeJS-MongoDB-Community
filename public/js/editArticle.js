const editArticleForm = document.querySelector('#editArticleForm');
const editArticleTitle = document.querySelector('#editArticleTitle');
const editArticleContent = document.querySelector('#editArticleContent');
const deleteArticleBtn = document.querySelector('#deleteArticleBtn');

const editArticle = async (e) => {
  e.preventDefault();
  const title = editArticleTitle.value;
  const content = editArticleContent.value;
  const currentURL = window.location.href.split('/');
  const postID = currentURL[currentURL.length - 1];
  const putArticle = await fetch(`/community/article/${postID}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
    redirect: 'follow',
  });
  if (putArticle.status === 200) {
    return window.location.replace(`/community/post/${postID}`);
  }
};

const deleteArticle = async (e) => {
  const currentURL = window.location.href.split('/');
  const postID = currentURL[currentURL.length - 1];
  try {
    const deleteArticle = await fetch(`/community/article/${postID}`, {
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postID }),
      redirect: 'follow',
    });
    if (deleteArticle.status === 200) {
      window.location.replace(`/community/community`);
    }
  } catch (error) {
    console.log(error);
  }
};

editArticleForm.addEventListener('submit', editArticle);
deleteArticleBtn.addEventListener('click', deleteArticle);
