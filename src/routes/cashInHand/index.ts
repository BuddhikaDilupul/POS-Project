import express, { Router } from 'express';
import cashInHandRoutes from './cashInHand.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', cashInHandRoutes);

export default router;
