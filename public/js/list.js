const delBtns = document.querySelectorAll('#delBtn');
const titles = document.querySelectorAll('#scheduleTitle');

delBtns.forEach((delBtn) => {
  delBtn.addEventListener('click', async (e) => {
    const delID = e.target.parentElement.id;
    try {
      const delFetch = await fetch('http://127.0.0.1:8080/todo/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: delID }),
      });
      e.target.parentElement.remove();
    } catch (error) {
      console.log(error);
    }
  });
});
