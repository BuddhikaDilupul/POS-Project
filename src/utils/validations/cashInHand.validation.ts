import Joi from "joi";

const cashInHandValidation = {
  creatCashInHand: {
    body: Joi.object({
      cash: Joi.number().required().messages({
        "any.required": "Cash is required",
        "string.empty": "Cash cannot be empty",
      }),
    }),
  },
  updateCashInHand: {
    body: Joi.object({
      cash: Joi.number().required().messages({
        "any.required": "Cash is required",
        "string.empty": "Cash cannot be empty",
      }),
    }),
  },
};

export default cashInHandValidation;
