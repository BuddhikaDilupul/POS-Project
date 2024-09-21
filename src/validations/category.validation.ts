import Joi from 'joi';

const categoryValidation = {
  createCategory: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
  updateCategory: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },
};

export default categoryValidation;