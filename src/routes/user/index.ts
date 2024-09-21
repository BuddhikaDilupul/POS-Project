import express, { Router } from 'express';
import userRoutes from './user.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', userRoutes);

export default router;
