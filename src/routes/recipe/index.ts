import express, { Router } from 'express';
import recipeRoutes from './recipe.routes';

const router: Router = express.Router();

// Use the class routes under the '/v1' path
router.use('/v1', recipeRoutes);

export default router;
