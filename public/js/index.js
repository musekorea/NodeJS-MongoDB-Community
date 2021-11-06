const landingBG = document.querySelector('#landing-bg');
const landingMoon = document.querySelector('#landing-moon');
const landingMountain = document.querySelector('#landing-mountain');
const landingRoad = document.querySelector('#landing-road');
const landingTextTitle = document.querySelector('#landing-text-title');
const welcomeText = document.querySelector('.welcomeText');
const yogiLogo = document.querySelector('.yogiLogo');
let darkMode = false;

//===== PARALLAX LANDING =====//
window.addEventListener('scroll', () => {
  let scrollValue = window.scrollY;
  landingBG.style.top = `${scrollValue * 0.5}px`;
  landingMoon.style.left = `${-scrollValue * 0.5}px`;
  landingMountain.style.top = `${-scrollValue * 0.15}px`;
  landingRoad.style.top = `${scrollValue * 0.15}px`;
  welcomeText.style.top = `${scrollValue * 1}px`;
  if (scrollValue >= 210) {
    yogiLogo.style.zIndex = `0`;
  } else {
    yogiLogo.style.zIndex = `999`;
  }
});

yogiLogo.addEventListener('click', (e) => {
  const landingScreen = document.querySelector('.landingScreen');
  if (darkMode === false) {
    landingScreen.style = `display:block`;
  } else {
    landingScreen.style = `display:none`;
  }
  darkMode = !darkMode;
});

/*===== NAV SCROLL SPY =====*/
const sections = document.querySelectorAll('section');
const navLi = document.querySelectorAll('.scrollScope');

window.addEventListener('scroll', () => {
  console.log(sections[1].offsetTop);
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - sectionHeight * 0.6) {
      current = section.getAttribute('id');
      section.classList.add('scrollSectionEffect');
    } else {
      section.classList.remove('scrollSectionEffect');
    }
  });

  navLi.forEach((li) => {
    li.classList.remove('scrollNavActive');
    if (li.classList.contains(current)) {
      li.classList.add('scrollNavActive');
    }
  });
});
