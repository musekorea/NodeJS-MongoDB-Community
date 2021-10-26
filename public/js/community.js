import regeneratorRuntime from 'regenerator-runtime';
const prePageBtn = document.querySelector('#prePageBtn');
const nextPageBtn = document.querySelector('#nextPageBtn');
const pageBtns = document.querySelectorAll('.pageBtn');
const popularSortBtn = document.querySelector('#popularSortBtn');
const newSortBtn = document.querySelector('#newSortBtn');
let currentPageBtnNum;

const currentPage = () => {
  const pageSearch = window.location.pathname.split('/');
  const currentPage = pageSearch[pageSearch.length - 1];
  return Number(currentPage);
};

const transferPageNum = async (pageNum) => {
  try {
    const fetchPage = await fetch(`/community/community/${pageNum}`);
    console.log(fetchPage.status);
    if (fetchPage.status === 200) {
      window.location.replace(`/community/community/${pageNum}`);
    }
  } catch (error) {
    console.log(error);
  }
};

const handlePrePage = (e) => {
  e.preventDefault();
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

const handlePopularSort = (e) => {
  const currentPath = window.location.pathname.split('/');
  if (currentPath.includes('popular')) {
    return;
  } else {
    const popularA = popularSortBtn.firstElementChild;
    popularA.href = `/community/sort/popular/${currentPage()}`;
  }
};

const handleNewSort = (e) => {
  const currentPath = window.location.pathname.split('/');
  if (currentPath.includes('new')) {
    return;
  } else {
    const newA = newSortBtn.firstElementChild;
    newA.href = `/community/sort/new/${currentPage()}`;
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
popularSortBtn.addEventListener('click', handlePopularSort);
newSortBtn.addEventListener('click', handleNewSort);

const init = () => {
  currentPage();
  if (currentPage() === 1) {
    prePageBtn.classList.add('disabled');
  } else if (currentPage() === pageBtns.length) {
    nextPageBtn.classList.add('disabled');
  }
};

init();
