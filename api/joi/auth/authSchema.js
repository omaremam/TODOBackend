const Joi = require("@hapi/joi");

const userCreationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    userType: Joi.string().required()
})

const userSignIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})



module.exports = {
    "/user/register": userCreationSchema,
    "/user/signin": userSignIn
}