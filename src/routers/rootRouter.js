import express from 'express';
import { homeController } from '../controllers/rootController';

const rootRouter = express.Router();

rootRouter.get('/', homeController);

export default rootRouter;
