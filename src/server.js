import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import { resLocals, loginOnly } from './middlewares.js';
import flash from 'express-flash';

import rootRouter from './routers/rootRouter.js';
import userRouter from './routers/userRouter.js';
import communityRouter from './routers/communityRouter.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use('/public', express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
  })
);
app.use(resLocals);
app.use(flash());

app.use('/', rootRouter);
app.use('/user', userRouter);
app.use('/community', communityRouter);

export default app;
