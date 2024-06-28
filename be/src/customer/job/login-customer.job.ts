import * as joi from "joi";

export const loginCustomerSchema = joi.object({
    password:joi.string().min(6).required(),
    email:joi.string().email().required()
})