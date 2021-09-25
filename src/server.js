import express, { application } from 'express';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { MongoClient } from 'mongodb';

const app = express();
const url = `mongodb+srv://codeme:blueb612@todolist.yd9mm.mongodb.net/test`;
const dbName = `todolist`;
const client = new MongoClient(url);

let db;
let counter;

app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  return res.render(`index.ejs`);
});

app.get('/write', (req, res) => {
  return res.status(200).render(`write.ejs`);
});

app.post('/newSchedule', async (req, res) => {
  let a = req.body;
  console.log(a);
  const todo = req.body.todo;
  const dueDate = req.body.dueDate;
  try {
    counter = await db.collection('counter').findOne({ name: 'counter' });
    const result = await db.collection('todos').insertOne({
      _id: counter.count + 1,
      todo: todo,
      date: dueDate,
    });
    counter = await db
      .collection('counter')
      .updateOne({ name: 'counter' }, { $inc: { count: +1 } });
    res.status(200).send('Fetch Success');
  } catch (error) {
    console.log(error);
  }
});

app.get('/list', async (req, res) => {
  try {
    const results = await db.collection('todos').find().toArray();
    return res.status(200).render('list.ejs', { results });
  } catch (error) {
    console.log(error);
  }
});

let todo = {};

app.get('/description/:id', async (req, res) => {
  console.log(`get`, req.params);
  try {
    todo = await db.collection('todos').findOne({ _id: Number(req.params.id) });
    return res.sendStatus(300);
  } catch (error) {
    console.log(error);
  }
});

app.get('/description', (req, res) => {
  res.render('description.ejs', { todo });
});

app.delete('/delete', async (req, res) => {
  const delID = Number(req.body.id);
  try {
    const deleteTodo = await db.collection('todos').deleteOne({ _id: delID });
    console.log(deleteTodo, delID);
    res.status(200).send('delete success');
  } catch (error) {
    console.log(error);
  }
});

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log(`DB is connected to Mongo Server`);
    counter = await db.collection('counter').findOne({ name: 'counter' });
    if (counter === null) {
      counter = await db
        .collection('counter')
        .insertOne({ name: 'counter', count: 0 });
    }
    app.listen(8080, () => {
      console.log(`Server is listening on Port 8080`);
    });
  } catch (error) {
    console.log(error);
  }
};

const init = () => {
  connectDB();
};
init();
