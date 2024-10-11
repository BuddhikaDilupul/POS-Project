import Joi from "joi";
import { Status, ProductStatus } from "../types/type";

const productAddonValidation = {
  createProductAddon: {
    body: Joi.object({
      stockId: Joi.string().required(), // Must be a valid ObjectId
      ingredientsId: Joi.string().required(), // Must be a valid ObjectId
      sellingQuantity: Joi.number().greater(0).required(), // Must be a positive number
      sellingPrice: Joi.number().greater(0).required(), // Must be a positive number
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
  updateProductAddon: {
    body: Joi.object({
      stockId: Joi.string().optional(), // Optional ObjectId
      ingredientsId: Joi.string().optional(), // Optional ObjectId
      sellingQuantity: Joi.number().greater(0).optional(), // Must be a positive number
      sellingPrice: Joi.number().greater(0).optional(), // Must be a positive number
      status: Joi.string().valid(...Object.values(Status)).optional(), // Optional status
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
};

export default productAddonValidation;
