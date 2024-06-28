import * as joi from "joi";

export const loginUserSchema = joi.object({
    password:joi.string().min(6).required(),
    email:joi.string().email().required()
})