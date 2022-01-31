import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';
import { OrderStatuses } from './order.enums';

export const getOrderValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi
      .number()
      .min(1)
      .required(),
  }).required(),
};

export const updateOrderValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi
      .number()
      .min(1)
      .required(),
  }).required(),
  body: Joi.object({
    status: Joi
      .string()
      .valid(OrderStatuses.completed, OrderStatuses.canceled)
      .required(),
  }).required(),
};