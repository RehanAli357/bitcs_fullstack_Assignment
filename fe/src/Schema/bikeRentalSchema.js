import joi from "joi";

export const bikeRentalSchema = joi.object().keys({
  bId: joi.string().label("bId"),
  bTime: joi.number().required().label("bTime"),
});
