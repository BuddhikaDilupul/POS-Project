import express, { Router } from "express";
import { validate } from "express-validation";
import productValidation from "../../utils/validations/product.validation";
import productController from "../../controllers/product/product.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../utils/types/type";
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router: Router = express.Router();

// Create a new product
router.post(
  "/create",
  upload.single('imageFile'),
  validate(productValidation.createProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  productController.createProduct
);

// Get all products
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  productController.getAllProducts
);
router.get(
  "/getAllProductsCategoryWise",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  productController.getAllProducts
);

// Get product by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  productController.getProductById
);

// Update a product
router.put(
  "/:id",
  validate(productValidation.updateProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  productController.updateProduct
);

// Soft delete a product
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  productController.deleteProduct
);

export default router;
