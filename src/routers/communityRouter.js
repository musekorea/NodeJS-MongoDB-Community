import express from 'express';
import {
  communityController,
  getWriteController,
  postWriteController,
  getArticleController,
  commentController,
  addGoodController,
  addBadController,
  getEditArticleController,
  putEditArticleController,
  deleteArticleController,
  addNestedCommentController,
} from '../controllers/communityController';
import { loginOnly, ownerCheck } from '../middlewares';

const communityRouter = express.Router();

communityRouter.get('/community', communityController);
communityRouter.get('/write', loginOnly, getWriteController);
communityRouter.post('/write', loginOnly, postWriteController);
communityRouter.get('/post/:id', getArticleController);
communityRouter.post('/comments', loginOnly, commentController);
communityRouter.post('/addGood', addGoodController);
communityRouter.post('/addBad', addBadController);
communityRouter.get(
  '/editArticle/:id',
  loginOnly,
  ownerCheck,
  getEditArticleController
);
communityRouter.put(
  '/editArticle/:id',
  loginOnly,
  ownerCheck,
  putEditArticleController
);

communityRouter.delete(
  '/deleteArticle/:id',
  loginOnly,
  ownerCheck,
  deleteArticleController
);

communityRouter.post(
  '/addNestedComment',
  loginOnly,
  addNestedCommentController
);

export default communityRouter;
