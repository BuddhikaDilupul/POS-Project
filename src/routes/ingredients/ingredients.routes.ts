import express, { Router } from "express";
import { validate } from "express-validation";
import ingredientValidation from "../../utils/validations/ingrediants.validation";
import {
  createIngredient,
  getAllIngredients,
  getIngredientById,
  updateIngredient,
  deleteIngredient,
} from "../../controllers/ingrediants/ingrediants.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../utils/types/type";

const router: Router = express.Router();

// Sub routes with validation and controller handling
router.post(
  "/create",
  validate(ingredientValidation.createIngredient),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can create ingredients
  createIngredient
);

router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Viewing is allowed for Chef too
  getAllIngredients
);

router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Chef can view
  getIngredientById
);

router.put(
  "/:id",
  validate(ingredientValidation.updateIngredient),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update
  updateIngredient
);

router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]), // Only Admin can delete
  deleteIngredient
);

export default router;
