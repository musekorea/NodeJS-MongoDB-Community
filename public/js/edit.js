const editForm = document.querySelector('#editForm');
const editSchedule = document.querySelector('#editSchedule');
const editDueDate = document.querySelector('#editDueDate');

editForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const todo = editSchedule.value;
  const dueDate = editDueDate.value;
  const urlPath = Number(window.location.pathname.split('/')[2]);
  try {
    const patchFetch = await fetch(`/update/${urlPath}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo, dueDate }),
      redirect: 'follow',
    });
    if (patchFetch.status === 300) {
      return (window.location.href = `/list`);
    }
  } catch (error) {}
});
