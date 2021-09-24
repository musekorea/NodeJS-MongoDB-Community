const scheduleInput = document.querySelector('#schedule');
const dateInput = document.querySelector('#dueDate');
const inputs = document.querySelectorAll('input');
const scheduleForm = document.querySelector('#scheduleForm');

scheduleForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const todo = scheduleInput.value;
  const dueDate = dateInput.value;
  await fetch(`http://127.0.0.1:8080/newSchedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo, dueDate }),
  });
  inputs.forEach((input) => {
    input.value = '';
  });
});
