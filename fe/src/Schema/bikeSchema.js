import Joi from "joi";

const bikeSchema = Joi.object({
  bName: Joi.string().required().label("Bike Name"),
  bImage: Joi.string().optional().label("Bike Image"),
  bPrice: Joi.number().required().label("Bike Price"),
  bType: Joi.string().required().label("Bike Type"),
  bId: Joi.string().optional().label("Bike ID"),
  available: Joi.boolean().required().label("Bike Availability"),
});

export default bikeSchema;
