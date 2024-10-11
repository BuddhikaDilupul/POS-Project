import Joi from 'joi';
import { PaymentStatus, OrderStatus } from '../types/type';

const orderValidation = {
  createOrder: {
    body: Joi.object({
      customerId: Joi.string().required(),
      cashierId: Joi.string().required(),
      orderedProducts: Joi.array().items(
        Joi.object({
          productId: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      ).required(),
      orderedAddons: Joi.array().items(
        Joi.object({
          addonId: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      ).optional(),
      orderedSubProducts: Joi.array().items(
        Joi.object({
          subProductId: Joi.string().required(),
          quantity: Joi.number().required(),
        })
      ).optional(),
      totalAmount: Joi.number().required(),
      paymentMethod: Joi.string().required(),
    }),
  },
  updateOrderStatus: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
  cancelOrder: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};

export default orderValidation;
