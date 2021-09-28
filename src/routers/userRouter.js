import express from 'express';
import {
  getJoinController,
  postJoinController,
  getLoginController,
  postLoginController,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/join', getJoinController);
userRouter.post('/join', postJoinController);
userRouter.get('/login', getLoginController);
userRouter.post('/login', postLoginController);

export default userRouter;
