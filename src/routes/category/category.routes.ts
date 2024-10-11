import express, { Router } from "express";
import { validate } from "express-validation";
import categoryValidation from "../../utils/validations/category.validation";
import categoryController from "../../controllers/category/category.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../utils/types/type";

const router: Router = express.Router();

// Create a new category
router.post(
  "/create",
  validate(categoryValidation.createCategory),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can create categories
  categoryController.createCategory
);

// Get all categories
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Viewing allowed for Admin, Manager, and Cashier
  categoryController.getCategories
);

// Get category by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Cashier can view
  categoryController.getCategoryById
);

// Update a category
router.put(
  "/:id",
  validate(categoryValidation.updateCategory),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update
  categoryController.updateCategory
);

// Soft delete a category (Set status to DELETED)
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]), // Only Admin can delete
  categoryController.deleteCategory
);

export default router;
