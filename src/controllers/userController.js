import { db } from '../db.js';
import bcrypt from 'bcrypt';

export const getJoinController = (req, res) => {
  return res.status(200).render('join.ejs');
};

export const postJoinController = async (req, res) => {
  const email = req.body.joinEmail;
  const pwd = req.body.joinPassword;
  const pwd2 = req.body.joinPassword2;
  const nickname = req.body.joinNickname;
  const gender = req.body.joinGender;
  const birth = req.body.joinBirth;
  let avatar = '';
  if (req.file) {
    avatar = req.file.path;
  } else {
    avatar = '';
  }
  if (pwd !== pwd2) {
    return res.status(400).render('join.ejs', {
      passwordError: ` 🎯  Passwords don't match! Please Check`,
    });
  }

  //=========JOIN EMAIL, NICKNAME VALIDATION=========================
  try {
    const emailCheck = await db.collection('users').findOne({ email });
    if (emailCheck) {
      console.log('EMAIL EXISTS');
      res.locals.emailError = ` 😹 : Please try another email. This email already exists`;
      return res.status(400).render('join.ejs');
    } else {
      const nicknameCheck = await db.collection('users').findOne({ nickname });
      if (nicknameCheck) {
        console.log('NICKNAME EXISTS');
        res.locals.nicknameError = ` 😹 : Please try another nickname. This nickname already exists`;
        return res.status(300).render('join.ejs');
      }
    }
  } catch (error) {
    console.log(error);
  }
  //==========JOIN INSERT TO DB==============================
  try {
    const password = await bcrypt.hash(pwd, 5);
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

export const postLoginController = async (req, res) => {
  const email = req.body.email;
  const currentPassword = req.body.password;
  try {
    const emailCheck = await db.collection('users').findOne({ email });
    if (!emailCheck) {
      return res.status(400).render('login.ejs', {
        emailError: `  🙄 Email doesn't exist! Please try again.`,
      });
    } else {
      const hashingPassword = emailCheck.password;
      bcrypt.compare(currentPassword, hashingPassword, (error, result) => {
        if (!result) {
          return res.status(400).render('login.ejs', {
            passwordError: `  👤 Oh!! It's Wrong Password. Please try again`,
          });
        } else {
          delete emailCheck.password;
          req.session.isLoggedIn = true;
          req.session.user = emailCheck;
          return res.status(200).redirect('/');
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const logoutController = async (req, res) => {
  /*   req.session.isLoggedIn = false;
  req.session.user = null; */
  req.session.destroy();
  res.clearCookie('connect.sid');
  return res.status(200).redirect('/');
};
