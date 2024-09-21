import Joi from "joi";
import { ProductStatus, Status } from "../types/type";

const productValidation = {
  createProduct: {
    body: Joi.object({
      recipeId: Joi.string().required(), // Must be a valid ObjectId
      categoryId: Joi.string().required(), // Must be a valid ObjectId
      description: Joi.string().required(),
      sellingPrice: Joi.number().greater(0).required(), // Must be a positive number
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
  updateProduct: {
    body: Joi.object({
      recipeId: Joi.string().optional(), // Optional ObjectId
      categoryId: Joi.string().optional(), // Optional ObjectId
      description: Joi.string().optional(),
      sellingPrice: Joi.number().greater(0).optional(), // Must be a positive number
      availabilityStatus: Joi.string().valid(...Object.values(ProductStatus)).optional(), // Optional availability status
    }),
  },
};

export default productValidation;
