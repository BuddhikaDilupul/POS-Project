import express, { Router } from 'express';
import productRoutes from './product.routes';
import productAddonRoutes from './productAddon.routes';
import subproductRoutes from './subproduct.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1/product', productRoutes);
router.use('/v1/addmons', productAddonRoutes);
router.use('/v1/subproduct/', subproductRoutes);

export default router;
