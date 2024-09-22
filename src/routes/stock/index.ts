import express, { Router } from 'express';
import stockRoutes from './stocks.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', stockRoutes);

export default router;
