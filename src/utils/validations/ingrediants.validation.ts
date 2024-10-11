import Joi from "joi";
import { Unit, Status } from "../types/type";

const ingredientValidation = {
  createIngredient: {
    body: Joi.object({
      name: Joi.string().required(),
      unit: Joi.string().valid(...Object.values(Unit)).required(),
    }),
  },
  updateIngredient: {
    body: Joi.object({
      name: Joi.string().optional(),
      unit: Joi.string().valid(...Object.values(Unit)).optional(),
    }),
  },
};

export default ingredientValidation;
