const prePageBtn = document.querySelector('#prePageBtn');
const nextPageBtn = document.querySelector('#nextPageBtn');
const pageBtns = document.querySelectorAll('.pageBtn');
let currentPageBtnNum;

const currentPage = () => {
  const currentPage = window.location.pathname.split('/')[3];
  console.log(currentPage);
  return Number(currentPage);
};

const transferPageNum = async (pageNum) => {
  try {
    const fetchPage = await fetch(`/community/community/${pageNum}`);
    console.log(fetchPage.status);
    if (fetchPage.status === 200) {
      window.location.replace(`/community/community/${pageNum}`);
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const handlePrePage = (e) => {
  e.preventDefault();
  console.log(e);
  if (currentPage() === 1) {
    console.log(`first page`);
    prePageBtn.classList.add('disabled');
  } else {
    prePageBtn.classList.remove('disabled');
    const prePageNum = currentPage() - 1;
    transferPageNum(prePageNum);
  }
};
const handleNextPage = (e) => {
  e.preventDefault();
  console.log(e);
  if (currentPage() === pageBtns.length) {
    console.log(`final page`);
    nextPageBtn.classList.add('disabled');
  } else {
    nextPageBtn.classList.remove('disabled');
    const nextPageNum = currentPage() + 1;
    console.log(nextPageNum);
    transferPageNum(nextPageNum);
  }
};

const handleCurrentPage = (e) => {
  currentPageBtnNum = Number(e.target.innerText);
  if (currentPageBtnNum !== 1) {
    prePageBtn.classList.remove('disabled');
  }
  console.log(currentPageBtnNum, pageBtns.length);
  if (currentPageBtnNum === pageBtns.length) {
    nextPageBtn.classList.add('disabled');
  }
};

prePageBtn.addEventListener('click', handlePrePage);
nextPageBtn.addEventListener('click', handleNextPage);
pageBtns.forEach((pageBtn) => {
  if (currentPage() === Number(pageBtn.innerText)) {
    pageBtn.firstElementChild.style.color = `red`;
  }
  pageBtn.addEventListener('click', handleCurrentPage);
});

const init = () => {
  currentPage();
  if (currentPage() === 1) {
    prePageBtn.classList.add('disabled');
  } else if (currentPage() === pageBtns.length) {
    nextPageBtn.classList.add('disabled');
  }
};

init();
