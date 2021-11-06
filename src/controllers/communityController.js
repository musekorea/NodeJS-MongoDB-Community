import { db } from '../db.js';
import { ObjectId } from 'mongodb';
//const ObjectId = require('mongodb').ObjectId;

let counter;

export const communityController = async (req, res) => {
  const pageNum = req.params.page;
  console.log(pageNum);
  try {
    const allPosts = await db.collection('posts').find().toArray();
    const totalPage = Math.ceil(allPosts.length / 7);
    const posts = await db
      .collection('posts')
      .find()
      .sort({ _id: -1 })
      .limit(7)
      .skip(7 * (pageNum - 1))
      .toArray();
    posts.forEach((post) => {
      post.createdAt = createdAt(post.createdAt);
      if (post.comments) {
        post.commentsNumber = post.comments.length;
      } else {
        post.commentsNumber = 0;
      }
    });
    return res.status(200).render('community.ejs', { posts, totalPage });
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
    return res.status(300).redirect('/community/blog/1');
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
      .sort({ _id: -1 })
      .toArray();
    let nestedNumber = 0;
    comments.forEach((comment) => {
      comment.createdAt = createdAt(comment.createdAt);
      if (comment.nestedComments) {
        nestedNumber = nestedNumber + comment.nestedComments.length;
        comment.nestedComments.forEach((nest) => {
          nest.createdAt = createdAt(nest.createdAt);
        });
      }
    });
    const viewsUpdate = await db.collection('posts').updateOne(
      { _id: Number(req.params.id) },
      {
        $inc: { views: +1 },
      }
    );
    return res
      .status(200)
      .render('article.ejs', { post, comments, nestedNumber });
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
  const postID = req.params.id;
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

    return res.status(200).send({ commentID });
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

export const deleteArticleController = async (req, res) => {
  console.log(req.body);
  try {
    const post = await db
      .collection('posts')
      .findOne({ _id: Number(req.body.postID) });
    if (post.comments) {
      post.comments.forEach(async (comment) => {
        const commentID = comment.toString();
        const delUser = await db.collection('users').updateOne(
          { nickname: req.session.user.nickname },
          {
            $pull: {
              writeList: Number(req.body.postID),
              comments: comment,
            },
          }
        );
        const delComments = await db
          .collection('comments')
          .deleteOne({ _id: comment });
      });
    }
    if (post.nestedComments) {
      post.nestedComments.forEach(async (nestedID) => {
        const delUserNested = await db.collection('users').updateOne(
          { nickname: req.session.user.nickname },
          {
            $pull: { nestedComments: nestedID },
          }
        );
      });
    }
    const delPost = await db
      .collection('posts')
      .deleteOne({ _id: Number(req.body.postID) });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const addNestedCommentController = async (req, res) => {
  try {
    const addNestedComment = await db.collection('nestedComments').insertOne({
      postID: req.params.id,
      user: req.session.user.nickname,
      content: req.body.content,
      ownerComment: req.body.commentID,
      createdAt: new Date().getTime(),
    });
    const commentID = new ObjectId(req.body.commentID);
    const addToComments = await db.collection('comments').updateOne(
      { _id: commentID },
      {
        $addToSet: {
          nestedComments: {
            id: addNestedComment.insertedId,
            user: req.session.user.nickname,
            createdAt: new Date().getTime(),
            content: req.body.content,
            avatar: req.session.user.avatar,
          },
        },
      }
    );

    const addToUser = await db.collection('users').updateOne(
      { nickname: req.session.user.nickname },
      {
        $addToSet: {
          nestedComments: addNestedComment.insertedId,
        },
      }
    );
    const nestedCommentsNumber = await db.collection('posts').updateOne(
      { comments: commentID },
      {
        $inc: { nestedCommentsNumber: +1 },
        $addToSet: {
          nestedComments: addNestedComment.insertedId,
        },
      }
    );

    return res
      .status(200)
      .send({ nestedCommentID: addNestedComment.insertedId });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const commentDeleteController = async (req, res) => {
  const commentID = new ObjectId(req.body.commentID);
  try {
    const users = await db
      .collection('users')
      .updateOne(
        { nickname: req.session.user.nickname },
        { $pull: { comments: commentID } }
      );
    const posts = await db.collection('posts').updateOne(
      { _id: Number(req.params.id) },
      {
        $pull: { comments: commentID },
      }
    );
    const commetns = await db
      .collection('comments')
      .deleteOne({ _id: commentID });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const deleteNestedCommentController = async (req, res) => {
  const postID = Number(req.body.postID);
  const commentID = new ObjectId(req.body.commentID);
  const nestedID = new ObjectId(req.params.id);
  try {
    const userDelete = await db.collection('users').updateOne(
      { nickname: req.session.user.nickname },
      {
        $pull: { nestedComments: nestedID },
      }
    );
    const postDelete = await db
      .collection('posts')
      .updateOne({ _id: postID }, { $inc: { nestedCommentsNumber: -1 } });
    const commentDelete = await db.collection('comments').updateOne(
      { _id: commentID },
      {
        $pull: { nestedComments: { id: nestedID } },
      }
    );
    const nestedDelete = await db
      .collection('nestedComments')
      .deleteOne({ _id: nestedID });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const sortByNewController = async (req, res) => {
  const pageNum = req.params.page;
  try {
    const allPosts = await db.collection('posts').find().toArray();
    const totalPage = Math.ceil(allPosts.length / 7);
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ _id: -1 })
      .limit(7)
      .skip(7 * (pageNum - 1))
      .toArray();
    posts.forEach((post) => {
      post.createdAt = createdAt(post.createdAt);
      if (post.comments) {
        post.commentsNumber = post.comments.length;
      } else {
        post.commentsNumber = 0;
      }
    });
    return res
      .status(200)
      .render('community.ejs', { posts, sortType: 'new', totalPage });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const sortByPopularontroller = async (req, res) => {
  const pageNum = req.params.page;
  try {
    const allPosts = await db.collection('posts').find().toArray();
    const totalPage = Math.ceil(allPosts.length / 7);
    console.log(`totalPage`, totalPage);
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ views: -1 })
      .limit(7)
      .skip(7 * (pageNum - 1))
      .toArray();
    posts.forEach((post) => {
      post.createdAt = createdAt(post.createdAt);
      if (post.comments) {
        post.commentsNumber = post.comments.length;
      } else {
        post.commentsNumber = 0;
      }
    });
    return res
      .status(200)
      .render('community.ejs', { posts, sortType: 'popular', totalPage });
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};

export const searchController = async (req, res) => {
  const query = req.query.value;
  try {
    const results = await db
      .collection('posts')
      .find({
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
        ],
      })
      .toArray();
    console.log(results);
    if (results.length !== 0) {
      return res.status(200).render('search.ejs', { posts: results, query });
    } else {
      return res.status(200).render('noSearch.ejs');
    }
  } catch (error) {
    console.log(error);
    return res.status(500).redirect('/error');
  }
};
