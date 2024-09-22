import express, { Router } from "express";
import { validate } from "express-validation";
import { createStockValidation, updateStockValidation } from "../../validations/stock.validation";
import stockController from "../../controllers/stocks/stocks.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new stock
router.post(
  "/create",
  validate(createStockValidation),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  stockController.createStock
);

// Get all stocks
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  stockController.getAllStocks
);

// Get stock by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  stockController.getStockById
);

// Update a stock
router.put(
  "/:id",
  validate(updateStockValidation),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  stockController.updateStock
);

// Soft delete a stock
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  stockController.deleteStock
);

export default router;
