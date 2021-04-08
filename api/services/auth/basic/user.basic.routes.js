const SchemaValidator = require("../../../utils/middlewares/SchemaValidator");
const validateRequest = SchemaValidator(true);

module.exports = app => {
    const user = require("./user.basic.controller");

    app.post("/user/register", validateRequest, user.signUp);

    app.post("/user/signin", validateRequest, user.signIn)

    app.get("/user",validateRequest,user.getAllUsers)

    app.put("/user/requestpassword",validateRequest,user.requestPasswordResetCode)

    app.put("/user/resetpassword",validateRequest,user.resetPassword)

    app.get("/user/confirm/:userId",validateRequest,user.approveUser)

    app.put("/user/confirm/resend",validateRequest,user.resendConfirmationEmail);

    app.put("/user/changepassword",validateRequest,user.changePassword);
}