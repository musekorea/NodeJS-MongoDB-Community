import express from 'express';
import {
  communityController,
  getWriteController,
  postWriteController,
  getArticleController,
  commentController,
  addGoodController,
} from '../controllers/communityController';
import { loginOnly } from '../middlewares';

const communityRouter = express.Router();

communityRouter.get('/community', communityController);
communityRouter.get('/write', loginOnly, getWriteController);
communityRouter.post('/write', loginOnly, postWriteController);
communityRouter.get('/post/:id', getArticleController);
communityRouter.post('/comments', commentController);
communityRouter.post('/addGood', addGoodController);

export default communityRouter;
