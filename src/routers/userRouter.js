import express from 'express';
import {
  getJoinController,
  postJoinController,
  getLoginController,
  postLoginController,
  logoutController,
  githubStartController,
  githubFinishController,
  googleStartController,
  googleFinishController,
  wechatStartController,
  wechatFinishController,
} from '../controllers/userController';
import { multerUpload } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/join', getJoinController);
userRouter.post('/join', multerUpload.single('avatar'), postJoinController);
userRouter.get('/login', getLoginController);
userRouter.post('/login', postLoginController);
userRouter.get('/logout', logoutController);
userRouter.get('/github/start', githubStartController);
userRouter.get('/github/callback', githubFinishController);
userRouter.get('/google/start', googleStartController);
userRouter.get('/google/callback', googleFinishController);
userRouter.get('/wechat/start', wechatStartController);
userRouter.get('/wechat/callback', wechatFinishController);

export default userRouter;
