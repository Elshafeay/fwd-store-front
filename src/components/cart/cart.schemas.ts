import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const createCartItemValidation: IValidationSchema = {
  body: Joi.object({
    product_id: Joi
      .number()
      .min(1)
      .required(),
    quantity: Joi
      .number()
      .min(1)
      .required(),
  }).required(),
};

export const deleteCartItemValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi
      .number()
      .min(1)
      .required(),
  }).required(),
};