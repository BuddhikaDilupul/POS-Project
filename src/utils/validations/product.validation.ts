import Joi from "joi";
import { ProductStatus, Status } from "../types/type";
import mongoose from "mongoose";

const productValidation = {
  createProduct: {
    body: Joi.object({
      recipeId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid'); // Custom error message for invalid ObjectId
          }
          return value; // If valid, return the value
        })
        .required()
        .messages({
          'any.required': 'Recipe ID is required.',
          'any.invalid': 'Recipe ID must be a valid ObjectId.',
        }),
      categoryId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error('any.invalid');
          }
          return value;
        })
        .required()
        .messages({
          'any.required': 'Category ID is required.',
          'any.invalid': 'Category ID must be a valid ObjectId.',
        }),
      description: Joi.string()
        .required()
        .messages({
          'any.required': 'Description is required.',
        }),
      sellingPrice: Joi.number()
        .greater(0)
        .required()
        .messages({
          'any.required': 'Selling price is required.',
          'number.greater': 'Selling price must be greater than 0.',
        }),
      availabilityStatus: Joi.string()
        .valid(...Object.values(ProductStatus))
        .optional()
        .messages({
          'any.only': 'Availability status must be one of the allowed values.',
        }),
    }),
  },
  updateProduct: {
    body: Joi.object({
      recipeId: Joi.string()
        .optional()
        .messages({
          'any.invalid': 'Recipe ID must be a valid ObjectId.',
        }),
      categoryId: Joi.string()
        .optional()
        .messages({
          'any.invalid': 'Category ID must be a valid ObjectId.',
        }),
      status: Joi.string()
        .valid(...Object.values(Status))
        .optional()
        .messages({
          'any.only': 'Status must be one of the allowed values.',
        }),
      description: Joi.string()
        .optional()
        .messages({
          'string.base': 'Description must be a string.',
        }),
      sellingPrice: Joi.number()
        .greater(0)
        .optional()
        .messages({
          'number.greater': 'Selling price must be greater than 0.',
        }),
      availabilityStatus: Joi.string()
        .valid(...Object.values(ProductStatus))
        .optional()
        .messages({
          'any.only': 'Availability status must be one of the allowed values.',
        }),
    }),
  },
};

export default productValidation;
