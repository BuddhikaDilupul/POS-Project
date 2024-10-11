import Joi from "joi";
import { Unit, Status } from "../types/type";

const recipeValidation = {
  createRecipe: {
    body: Joi.object({
      name: Joi.string().required(),
      ingredients: Joi.array()
        .items(
          Joi.object({
            ingredientId: Joi.string().required(), // ObjectId of ingredient
            quantityType: Joi.string().valid(...Object.values(Unit)).required(), // Unit enum validation
            quantity: Joi.number().required(), // Unit enum validation
          })
        )
        .required(),
    }),
  },
  updateRecipe: {
    body: Joi.object({
      name: Joi.string().optional(),
      ingredients: Joi.array()
        .items(
          Joi.object({
            ingredientId: Joi.string().required(), // ObjectId of ingredient
            quantityType: Joi.string().valid(...Object.values(Unit)).required(), // Unit enum validation
            quantity: Joi.number().required(), // Unit enum validation
          })
        )
        .optional(),
    }),
  },
};

export default recipeValidation;
