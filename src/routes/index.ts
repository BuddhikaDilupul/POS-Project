import express, { Router } from 'express';
import userRouter from "../routes/user/index";
import customerRouter from "../routes/customer/index";
import ingredentsRouter from "../routes/ingredients/index";
import recipeRouter from "../routes/recipe/index";
import productRouter from "../routes/product/index";
import categoryRouter from "../routes/category/index";
const router: Router = express.Router();

router.use("/user", userRouter);
router.use("/customer", customerRouter);
router.use("/ingredients", ingredentsRouter);
router.use("/recipe", recipeRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);

export default router;