import express, { Router } from "express";
import userController from "../../controllers/user/user.controller";
import { validate } from "express-validation";
import userValidation from "../../validations/user.validation";
import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import { StaffRoles } from "../../types/type";

// Create a new router instance
const router: Router = express.Router();

// Sub routes with validation and controller handling
router.post(
  "/create",
  validate(userValidation.createUser),
  authenticate,
  authorize([StaffRoles.ADMIN]),
  userController.createUser
);
router.post(
  "/login",
  validate(userValidation.login),
  userController.login
);
router.put(
  "/password",
  validate(userValidation.passwordChange),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  userController.updatePassword
);
router.post(
  "/view-credentials",
  validate(userValidation.viewCredentials),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  userController.updatePassword
);
router.get(
  "/all",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  userController.getAllUser
);
router.put(
  "/:id",
  validate(userValidation.updateUser),
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.CASHIER]),
  userController.updateUserDetails
);
router.get(
  "/:id",
  authenticate,
  authorize([StaffRoles.ADMIN, StaffRoles.MANAGER, StaffRoles.ADMIN]),
  userController.getUserById
);

export default router;
