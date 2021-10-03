import express from 'express';
import {
  getJoinController,
  postJoinController,
  getLoginController,
  postLoginController,
  logoutController,
  githubStartController,
} from '../controllers/userController';
import { multerUpload } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/join', getJoinController);
userRouter.post('/join', multerUpload.single('avatar'), postJoinController);
userRouter.get('/login', getLoginController);
userRouter.post('/login', postLoginController);
userRouter.get('/logout', logoutController);
userRouter.get('/github/start', githubStartController);

export default userRouter;
