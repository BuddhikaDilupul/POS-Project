import express, { Router } from "express";
import { validate } from "express-validation";
import subProductValidation from "../../utils/validations/subProduct.validation";
import subProductController from "../../controllers/product/subProduct.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../utils/types/type";
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router: Router = express.Router();

// Create a new sub-product
router.post(
  "/create",
  upload.single('imageFile'),
  validate(subProductValidation.createSubProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  subProductController.createSubProduct
);

// Get all sub-products
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  subProductController.getAllSubProducts
);

// Get a sub-product by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  subProductController.getSubProductById
);

// Update a sub-product
router.put(
  "/:id",
  validate(subProductValidation.updateSubProduct),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  subProductController.updateSubProduct
);

// Soft delete a sub-product
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  subProductController.deleteSubProduct
);

export default router;
