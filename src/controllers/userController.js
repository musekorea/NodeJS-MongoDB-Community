import { db } from '../db.js';
import bcrypt from 'bcrypt';

export const getJoinController = (req, res) => {
  return res.status(200).render('join.ejs');
};

export const postJoinController = async (req, res) => {
  console.log(req.body);
  const email = req.body.joinEmail;
  const pwd = req.body.joinPassword;
  const nickname = req.body.joinNickname;
  const gender = req.body.joinGender;
  const birth = req.body.joinBirth;
  const avatar = req.body.joinAvatar;
  const password = await bcrypt.hash(pwd, 5);
  try {
    const join = await db.collection('users').insertOne({
      email,
      password,
      nickname,
      gender,
      birth,
      avatar,
    });
    res.status(300).redirect('/user/login');
  } catch (error) {
    console.log(error);
  }
};

export const getLoginController = (req, res) => {
  return res.status(200).render('login.ejs');
};

export const postLoginController = (req, res) => {
  console.log(req.body);
};
