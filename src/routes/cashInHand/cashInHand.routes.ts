import express, { Router } from "express";
import { validate } from "express-validation";
import cashInHandValidation from "../../validations/cashInHand.validation";
import cashInHandController from "../../controllers/cashInHand/cashInHand.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new cash entry
router.post(
  "/create",
  validate(cashInHandValidation.creatCashInHand),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  cashInHandController.createCashInHand
);

// Get all cash entries
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  cashInHandController.getAllCashInHand
);

// Get cash entry by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  cashInHandController.getCashInHandById
);

// Update a cash entry
router.put(
  "/:id",
  validate(cashInHandValidation.updateCashInHand),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]),
  cashInHandController.updateCashInHand
);

// Soft delete a cash entry
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]),
  cashInHandController.deleteCashInHand
);

export default router;
