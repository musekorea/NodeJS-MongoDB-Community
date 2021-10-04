import { db } from '../db.js';
let counter;

export const writeController = (req, res) => {
  return res.status(200).render(`write.ejs`);
};
export const newScheduleController = async (req, res) => {
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
};

export const listController = async (req, res) => {
  try {
    const results = await db.collection('todos').find().toArray();
    return res.status(200).render('list.ejs', { results });
  } catch (error) {
    console.log(error);
  }
};

export const descriptionController = async (req, res) => {
  try {
    const todo = await db
      .collection('todos')
      .findOne({ _id: Number(req.params.id) });
    if (todo === null) {
      return res.status(500).send(`Not Found Data`);
    }
    return res.status(200).render('description.ejs', { todo });
  } catch (error) {
    console.log(error);
  }
};

export const editController = async (req, res) => {
  try {
    const todo = await db
      .collection('todos')
      .findOne({ _id: Number(req.params.id) });
    if (todo === null) {
      return res.status(300).redirect('/list');
    }
    return res.status(200).render('edit.ejs', { todo });
  } catch (error) {
    console.log(error);
  }
};

export const deleteController = async (req, res) => {
  const delID = Number(req.body.id);

  try {
    const deleteTodo = await db.collection('todos').deleteOne({ _id: delID });

    res.status(200).send('delete success');
  } catch (error) {
    console.log(error);
  }
};
export const updateController = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updateTodo = await db.collection('todos').updateOne(
      { _id: id },
      {
        $set: { todo: req.body.todo, date: req.body.dueDate },
      }
    );
    return res.sendStatus(300);
  } catch (error) {
    console.log(error);
  }
};
