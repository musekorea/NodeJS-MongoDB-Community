import multer from 'multer';

export const resLocals = (req, res, next) => {
  res.locals.user = req.session.user;
  res.locals.isLoggedIn = Boolean(req.session.isLoggedIn);
  res.locals.socialOnly = Boolean(req.session.socialOnly);
  console.log(res.locals);
  next();
};

export const multerUpload = multer({ dest: 'uploads/' });
