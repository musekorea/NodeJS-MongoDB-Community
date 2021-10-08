import { db } from '../db.js';
let counter;

export const communityController = async (req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray();
    console.log(posts);
    return res.status(200).render('community.ejs', { posts });
  } catch (error) {
    console.log(error);
  }
};

export const getWriteController = (req, res) => {
  return res.status(200).render(`write.ejs`);
};

export const postWriteController = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const time = new Date();
  const currentTime = time.getTime();
  console.log(title, content, currentTime);
  try {
    counter = await db.collection('counter').findOne({ name: 'counter' });
    const result = await db.collection('posts').insertOne({
      _id: counter.count + 1,
      title,
      content,
      time: currentTime,
      user: req.session.user.nickname,
    });
    counter = await db
      .collection('counter')
      .updateOne({ name: 'counter' }, { $inc: { count: +1 } });
    const user = await db
      .collection('users')
      .updateOne(
        { email: req.session.user.email },
        { $addToSet: { writeList: result.insertedId } }
      );
    const posts = await db.collection('posts').find().toArray();
    req.session.posts = posts;
    return res.status(300).redirect('/community/community');
  } catch (error) {
    console.log(error);
  }
};
/* 
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
      return res.status(300).redirect('/community');
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
}; */
