const UserSchema = require("./auth/authSchema");
const TodoSchema = require("./todo/todoSchema")


module.exports = Object.assign(
    {},
    UserSchema,
    TodoSchema
);