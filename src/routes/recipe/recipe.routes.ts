import express, { Router } from "express";
import { validate } from "express-validation";
import recipeValidation from "../../validations/recipe.validation";
import {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../../controllers/recipe/recipe.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new recipe
router.post(
  "/create",
  validate(recipeValidation.createRecipe),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can create recipes
  createRecipe
);

// Get all recipes (Excluding deleted ones)
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Viewing allowed for Chef too
  getAllRecipes
);

// Get recipe by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Chef can view
  getRecipeById
);

// Update a recipe
router.put(
  "/:id",
  validate(recipeValidation.updateRecipe),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update
  updateRecipe
);

// Soft delete a recipe (Set status to DELETED)
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]), // Only Admin can delete
  deleteRecipe
);

export default router;
