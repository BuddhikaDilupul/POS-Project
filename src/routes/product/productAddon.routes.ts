import express, { Router } from "express";
import { validate } from "express-validation";
import productAddonValidation from "../../validations/productAddon.validation";
import productAddOns from "../../controllers/product/productsaddons.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const router: Router = express.Router();

// Create a new product addon
router.post(
  "/create",
  upload.single('imageFile'),
  validate(productAddonValidation.createProductAddon),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  productAddOns.createProductAddon
);

// Get all product addons
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  productAddOns.getAllProductAddons
);

// Get a product addon by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  productAddOns.getProductAddonById
);

// Update a product addon
router.put(
  "/:id",
  validate(productAddonValidation.updateProductAddon),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  productAddOns.updateProductAddon
);

// Soft delete a product addon
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  productAddOns.deleteProductAddon
);

export default router;
