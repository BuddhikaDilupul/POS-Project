import Joi from "joi";
import { ProductStatus, Unit } from "../types/type";

// Validation for creating a stock
export const createStockValidation = {
  body: Joi.object({
    name: Joi.string().required(),
    ingredientId: Joi.string().required(), // Should be a valid ObjectId
    inStockCount: Joi.number().positive().required(),
    availabilityStatus: Joi.string()
      .valid(...Object.values(ProductStatus))
      .required(),
    status: Joi.string()
      .valid("ACTIVE", "INACTIVE", "DELETED")
      .default("ACTIVE"),
    unitPrice: Joi.number().positive().required(),
    unitType: Joi.string()
      .valid(...Object.values(Unit)) // Valid values for unitType
      .required(),
    expireDate: Joi.date().required(),
  }),
};

// Validation for updating a stock
export const updateStockValidation = {
  body: Joi.object({
    name: Joi.string(),
    ingredientId: Joi.string(), // Should be a valid ObjectId
    inStockCount: Joi.number().positive(),
    availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)),
    status: Joi.string().valid("ACTIVE", "INACTIVE", "DELETED"),
    unitPrice: Joi.number().positive(),
    unitType: Joi.string().valid(...Object.values(Unit)),
    expireDate: Joi.date(),
  }),
};
