import Joi from "joi";

const addBikeSchema = Joi.object({
  bName: Joi.string().required().label("Bike Name"),
  bImage: Joi.string().optional().label("Bike Image"),
  bPrice: Joi.number().required().label("Bike Price"),
  bType: Joi.string().required().label("Bike Type"),
  available: Joi.boolean().required().label("Bike Availability"),
});

export default addBikeSchema;
