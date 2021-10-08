import express from 'express';
import {
  communityController,
  getWriteController,
  postWriteController,
  descriptionController,
  editController,
  deleteController,
  updateController,
} from '../controllers/communityController';

const communityRouter = express.Router();

communityRouter.get('/community', communityController);
communityRouter.get('/write', getWriteController);
communityRouter.post('/write', postWriteController);
/* communityRouter.get('/description/:id', descriptionController);
communityRouter.get('/edit/:id', editController);
communityRouter.delete('/delete', deleteController);
communityRouter.patch('/update/:id', updateController); */

export default communityRouter;
