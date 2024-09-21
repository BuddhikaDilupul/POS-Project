import express, { Router } from 'express';
import ingredentsRoutes from './ingredients.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', ingredentsRoutes);

export default router;
