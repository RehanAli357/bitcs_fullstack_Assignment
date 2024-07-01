import joi from 'joi';

export const logInSchema = joi.object().keys({
    email:joi.string().email({tlds:false}).required().label('email'),
    password:joi.string().min(6).required().label('password')
})