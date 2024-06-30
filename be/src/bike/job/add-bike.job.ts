import * as joi from 'joi';

export const addBikeSchema = joi.object({
  bName: joi.string().required(),
  bType: joi.string().required(),
  bPrice: joi.number().required(),
  available: joi.boolean().required(),
  bImage: joi.string().optional(),
});
