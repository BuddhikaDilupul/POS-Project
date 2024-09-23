import express, { Router } from 'express';
import userRouter from "../routes/user/index";
import customerRouter from "../routes/customer/index";
import ingredentsRouter from "../routes/ingredients/index";
import recipeRouter from "../routes/recipe/index";
import productRouter from "../routes/product/index";
import categoryRouter from "../routes/category/index";
import stockRouter from "../routes/stock/index";
import suplierRouter from "../routes/supliers/index";
import orderRouter from "../routes/order/index";
import cashInHandRouter from "../routes/cashInHand/index";
const router: Router = express.Router();

router.use("/user", userRouter);
router.use("/customer", customerRouter);
router.use("/ingredients", ingredentsRouter);
router.use("/recipe", recipeRouter);
router.use("/product", productRouter);
router.use("/category", categoryRouter);
router.use("/stock", stockRouter);
router.use("/suplier", suplierRouter);
router.use("/order", orderRouter);
router.use("/cashInHand", cashInHandRouter);

export default router;