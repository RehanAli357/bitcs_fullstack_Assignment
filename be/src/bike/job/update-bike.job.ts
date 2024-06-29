import * as Joi from 'joi';
import { addBikeSchema } from './add-bike.job';

export const updateBikeSchema = addBikeSchema.append({
  bId: Joi.string().required(), 
});
