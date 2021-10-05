import { db } from '../db.js';
import bcrypt from 'bcrypt';
import fetch from 'cross-fetch';
import { token } from 'morgan';

//=========LOCAL JOIN===========================

export const getJoinController = (req, res) => {
  return res.status(200).render('join.ejs');
};

export const postJoinController = async (req, res) => {
  const email = req.body.joinEmail;
  const pwd = req.body.joinPassword;
  const pwd2 = req.body.joinPassword2;
  const nickname = req.body.joinNickname;
  let gender = '';
  if (req.body.joinGender === 'Choose...') {
    gender = '';
  } else {
    gender = req.body.joinGender;
  }
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

  try {
    const user = await db.collection('users').findOne({ email });
    if (user) {
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

  try {
    const password = await bcrypt.hash(pwd, 5);
    const join = await db.collection('users').insertOne({
      email,
      password,
      nickname,
      gender,
      birth,
      avatar,
      socialOnly: false,
    });
    res.status(300).redirect('/user/login');
  } catch (error) {
    console.log(error);
  }
};

//==========LOCAL LOGIN=============================

export const getLoginController = (req, res) => {
  return res.status(200).render('login.ejs');
};

export const postLoginController = async (req, res) => {
  const email = req.body.email;
  const currentPassword = req.body.password;
  try {
    const user = await db.collection('users').findOne({ email });
    if (user.socialOnly) {
      return res.status(400).render('login.ejs', {
        socialError: `🧘‍♀️ You already have a ${user.oAuth} Account. Please try ${user.oAuth} Login!`,
      });
    }

    if (!user) {
      return res.status(400).render('login.ejs', {
        emailError: `  🙄 Email doesn't exist! Please try again.`,
      });
    } else {
      const hashingPassword = user.password;
      bcrypt.compare(currentPassword, hashingPassword, (error, result) => {
        if (!result) {
          return res.status(400).render('login.ejs', {
            passwordError: `  👤 Oh!! It's Wrong Password. Please try again`,
          });
        } else {
          delete user.password;
          req.session.isLoggedIn = true;
          req.session.user = user;
          return res.status(200).redirect('/');
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//=============LOGOUT==============================

export const logoutController = async (req, res) => {
  /*   req.session.isLoggedIn = false;
  req.session.user = null; */
  req.session.destroy();
  res.clearCookie('connect.sid');
  return res.status(200).redirect('/');
};
//=================GITHUB OAUTH====================

export const githubStartController = (req, res) => {
  const baseURL = 'https://github.com/login/oauth/authorize?';
  const config = {
    client_id: 'cb7206b86aabc34607fe',
    scope: 'read:user user:email',
    allow_signup: true,
  };
  const query = new URLSearchParams(config).toString();
  const finalURL = baseURL + query;
  res.redirect(finalURL);
};

export const githubFinishController = async (req, res) => {
  const baseURL = 'https://github.com/login/oauth/access_token?';
  const config = {
    client_id: 'cb7206b86aabc34607fe',
    client_secret: process.env.GITHUB_SECRET,
    code: req.query.code,
  };
  const query = new URLSearchParams(config).toString();
  const finalURL = baseURL + query;
  try {
    const tokenFetch = await fetch(finalURL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    });
    const tokenJson = await tokenFetch.json();
    const access_token = tokenJson.access_token;
    if (access_token) {
      const userRequest = await fetch(`https://api.github.com/user`, {
        method: 'get',
        headers: { Authorization: `token ${access_token}` },
      });
      const userJson = await userRequest.json();
      const emailRequest = await fetch(`https://api.github.com/user/emails`, {
        method: 'get',
        headers: { Authorization: `token ${access_token}` },
      });
      const emailJson = await emailRequest.json();
      const email = emailJson.find((item) => {
        return item.primary === true && item.verified === true;
      }).email;
      const userExist = await db.collection('users').findOne({ email });
      if (userExist) {
        req.session.isLoggedIn = true;
        req.session.user = userExist;
        return res.status(300).redirect('/');
      } else {
        const nickname = userJson.login;
        const gender = '';
        const birth = '';
        const avatar = userJson.avatar_url;
        const password = '';
        const addUser = await db.collection('users').insertOne({
          email,
          password,
          nickname,
          gender,
          birth,
          avatar,
          socialOnly: true,
          oAuth: `Github`,
        });
        req.session.isLoggedIn = true;
        req.session.socialOnly = true;
        req.session.user = await db.collection('users').findOne({ email });
        return res.status(300).redirect('/');
      }
    } else {
      return res.status(300).redirect('/user/login');
    }
  } catch (error) {
    console.log(error);
  }
};
//==========GOOGLE LOGIN=================
export const googleStartController = (req, res) => {
  const baseUrl = `https://accounts.google.com/o/oauth2/v2/auth?`;
  const config = {
    client_id:
      '68667364665-q7g12ujqcvdaa9o1nir08r0ouclhuid1.apps.googleusercontent.com',
    redirect_uri: `http://localhost:8080/user/google/callback`,
    response_type: 'code',
    scope: 'openid email profile',
  };
  const query = new URLSearchParams(config).toString();
  const finalURL = baseUrl + query;
  res.redirect(finalURL);
};

export const googleFinishController = async (req, res) => {
  const baseURL = `https://oauth2.googleapis.com/token?`;
  const config = {
    code: req.query.code,
    client_id:
      '68667364665-q7g12ujqcvdaa9o1nir08r0ouclhuid1.apps.googleusercontent.com',
    client_secret: process.env.GOOGLE_SECRET,
    redirect_uri: `http://localhost:8080/user/google/callback`,
    grant_type: 'authorization_code',
  };
  const query = new URLSearchParams(config).toString();
  const finalURL = baseURL + query;
  try {
    const requestToken = await fetch(finalURL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const tokenJson = await requestToken.json();
    const accessToken = tokenJson.access_token;
    if (accessToken) {
      const userFetch = await fetch(
        `https://www.googleapis.com/oauth2/v3/userinfo`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const userJson = await userFetch.json();
      console.log(userJson);
      const email = userJson.email;
      const userExist = await db.collection('users').findOne({ email });
      if (userExist) {
        req.session.isLoggedIn = true;
        req.session.user = userExist;
        return res.status(300).redirect('/');
      } else {
        const nickname = `${userJson.family_name} ${userJson.given_name}`;
        const gender = '';
        const birth = '';
        const avatar = userJson.picture;
        const password = '';
        const addUser = await db.collection('users').insertOne({
          email,
          password,
          nickname,
          gender,
          birth,
          avatar,
          socialOnly: true,
          oAuth: `Google`,
        });
        req.session.isLoggedIn = true;
        req.session.socialOnly = true;
        req.session.user = await db.collection('users').findOne({ email });
        return res.status(300).redirect('/');
      }
    } else {
      console.log(`error`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const wechatStartController = (req, res) => {
  const baseURL = `https://open.weixin.qq.com/connect/qrconnect?`;
  const config = {
    appid: process.env.WECHAT_APPID,
    redirect_uri: `http://localhost:8080/user/wechat/callback:`,
    response_type: 'code',
    scope: 'snsapi_login',
  };
  const query = new URLSearchParams(config).toString();
  const finalURL = baseURL + query;
  res.redirect(finalURL);
};
export const wechatFinishController = (req, res) => {
  console.log(req);
};
