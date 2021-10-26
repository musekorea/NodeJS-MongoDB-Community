import regeneratorRuntime from 'regenerator-runtime';
const pwd0 = document.querySelector('#oldPassword');
const pwd1 = document.querySelector('#newPassword1');
const pwd2 = document.querySelector('#newPassword2');
const form = document.querySelector('#form');
const warning = document.querySelector('#warning');

const confirmPassword = async (e) => {
  e.preventDefault();
  if (pwd1.value !== pwd2.value) {
    warning.innerHTML = ` 💢 Wrong confirmation. Please try again! `;
  } else {
    const pwdFetch = await fetch('/user/changePassword', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        oldPassword: pwd0.value ? pwd0.value : '',
        newPassword: pwd1.value,
      }),
      redirect: 'follow',
    });
    if (pwdFetch.status === 403) {
      return window.location.replace(`/user/changePassword`);
    } else if (pwdFetch.status === 200) {
      const body = await pwdFetch.json();
      return window.location.replace(`/user/userProfile/${body.nickname}`);
    }
  }
};

form.addEventListener('submit', confirmPassword);
