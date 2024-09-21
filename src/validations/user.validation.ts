import Joi from 'joi';
import { EmploymentTypeStaff, Gender, StaffRoles } from '../types/type';

const userValidation = {
  createUser: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      password: Joi.string().min(8).required(), // Assuming a minimum length for password
      gender: Joi.string().valid(...Object.values(Gender)).required(), // Use Gender enum
      role: Joi.string().valid(...Object.values(StaffRoles)).required(), // Use StaffRoles enum
      address: Joi.string().optional(),
      contactNumber: Joi.string().required(), // Adjust pattern as needed
      joinedDate: Joi.date().optional(),
      // nic: Joi.string().length(10).required(), // Assuming NIC is exactly 10 characters; adjust length if different
      email: Joi.string().required(),
      employmentType: Joi.string().valid(...Object.values(EmploymentTypeStaff)).required(), // Use EmploymentType enum
    }),
  },
  updateUser: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      // dateOfBirth: Joi.date().optional(),
      gender: Joi.string().valid(...Object.values(Gender)).required(), // Use Gender enum
      address: Joi.string().optional(),
      contactNumber: Joi.string().required(), // Adjust pattern as needed
      // nic: Joi.string().length(10).optional(), // Assuming NIC is exactly 10 characters; adjust length if different
      // email: Joi.string().email().forbidden(),
      employmentType: Joi.string().valid(...Object.values(EmploymentTypeStaff)).required(), // Use EmploymentType enum
    }),
  },
  login: {
    body: Joi.object({
      password: Joi.string().min(8).required(),
      email: Joi.string().required(),
    }),
  },
  passwordChange: {
    body: Joi.object({
      currentPassword: Joi.string().min(8).required(),
      newPassword: Joi.string().min(8).required(),
    }),
  },
};

export default userValidation;
