import multer from 'multer';

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
});

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
