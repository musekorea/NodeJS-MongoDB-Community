import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import rootRouter from './routers/rootRouter.js';
import userRouter from './routers/userRouter.js';
import todoRouter from './routers/todoRouter.js';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', rootRouter);
app.use('/user', userRouter);
app.use('/todo', todoRouter);

export default app;
