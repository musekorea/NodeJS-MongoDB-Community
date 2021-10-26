import regeneratorRuntime from 'regenerator-runtime';
const goodBtn = document.querySelector('#goodBtn');
const badBtn = document.querySelector('#badBtn');
const goodNum = document.querySelector('#goodNum');
const badNum = document.querySelector('#badNum');
const views = document.querySelector('#views');

let goodState = false;
let badState = false;

views.innerHTML = Number(views.innerHTML) + 1;

const addGood = async (e) => {
  e.preventDefault();
  if (goodState === false) {
    goodNum.innerHTML = Number(goodNum.innerHTML) + 1;
  } else {
    goodNum.innerHTML = Number(goodNum.innerHTML) - 1;
  }
  const currentURL = document.location.href.split('/');
  let postID = currentURL[currentURL.length - 1];
  const regex = /[^0-9]/g;
  postID = postID.replace(regex, '');
  const fetchGood = await fetch('/community/addGood', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postID,
      goodNumber: goodNum.innerHTML,
    }),
  });
  goodState = !goodState;
  console.log(goodState);
};

const addBad = async (e) => {
  e.preventDefault();
  if (badState === false) {
    badNum.innerHTML = Number(badNum.innerHTML) + 1;
  } else {
    badNum.innerHTML = Number(badNum.innerHTML) - 1;
  }
  const currentURL = document.location.href.split('/');
  let postID = currentURL[currentURL.length - 1];
  const regex = /[^0-9]/g;
  postID = postID.replace(regex, '');
  const fetchBad = await fetch('/community/addBad', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      postID,
      badNumber: badNum.innerHTML,
    }),
  });
  badState = !badState;
};

const editPost = async (e) => {
  console.log(e);
};

goodBtn.addEventListener('click', addGood);
badBtn.addEventListener('click', addBad);
