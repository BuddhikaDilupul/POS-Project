import express, { Router } from 'express';
import categoryRoutes from './category.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', categoryRoutes);

export default router;
