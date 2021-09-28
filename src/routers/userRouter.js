import express from 'express';
import {
  getJoinController,
  postJoinController,
} from '../controllers/userController';
import usertRouter from './userRouter';

const userRouter = express.Router();

userRouter.get('/join', getJoinController);
userRouter.post('/join', postJoinController);

export default userRouter;
