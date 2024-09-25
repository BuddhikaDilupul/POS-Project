import express, { Router } from "express";
import { validate } from "express-validation";
import productValidation from "../../validations/product.validation";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../controllers/product/product.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new product
router.post(
  "/create",
  validate(productValidation.createProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  createProduct
);

// Get all products
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getAllProducts
);
router.get(
  "/getAllProductsCategoryWise",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getAllProducts
);

// Get product by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getProductById
);

// Update a product
router.put(
  "/:id",
  validate(productValidation.updateProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  updateProduct
);

// Soft delete a product
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  deleteProduct
);

export default router;
