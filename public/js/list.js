const delBtns = document.querySelectorAll('#delBtn');
const titles = document.querySelectorAll('h4');

titles.forEach((title) => {
  title.addEventListener('click', async (e) => {
    e.preventDefault();
    const target = e.target.parentElement;
    try {
      const descFetch = await fetch(
        `http://127.0.0.1:8080/description/${target.id}`,
        {
          method: 'get',
          redirect: 'follow',
        }
      );
      if (descFetch.status === 300) {
        return (window.location.href = 'http://127.0.0.1:8080/description');
      }
    } catch (error) {
      console.log(error);
    }
  });
});

delBtns.forEach((delBtn) => {
  delBtn.addEventListener('click', async (e) => {
    const delID = e.target.parentElement.id;
    try {
      const delFetch = await fetch('http://127.0.0.1:8080/delete', {
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
