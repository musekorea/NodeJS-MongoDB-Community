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
  getUserProfileController,
  getEditProfileController,
  postEditProfileController,
} from '../controllers/userController';
import { multerUpload, loginOnly, logoutOnly } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/join', logoutOnly, getJoinController);
userRouter.post(
  '/join',
  logoutOnly,
  multerUpload.single('avatar'),
  postJoinController
);
userRouter.get('/login', logoutOnly, getLoginController);
userRouter.post('/login', logoutOnly, postLoginController);
userRouter.get('/logout', loginOnly, logoutController);
userRouter.get('/github/start', logoutOnly, githubStartController);
userRouter.get('/github/callback', logoutOnly, githubFinishController);
userRouter.get('/google/start', logoutOnly, googleStartController);
userRouter.get('/google/callback', logoutOnly, googleFinishController);
userRouter.get('/wechat/start', logoutOnly, wechatStartController);
userRouter.get('/wechat/callback', logoutOnly, wechatFinishController);
userRouter.get('/userProfile', loginOnly, getUserProfileController);
userRouter.get('/editProfile', loginOnly, getEditProfileController);
userRouter.post(
  '/editProfile',
  loginOnly,
  multerUpload.single('avatar'),
  postEditProfileController
);

export default userRouter;
