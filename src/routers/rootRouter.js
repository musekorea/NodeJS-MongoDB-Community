import express from 'express';
import { homeController, errorController } from '../controllers/rootController';

const rootRouter = express.Router();

rootRouter.get('/', homeController);
rootRouter.get('/error', errorController);

export default rootRouter;
