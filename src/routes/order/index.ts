import express, { Router } from 'express';
import orderRoutes from './order.route';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', orderRoutes);

export default router;
