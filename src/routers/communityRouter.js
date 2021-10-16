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
  commentDeleteController,
  deleteNestedCommentController,
} from '../controllers/communityController';
import { loginOnly, ownerCheck } from '../middlewares';

const communityRouter = express.Router();

communityRouter.get('/community', communityController);
communityRouter.get('/post/:id', getArticleController);
communityRouter.get('/article', loginOnly, getWriteController);
communityRouter.post('/article', loginOnly, postWriteController);
communityRouter.get(
  '/article/:id',
  loginOnly,
  ownerCheck,
  getEditArticleController
);
communityRouter.put(
  '/article/:id',
  loginOnly,
  ownerCheck,
  putEditArticleController
);

communityRouter.delete(
  '/article/:id',
  loginOnly,
  ownerCheck,
  deleteArticleController
);

communityRouter.post('/addGood', addGoodController);
communityRouter.post('/addBad', addBadController);

communityRouter.post('/comments/:id', loginOnly, commentController);
communityRouter.delete('/comments/:id', loginOnly, commentDeleteController);

communityRouter.post('/nested', loginOnly, addNestedCommentController);

communityRouter.delete('/nested/:id', loginOnly, deleteNestedCommentController);

export default communityRouter;
