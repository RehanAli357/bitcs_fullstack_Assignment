import * as joi from 'joi';

export const updateCustomerSchema = joi.object({
  oldPassword: joi.string().min(6).required(),
  newPassword: joi.string().min(6).required(),
});
