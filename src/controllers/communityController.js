import { db } from '../db.js';

let counter;

export const communityController = async (req, res) => {
  try {
    const posts = await db.collection('posts').find().toArray();
    posts.forEach((post) => {
      post.createdAt = createdAt(post.createdAt);
      if (post.comments) {
        post.commentsNumber = post.comments.length;
      } else {
        post.commentsNumber = 0;
      }
    });
    return res.status(200).render('community.ejs', { posts });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const getWriteController = (req, res) => {
  return res.status(200).render(`write.ejs`);
};

export const postWriteController = async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;
  const currentTime = new Date().getTime();
  try {
    counter = await db.collection('counter').findOne({ name: 'counter' });
    const result = await db.collection('posts').insertOne({
      _id: counter.count + 1,
      title,
      content,
      createdAt: currentTime,
      user: req.session.user.nickname,
      avatar: req.session.user.avatar,
      views: 0,
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
    return res.status(500).redirect('/error');
  }
};

const createdAt = (oldTime) => {
  const currentTime = Math.floor(new Date().getTime() / (1000 * 60));
  const targetTime = Math.floor(Number(oldTime / (1000 * 60)));
  const calTime = currentTime - targetTime;
  let resultTime;
  let resultCreatedAt;
  if (calTime < 60) {
    resultTime = calTime;
    return (resultCreatedAt =
      resultTime <= 1 ? `1 minute ago` : `${resultTime} minutes ago`);
  } else if (calTime >= 60 && calTime < 60 * 24) {
    resultTime = Math.floor(calTime / 60);
    return (resultCreatedAt =
      resultTime <= 1 ? `1 hour ago` : `${resultTime} hours ago`);
  } else if (calTime >= 60 * 24 && calTime < 60 * 24 * 30) {
    resultTime = Math.floor(calTime / (60 * 24));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 day ago` : `${resultTime} day ago`);
  } else if (calTime >= 60 * 24 * 30 && calTime < 60 * 24 * 30 * 12) {
    resultTime = Math.floor(calTime / (60 * 24 * 30));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 month ago` : `${resultTime} months ago`);
  } else {
    resultTime = Math.floor(calTime / (60 * 24 * 30 * 12));
    return (resultCreatedAt =
      resultTime <= 1 ? `1 year ago` : `${resultTime} years ago`);
  }
};

export const getArticleController = async (req, res) => {
  try {
    const post = await db
      .collection('posts')
      .findOne({ _id: Number(req.params.id) });
    post.createdAt = createdAt(post.createdAt);

    const comments = await db
      .collection('comments')
      .find({ postID: req.params.id })
      .toArray();
    comments.forEach((comment) => {
      comment.createdAt = createdAt(comment.createdAt);
    });

    const viewsUpdate = await db.collection('posts').updateOne(
      { _id: Number(req.params.id) },
      {
        $inc: { views: +1 },
      }
    );
    return res.status(200).render('article.ejs', { post, comments });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const getEditArticleController = async (req, res) => {
  const postID = req.params.id;
  const postData = await db
    .collection('posts')
    .findOne({ _id: Number(postID) });
  console.log(postData);
  return res.status(200).render('editArticle.ejs', { postData });
};
export const putEditArticleController = async (req, res) => {
  try {
    const postID = req.params.id;
    const putData = await db.collection('posts').updateOne(
      { _id: Number(postID) },
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          createdAt: new Date().getTime(),
        },
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const commentController = async (req, res) => {
  const postID = req.body.postID;
  const content = req.body.comment;
  try {
    const commentDB = await db.collection('comments').insertOne({
      postID,
      content,
      owner: req.session.user.nickname,
      avatar: req.session.user.avatar,
      createdAt: new Date().getTime(),
    });
    const commentID = commentDB.insertedId;
    console.log(commentID);
    const userDB = await db
      .collection('users')
      .updateOne(
        { email: req.session.user.email },
        { $addToSet: { comments: commentID } }
      );
    const postDB = await db.collection('posts').updateOne(
      { _id: Number(postID) },
      {
        $addToSet: {
          comments: commentID,
        },
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const addGoodController = async (req, res) => {
  try {
    const addGood = await db.collection('posts').updateOne(
      { _id: Number(req.body.postID) },
      {
        $set: { good: req.body.goodNumber },
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const addBadController = async (req, res) => {
  try {
    const addBad = await db.collection('posts').updateOne(
      { _id: Number(req.body.postID) },
      {
        $set: { bad: req.body.badNumber },
      }
    );
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

/* 
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
