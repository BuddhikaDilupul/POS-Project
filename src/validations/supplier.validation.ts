import Joi from 'joi';
import { UserStatus } from 'types/type';

const supplierValidation = {
  createSupplier: {
    body: Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Supplier name is required.',
      }),
      contactNumber: Joi.string().required().messages({
        'string.empty': 'Contact number is required.',
      }),
      address: Joi.string().required().messages({
        'string.empty': 'Address is required.',
      }),
    }),
  },
  updateSupplier: {
    body: Joi.object({
      name: Joi.string().required().messages({
        'string.empty': 'Supplier name is required.',
      }),
      contactNumber: Joi.string().required().messages({
        'string.empty': 'Contact number is required.',
      }),
      status: Joi.string().valid(...Object.values(UserStatus)).required().messages({
        'string.empty': 'Contact number is required.',
      }), // Optional status
      address: Joi.string().required().messages({
        'string.empty': 'Address is required.',
      }),
    }),
  },
};

export default supplierValidation;
