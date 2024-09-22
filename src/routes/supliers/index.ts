import express, { Router } from 'express';
import suplierRoutes from './suplier.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', suplierRoutes);

export default router;
