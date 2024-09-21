import express, { Router } from 'express';
import customerRoutes from './customer.router';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', customerRoutes);

export default router;
