import express, { Router } from "express";
import customerController from "../../controllers/customer/customer.controller";
import { validate } from "express-validation";
import customerValidation from "../../utils/validations/customer.validation";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../utils/types/type";

// Create a new router instance
const router: Router = express.Router();

// Sub routes with validation and controller handling
router.post(
  "/create",
  validate(customerValidation.createCustomer), // Validate request body
  authenticate, // Middleware for authentication
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only certain roles can create customers
  customerController.createCustomer // Controller function to handle the request
);

router.get(
  "/all",
  authenticate, // Ensure the user is authenticated
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can view all customers
  customerController.getAllCustomers // Controller to fetch all customers
);

router.get(
  "/:id",
  authenticate, // Authentication middleware
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Role-based access control
  customerController.getCustomerById // Fetch customer by ID
);

router.put(
  "/:id",
  validate(customerValidation.updateCustomer), // Validate the update request
  authenticate, // Authentication middleware
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Role-based access control
  customerController.updateCustomer // Controller for updating customer
);

router.delete(
  "/:id",
  authenticate, // Authentication middleware
  authorize([StaffRoles.ADMIN]), // Only Admin can delete a customer
  customerController.deleteCustomer // Controller for deleting customer
);

export default router;
