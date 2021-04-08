const Joi = require("@hapi/joi");

const userCreationSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    nationality: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    age: Joi.string().required(),
    gender: Joi.string().required(),
    userType: Joi.string().required()
})

const userSignIn = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const resetPassword = Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
})

const changePassword = Joi.object({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(6).required()
})


module.exports = {
    "/user/register": userCreationSchema,
    "/user/signin": userSignIn,
    "/user/resetpassword": resetPassword,
    "/user/changepassword": changePassword
}