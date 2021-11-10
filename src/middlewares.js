import multer from 'multer';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import { db } from './db.js';

export const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_S3_ID,
    secretAccessKey: process.env.AWS_S3_SECRET,
  },
});

export const resLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.posts = req.session.posts;
  res.locals.owner = req.session.owner;

  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.socialOnly = Boolean(req.session.socialOnly);
  next();
};

export const multerUpload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1000000,
  },
  storage: multerS3({
    s3: s3,
    bucket: `codeme-portfolio1/uploads`,
    acl: 'public-read',
  }),
});

export const deleteS3Avatar = (req, res, next) => {
  if (!req.file) {
    return next();
  }
  console.log(req.session.user.avatar.split('/')[4]);
  s3.deleteObject(
    {
      Bucket: 'codeme-portfolio1',
      Key: `uploads/${req.session.user.avatar.split('/')[4]}`,
    },
    (error, data) => {
      if (error) {
        throw error;
      }
      console.log(data);
    }
  );
  next();
};

export const loginOnly = (req, res, next) => {
  if (req.session.isLoggedIn) {
    return next();
  } else {
    req.flash('loginOnly', `Please login first`);
    return res.redirect('/');
  }
};

export const logoutOnly = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return next();
  } else {
    return res.redirect('/');
  }
};

export const ownerCheck = async (req, res, next) => {
  let postOwner = await db
    .collection('posts')
    .findOne({ _id: Number(req.params.id) });
  postOwner = postOwner.user;
  const currentUser = req.session.user.nickname;
  if (postOwner === currentUser) {
    return next();
  } else {
    return res
      .status(400)
      .send(`<h1>We're watching you! ${currentUser}, be careful! 👮‍♂️</h1>`);
  }
};
