const SchemaValidator = require("../../../utils/middlewares/SchemaValidator");
const validateRequest = SchemaValidator(true);

module.exports = app => {
    const todo = require("./todo.basic.controller");

    app.post("/todo", validateRequest, todo.createTodo);

    app.put("/todo/add", validateRequest, todo.addItem);

    app.delete("/todo/delete", validateRequest, todo.deleteItem)

    app.get("/todo", validateRequest, todo.getAllTodos)

    app.put("/todo/done", validateRequest, todo.markDone)

    app.get("/todo/user", validateRequest, todo.getAllUserTodos)

    app.put("/todo/parse", validateRequest, todo.addItemsParse)

    app.get("/todo/id", validateRequest, todo.getTodoById)
}