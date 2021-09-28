import express from 'express';
import {
  writeController,
  newScheduleController,
  listController,
  descriptionController,
  editController,
  deleteController,
  updateController,
} from '../controllers/todoController';

const todoRouter = express.Router();

todoRouter.get('/write', writeController);
todoRouter.post('/newSchedule', newScheduleController);
todoRouter.get('/list', listController);
todoRouter.get('/description/:id', descriptionController);
todoRouter.get('/edit/:id', editController);
todoRouter.delete('/delete', deleteController);
todoRouter.patch('/update/:id', updateController);

export default todoRouter;
