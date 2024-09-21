import express, { Router } from "express";
import { validate } from "express-validation";
import productAddonValidation from "../../validations/productAddon.validation";
import {
  createProductAddon,
  getAllProductAddons,
  getProductAddonById,
  updateProductAddon,
  deleteProductAddon,
} from "../../controllers/product/productsaddons.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new product addon
router.post(
  "/create",
  validate(productAddonValidation.createProductAddon),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  createProductAddon
);

// Get all product addons
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getAllProductAddons
);

// Get a product addon by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  getProductAddonById
);

// Update a product addon
router.put(
  "/:id",
  validate(productAddonValidation.updateProductAddon),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  updateProductAddon
);

// Soft delete a product addon
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  deleteProductAddon
);

export default router;
