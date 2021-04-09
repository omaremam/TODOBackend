const Joi = require("@hapi/joi");

const listCreationSchema = Joi.object({
    listName: Joi.string().required(),
})

const addItemSchema = Joi.object({
    itemName: Joi.string().required(),
    itemStatus: Joi.string().required()
})

const addItemParse = Joi.object({
    text: Joi.string().required()
})

module.exports = {
    "/todo": listCreationSchema,
    "/todo/add": addItemSchema,
    "/todo/parse": addItemParse
}