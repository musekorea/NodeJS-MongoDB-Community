const editArticleForm = document.querySelector('#editArticleForm');
const editArticleTitle = document.querySelector('#editArticleTitle');
const editArticleContent = document.querySelector('#editArticleContent');

const editArticle = async (e) => {
  e.preventDefault();
  const title = editArticleTitle.value;
  const content = editArticleContent.value;
  const currentURL = window.location.href.split('/');
  const postID = currentURL[currentURL.length - 1];
  const putArticle = await fetch(`/community/editArticle/${postID}`, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content }),
    redirect: 'follow',
  });
  if (putArticle.status === 200) {
    return window.location.replace(`/community/post/${postID}`);
  }
};

editArticleForm.addEventListener('submit', editArticle);
