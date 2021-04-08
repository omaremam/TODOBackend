const SchemaValidator = require("../../../utils/middlewares/SchemaValidator");
const validateRequest = SchemaValidator(true);

module.exports = app => {
    const user = require("./user.basic.controller");

    app.post("/user/register", validateRequest, user.signUp);

    app.post("/user/signin", validateRequest, user.signIn)

    app.get("/user", validateRequest, user.getAllUsers)

    app.get("/user/confirm/:userId", validateRequest, user.approveUser)

    app.delete("/user/delete", validateRequest, user.deleteUser)

    app.put("/user/edit", validateRequest, user.editUser)
}