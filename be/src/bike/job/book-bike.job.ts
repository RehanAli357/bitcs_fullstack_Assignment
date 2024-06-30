import * as joi from 'joi';
import { deleteBikeSchema } from './delete-bike.job';

export const bookBikeSchema = deleteBikeSchema.append({
  bTime: joi.number().required(),
});
