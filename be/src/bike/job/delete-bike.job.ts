import * as joi from 'joi';

export const deleteBikeSchema = joi.object({
  bId: joi.string().required()
});
