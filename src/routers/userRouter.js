import express from 'express';
import multer from 'multer';
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
  getChangePasswordController,
  postChangePasswordController,
} from '../controllers/userController';
import { multerUpload, loginOnly, logoutOnly } from '../middlewares';

const userRouter = express.Router();
const upload = multerUpload.single('avatar');

userRouter.get('/join', logoutOnly, getJoinController);
userRouter.post(
  '/join',
  logoutOnly,
  function (req, res, next) {
    upload(req, res, function (error) {
      if (error instanceof multer.MulterError) {
        console.log(`multer error`, error);
        req.flash('multer', ` 🚫 Unbale to upload file larger than 1MB`);
        return res.redirect('/user/join');
      } else if (error) {
        console.log(`nomral error`, error);
        req.flash('multer', `File has some error`);
        return res.redirect('user/join');
      } else {
        return next();
      }
    });
  },
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
userRouter.get('/userProfile/:user', getUserProfileController);
userRouter.get('/editProfile', loginOnly, getEditProfileController);
userRouter.post(
  '/editProfile',
  loginOnly,
  function (req, res, next) {
    upload(req, res, function (error) {
      if (error instanceof multer.MulterError) {
        console.log(`multer error`, error);
        req.flash('multer', ` 🚫 Unbale to upload file larger than 1MB`);
        return res.redirect('/user/join');
      } else if (error) {
        console.log(`nomral error`, error);
        req.flash('multer', `File has some error`);
        return res.redirect('user/join');
      } else {
        return next();
      }
    });
  },
  postEditProfileController
);
userRouter.get('/changePassword', loginOnly, getChangePasswordController);
userRouter.post('/changePassword', loginOnly, postChangePasswordController);

export default userRouter;
