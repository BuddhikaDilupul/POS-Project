import express, { Router } from "express";
import { validate } from "express-validation";
import orderValidation from "../../validations/order.validation";
import orderController from "../../controllers/order/order.controller";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

const router: Router = express.Router();

// Create a new order
router.post(
  "/create",
  validate(orderValidation.createOrder),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Only Admin, Manager, and Cashier can create orders
  orderController.createOrder
);

// Get all orders
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Cashier can view all orders
  orderController.getAllOrders
);

// Get order by ID
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]), // Admin, Manager, and Cashier can view individual orders
  orderController.getOrderById
);

// Update order status to PROCESSING
router.put(
  "/:id/processing",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update to processing
  orderController.updateOrderToProcessing
);

// Update order status to DELIVERED
router.put(
  "/:id/delivered",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can update to delivered
  orderController.updateOrderToDelivered
);

// Cancel an order (Only if status is PLACED)
router.delete(
  "/:id/cancel",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER]), // Only Admin and Manager can cancel orders
  orderController.cancelOrder
);

export default router;
