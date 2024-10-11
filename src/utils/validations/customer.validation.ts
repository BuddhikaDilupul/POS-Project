import Joi from 'joi';

const customerValidation = {
  createCustomer: {
    body: Joi.object({
      name: Joi.string().required(),
      contactNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    }),
  },
  updateCustomer: {
    body: Joi.object({
      name: Joi.string().required(),
      contactNumber: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    }),
  },
};

export default customerValidation;
