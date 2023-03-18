import Joi from "joi";

export const createNewUserSchema = {
    bodySchema: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    })
}

export const userLoginSchema = {
    bodySchema: Joi.object().keys({
        email: Joi.string().required(),
        password: Joi.string().required()
    })
}

export const createNewWalletSchema = {
    bodySchema: Joi.object().keys({
        currency: Joi.string().required()
    })
}

export const depositIntoWalletSchema = {
    bodySchema: Joi.object().keys({
        amount: Joi.number().required(),
        currency: Joi.string().required()
    })
}

export const transerSchema = {
    bodySchema: Joi.object().keys({
        tranferAmount: Joi.number().required(),
        destinationId: Joi.string().required(),
    })
}