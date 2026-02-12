import express from 'express';
import * as controller from '../controllers/filmeController.js';

const router = express.Router();

router.post('/filme', controller.create);
router.get('/filme', controller.getAll);
router.get('/filme/:id', controller.getById);
router.put('/filme/:id', controller.update);
router.delete('/filme/:id', controller.remove);

export default router;