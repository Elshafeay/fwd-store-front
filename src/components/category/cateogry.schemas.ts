import Joi from 'joi';
import { IValidationSchema } from '../../utils/joi.interfaces';

export const getCategoryValidation: IValidationSchema = {
  params: Joi.object({
    id: Joi
      .number()
      .required(),
  }).required(),
};

export const createCategoryValidation: IValidationSchema = {
  body: Joi.object({
    name: Joi
      .string()
      .min(3)
      .max(255)
      .required(),
  }).required(),
};