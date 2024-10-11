import Joi from "joi";
import { ProductStatus, Status } from "../types/type";

const subProductValidation = {
  createSubProduct: {
    body: Joi.object({
      name: Joi.string().required(),
      inStockQuantity: Joi.number().greater(0).required(), // Must be a positive number
      purchasedCost: Joi.number().greater(0).required(), // Must be a positive number
      sellingPrice: Joi.number().greater(0).required(), // Must be a positive number
      status: Joi.string().valid(...Object.values(Status)).optional(), // Optional status
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
  updateSubProduct: {
    body: Joi.object({
      name: Joi.string().optional(),
      inStockQuantity: Joi.number().greater(0).optional(), // Must be a positive number
      purchasedCost: Joi.number().greater(0).optional(), // Must be a positive number
      sellingPrice: Joi.number().greater(0).optional(), // Must be a positive number
      status: Joi.string().valid(...Object.values(Status)).optional(), // Optional status
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
};

export default subProductValidation;
