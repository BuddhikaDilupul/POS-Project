import express, { Router } from "express";
import { validate } from "express-validation";
import subProductValidation from "../../validations/subProduct.validation";
import {
  createSubProduct,
  getAllSubProducts,
  getSubProductById,
  updateSubProduct,
  deleteSubProduct,
} from "../../controllers/product/subProduct.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router: Router = express.Router();

// Create a new sub-product
router.post(
  "/create",
  validate(subProductValidation.createSubProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  upload.single('imageFile'),
  createSubProduct
);

// Get all sub-products
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getAllSubProducts
);

// Get a sub-product by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getSubProductById
);

// Update a sub-product
router.put(
  "/:id",
  validate(subProductValidation.updateSubProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  updateSubProduct
);

// Soft delete a sub-product
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  deleteSubProduct
);

export default router;
