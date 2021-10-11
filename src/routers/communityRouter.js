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
} from '../controllers/communityController';
import { loginOnly } from '../middlewares';

const communityRouter = express.Router();

communityRouter.get('/community', communityController);
communityRouter.get('/write', loginOnly, getWriteController);
communityRouter.post('/write', loginOnly, postWriteController);
communityRouter.get('/post/:id', getArticleController);
communityRouter.post('/comments', loginOnly, commentController);
communityRouter.post('/addGood', addGoodController);
communityRouter.post('/addBad', addBadController);
communityRouter.get('/editArticle/:id', loginOnly, getEditArticleController);
communityRouter.put('/editArticle/:id', loginOnly, putEditArticleController);

export default communityRouter;
