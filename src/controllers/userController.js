import { db } from '../db.js';
import bcrypt from 'bcrypt';
import fetch from 'cross-fetch';

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
  console.log(req.file);
  if (req.file) {
    avatar = req.file.location;
  } else {
    avatar = '/images/noProfile.png';
  }
  if (pwd !== pwd2) {
    req.flash('passwordError', "🎯  Passwords don't match! Please Check");
    return res.status(403).redirect('/user/join');
  }

  try {
    const user = await db.collection('users').findOne({ email });
    if (user) {
      console.log('EMAIL EXISTS');
      req.flash(
        'emailError',
        '😹 : Please try another email. This email already exists'
      );
      return res.status(403).redirect('/user/join');
    } else {
      const nicknameCheck = await db.collection('users').findOne({ nickname });
      if (nicknameCheck) {
        console.log('NICKNAME EXISTS');
        req.flash(
          'nicknameError',
          '😹 : Please try another nickname. This nickname already exists'
        );
        return res.status(403).redirect('/user/join');
      }
    }
  } catch (error) {
    console.log(error);
  }

  try {
    const password = bcrypt.hashSync(pwd, 5);
    const join = await db.collection('users').insertOne({
      email,
      password,
      nickname,
      gender,
      birth,
      avatar,
      socialOnly: false,
      //writeList: [],
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
    if (!user) {
      req.flash('emailError', "🙄 Email doesn't exist! Please try again.");
      return res.status(403).redirect('/user/login');
    } else if (user.socialOnly) {
      req.flash(
        'socialError',
        `🧘‍♀️ You already have a ${user.oAuth} Account. Please try ${user.oAuth} Login!`
      );
      return res.status(403).redirect('/user/login');
    } else {
      const hashingPassword = user.password;
      bcrypt.compare(currentPassword, hashingPassword, (error, result) => {
        if (!result) {
          req.flash(
            'passwordError',
            "👤 Oh!! It's Wrong Password. Please try again"
          );
          return res.status(403).redirect('/user/login');
        } else {
          delete user.password;
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.socialOnly = false;
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
        req.session.socialOnly = true;
        req.session.user = userExist;
        return res.status(300).redirect('/');
      } else {
        const nickname = userJson.login;
        const gender = '';
        const birth = '';
        let avatar = '';
        if (userJson.avatar_url) {
          avatar = userJson.avatar_url;
        } else {
          avatar = '/images/noProfile.png';
        }
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
      const email = userJson.email;
      const userExist = await db.collection('users').findOne({ email });
      console.log(userJson);
      if (userExist) {
        req.session.isLoggedIn = true;
        req.session.user = userExist;
        req.session.socialOnly = true;
        return res.status(300).redirect('/');
      } else {
        const nickname = `${userJson.family_name} ${userJson.given_name}`;
        const gender = '';
        const birth = '';
        let avatar = '';
        if (userJson) {
          avatar = userJson.picture;
        } else {
          avatar = '/images/noProfile.png';
        }
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

//===========USER PROFILE==================
export const getUserProfileController = async (req, res) => {
  const owner = req.params.user;
  let publicUser;
  if (req.session.isLoggedIn) {
    if (req.session.user.nickname === owner) {
      return res.status(200).render('userProfile.ejs');
    } else {
      publicUser = await db.collection('users').findOne({ nickname: owner });
      return res.status(200).render('publicProfile.ejs', { publicUser });
    }
  } else {
    publicUser = await db.collection('users').findOne({ nickname: owner });
    return res.status(200).render('publicProfile.ejs', { publicUser });
  }
};

export const getEditProfileController = (req, res) => {
  res.status(200).render('editUserProfile.ejs');
};

const deleteAvatarFile = (path) => {};

/* const deleteAvatarFile = (path) => {
  try {
    const checkFileExist = fs.existsSync(path);
    if (checkFileExist) {
      fs.unlinkSync(path);
    } else {
      return;
    }
  } catch (error) {
    throw error;
  }
}; */

export const postEditProfileController = async (req, res) => {
  if (req.body.password) {
    console.log('password check');
    const currentPassword = req.body.password;
    const currentUser = await db
      .collection('users')
      .findOne({ email: req.session.user.email });
    const hashingPassword = currentUser.password;
    const result = bcrypt.compareSync(currentPassword, hashingPassword);
    if (!result) {
      req.flash('emailCheck', ` : 👮‍♀️ Password doesn't match!`);
      return res.status(403).redirect(`/user/editProfile`);
    }
  }
  try {
    const avatarPath = req.session.user.avatar;

    let avatar = '';
    if (req.file) {
      avatar = req.file.location;
    } else {
      avatar = req.session.user.avatar;
    }
    let { editEmail, nickname, gender, birth } = req.body;
    if (
      editEmail === req.session.user.email &&
      nickname === req.session.user.nickname
    ) {
      const updateProfile = await db.collection('users').updateOne(
        { email: req.session.user.email },
        {
          $set: {
            email: req.session.user.email,
            nickname: req.session.user.nickname,
            gender,
            birth,
            avatar,
            socialOnly: req.session.user.socialOnly,
            oAuth: req.session.user.oAuth,
          },
        }
      );
      //=========DELETE OLD AVATAR================//
      if (req.file) {
        deleteAvatarFile(avatarPath);
      }
      req.session.user = await db
        .collection('users')
        .findOne({ email: editEmail });
      req.flash('message', ` ✔ Profile has updated`);
      //=======USER'S POSTS AVATAR UPDATE========//
      const userPosts = await db
        .collection('posts')
        .find({ user: req.session.user.nickname })
        .toArray();
      userPosts.forEach(async (post) => {
        await db
          .collection('posts')
          .updateOne(
            { _id: Number(post._id) },
            { $set: { avatar: req.session.user.avatar } }
          );
      });
      return res
        .status(300)
        .redirect(`/user/userProfile/${req.session.user.nickname}`);
    } else {
      const emailCheck = await db
        .collection('users')
        .find({ email: editEmail })
        .toArray();
      if (emailCheck.length !== 0 && editEmail !== req.session.user.email) {
        req.flash('emailExist', ` ${editEmail} is already taken`);
        return res.status(403).redirect(`/user/editProfile`);
      }
      const nicknameCheck = await db
        .collection('users')
        .find({ nickname })
        .toArray();

      if (
        nicknameCheck.length !== 0 &&
        nickname !== req.session.user.nickname
      ) {
        req.flash('nicknameExist', ` ${nickname} is already taken`);
        return res.status(403).redirect(`/user/editProfile`);
      }
      const updateUser = await db.collection('users').updateOne(
        { email: req.session.user.email },
        {
          $set: {
            email: editEmail,
            nickname,
            gender,
            birth,
            avatar,
            socialOnly: req.session.user.socialOnly,
            oAuth: req.session.user.oAuth,
          },
        }
      );
      //=========DELETE OLD AVATAR================//
      if (req.file) {
        deleteAvatarFile(avatarPath);
      }
      req.session.user = await db
        .collection('users')
        .findOne({ email: editEmail });
      req.flash('message', ` ✔ Profile has updated`);
      //=======USER'S POSTS AVATAR UPDATE========//
      const userPosts = await db
        .collection('posts')
        .find({ user: req.session.user.nickname })
        .toArray();
      userPosts.forEach(async (post) => {
        await db
          .collection('posts')
          .updateOne(
            { _id: Number(post._id) },
            { $set: { avatar: req.session.user.avatar } }
          );
      });
      return res
        .status(300)
        .redirect(`/user/userProfile/${req.session.user.nickname}`);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getChangePasswordController = (req, res) => {
  return res.status(200).render('changePassword');
};
export const postChangePasswordController = async (req, res) => {
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;
  try {
    if (oldPassword === '') {
      const socialUpdate = await db
        .collection('users')
        .updateOne(
          { email: req.session.user.email },
          { $set: { password: await bcrypt.hash(newPassword, 5) } }
        );
      req.flash('message', '✔ Password Updated');
      res.sendStatus(200);
    } else {
      const user = await db
        .collection('users')
        .findOne({ email: req.session.user.email });
      const localPassword = await user.password;
      const pwdCheck = bcrypt.compareSync(oldPassword, localPassword);
      if (pwdCheck) {
        const localsocialUpdate = await db
          .collection('users')
          .updateOne(
            { email: req.session.user.email },
            { $set: { password: await bcrypt.hash(newPassword, 5) } }
          );
        req.flash('message', '✔ Password Updated');
        res.status(200).send({ nickname: req.session.user.nickname });
      } else {
        req.flash('pwdCheck', " ✋ Password doesn't match");
        return res.sendStatus(403);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
