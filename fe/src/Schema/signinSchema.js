import joi from 'joi';

export const siginInSchema = joi.object().keys({
    name:joi.string().min(3).required().label('username'),
    email:joi.string().email({tlds:false}).required().label('email'),
    password:joi.string().min(6).required().label('password')
})