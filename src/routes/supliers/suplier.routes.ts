import express, { Router } from "express";
import { validate } from "express-validation";
import supplierValidation from "../../validations/supplier.validation";
import supplierController from "../../controllers/suplier/suplier.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new supplier
router.post(
  "/create",
  validate(supplierValidation.createSupplier),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can create suppliers
  supplierController.createSuplier
);

// Get all suppliers
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Viewing allowed for Admin, Manager, and Cashier
  supplierController.getAllSupliers
);

// Get supplier by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Cashier can view
  supplierController.getSuplierById
);

// Update a supplier
router.put(
  "/:id",
  validate(supplierValidation.updateSupplier),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update
  supplierController.updateSuplier
);

// Soft delete a supplier (Set status to DELETED)
router.delete(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN]), // Only Admin can delete
  supplierController.deleteSuplier
);

export default router;
