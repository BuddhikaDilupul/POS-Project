import Joi from 'joi';
import { EmploymentTypeStaff, Gender, StaffRoles, Status } from '../types/type';

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
      email: Joi.string().required(),
      username: Joi.string().required(),
      employmentType: Joi.string().valid(...Object.values(EmploymentTypeStaff)).required(), // Use EmploymentType enum
    }),
  },
  updateUser: {
    body: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      gender: Joi.string().valid(...Object.values(Gender)).required(), // Use Gender enum
      status: Joi.string().valid(...Object.values(Status)).required(), // Use Status enum
      address: Joi.string().optional(),
      contactNumber: Joi.string().required(), // Adjust pattern as needed
      email: Joi.string().email().required(),
      employmentType: Joi.string().valid(...Object.values(EmploymentTypeStaff)).required(), // Use EmploymentType enum
    }),
  },
  login: {
    body: Joi.object({
      password: Joi.string().min(8).required(),
      username: Joi.string().required(),
    }),
  },
  passwordChange: {
    body: Joi.object({
      currentPassword: Joi.string().min(8).required(),
      newPassword: Joi.string().min(8).required(),
    }),
  },
  updateCredentials: {
    body: Joi.object({
      id: Joi.string().required(),
      newPassword: Joi.string().min(8).required(),
      superUserPassword: Joi.string().min(8).required(),
    }),
  },
};

export default userValidation;
