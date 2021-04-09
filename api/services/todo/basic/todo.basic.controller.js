const handleApiError = require("../../../utils/ErrorHandler");
const User = require("../../auth/user.model");
const Todo = require("../todo.model")


exports.createTodo = async (req, res) => {
    try {
        const user = await User.findById(req.headers.userid)
        if (!user) return res.status(400).send("Invalid User Id")
        let todo = new Todo(req.body)
        await todo.save()
        user.todoListsId.push(todo._id)
        await user.save()
        res.status(200).send("Todo list successfully created")
    }
    catch (error) {
        handleApiError(res, error, "createTodo")
    }
}

exports.getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find()
        if (!todos) return res.status(200).send([]);
        res.status(200).send(todos)
    }
    catch (error) {
        handleApiError(res, error, "getAllTodos")
    }
}

exports.addItem = async (req, res) => {
    try {
        const todo = await Todo.findById(req.headers.todoid)
        if (!todo) return res.status(400).send("Invalid todo list id")
        todo.items.push(req.body)
        await todo.save()
        res.status(200).send("Item successfully added")
    }
    catch (error) {
        handleApiError(res, error, "addItem")
    }
}

exports.deleteItem = async (req, res) => {
    try {
        const todo = await Todo.findById(req.headers.todoid)
        if (!todo) return res.status(400).send("Invalid todo list id")
        var newList = []
        await Promise.all(
            todo.items.map(async item => {
                if (item._id != req.headers.itemid) newList.push(item)
            })
        );
        todo.items = newList
        await todo.save()
        res.status(200).send("Item successfully deleted")
    }
    catch (error) {
        handleApiError(res, error, "deleteItem")
    }
}

exports.markDone = async (req, res) => {
    try {
        const todo = await Todo.findById(req.headers.todoid)
        if (!todo) return res.status(400).send("Invalid todo list id")
        await Promise.all(
            todo.items.map(async item => {
                if (item._id == req.headers.itemid) item.itemStatus = "DONE"
            })
        );
        await todo.save()
        res.status(200).send("Item successfully done")
    }
    catch (error) {
        handleApiError(res, error, "markDone")
    }
}

exports.getAllUserTodos = async (req, res) => {
    try {
        const user = await User.findById(req.headers.userid)
        if (!user) return res.status(400).send("User does not exist")
        var userTodos = []
        for (listId of user.todoListsId) {
            userTodos.push(await Todo.findById(listId))
        }
        res.status(200).send(userTodos)
    }
    catch (error) {
        handleApiError(res, error, "getAllUserTodos")

    }
}

exports.addItemsParse = async (req, res) => {
    try {
        const todo = await Todo.findById(req.headers.todoid)
        if (!todo) return res.status(400).send("Invalid todo list id")
        var itemsString = req.body.text.split(/\r?\n/)
        for (item of itemsString) {
            if (item.charAt(1) == "]") {
                todo.items.push({
                    itemName: item.substring(2),
                    itemStatus: "PENDING"
                })
            }
            else {
                todo.items.push({
                    itemName: item.substring(3),
                    itemStatus: "DONE"
                })
            }
        }
        await todo.save()
        res.status(200).send("items added")
    }
    catch (error) {
        handleApiError(res, error, "addItemsParse")
    }
}