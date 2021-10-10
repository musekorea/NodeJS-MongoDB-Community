const goodBtn = document.querySelector('#goodBtn');
const badBtn = document.querySelector('#badBtn');
const goodNum = document.querySelector('#goodNum');
const badNum = document.querySelector('#badNum');

let goodState = false;

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
};

goodBtn.addEventListener('click', addGood);
