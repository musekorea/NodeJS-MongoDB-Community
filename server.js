import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

app.get('/beauty', (req, res) => {
  res.send('BEAUTY');
});

app.listen(8080, () => {
  console.log(`Server is listening on PORT 8080`);
});
