const handleApiError = require("../../../utils/ErrorHandler");
const User = require("../user.model");
const bcrypt = require('bcryptjs');
const path = require("path");
var nodemailer = require("nodemailer");


exports.signUp = async (req, res) => {
    try {
        let user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.isApproved = false;
        await user.save();
        sendConfirmationMail(req.body.email, `http://3.16.119.225:3000/user/confirm/${user._id}`, user.name, false)
        res.status(200).send({ message: "User Successfully registered" })
    }
    catch (error) {
        handleApiError(res, error, "signUp")
    }
}

exports.resendConfirmationEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.headers.email });
        if (!user) return res.status(400).send({ error: "User not found" })
        if (user.isApproved) return res.status(400).send({ error: "Account already verified" })
        sendConfirmationMail(req.headers.email, `http://3.16.119.225:3000/user/confirm/${user._id}`, user.name, true);
        return res.status(200).send({ message: "Email confirmation successfully resent" })
    }
    catch (error) {
        handleApiError(res, error, "resendConfirmationEmail")
    }
}

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send({ error: "User not found" });
        const salt = await bcrypt.genSalt(10);
        const validpassword = await bcrypt.compare(req.body.oldPassword, user.password);
        if (!validpassword) return res.status(400).send({ error: "Password is not correct" });
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save()
        return res.status(200).send({ message: "Password successfully changed" });
    }
    catch (error) {
        handleApiError(res, error, "changePassword")
    }
}

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("User not found")
        user.isApproved = true;
        await user.save()
        return res.status(200).sendFile(path.resolve(__dirname + "../../../../utils/confirmemail.html"))
    }
    catch (error) {
        handleApiError(res, error, "approveUser")
    }
}

exports.signIn = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password');
        if (!user.isApproved) return res.status(400).send("User not confirmed yet")
        const validpassword = await bcrypt.compare(req.body.password, user.password);
        if (!validpassword) return res.status(400).send('Invalid email or password');
        res.status(200).send(user);
    }
    catch (error) {
        handleApiError(res, error, "signIn")
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password")
            .select("-resetPasswordCode");
        if (!users) return res.status(200).send([]);
        res.status(200).send(users);
    }
    catch (error) {
        handleApiError(res, error, "getAllUsers");
    }
}

exports.requestPasswordResetCode = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.headers.email });
        if (!user) return res.status(400).send({ error: "User does not exist" });
        user.resetPasswordCode = Math.random().toString(36).substring(7);
        sendEmail(req.headers.email, user.resetPasswordCode, user.name);
        await user.save();
        res.status(200).send({ message: "Successfully sent email for password reset" })
    }
    catch (error) {
        handleApiError(res, error, "requestPasswordResetCode");
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send({ error: "User not found" });
        if (user.resetPasswordCode != req.body.code) return res.status(400).send({ error: "Password reset code is not correct" });
        user.resetPasswordCode = undefined;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.newPassword, salt);
        await user.save()
        res.status(200).send({ message: "Password reset successful" })
    }
    catch (error) {
        handleApiError(res, error, "resetPassword")
    }
}


function sendEmail(email, code, name) {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sharmelshiikh@gmail.com',
            pass: 'sharm2020'
        }
    });

    const teamMailOption = {
        from: 'sharmelshiikh@gmail.com', // sender address
        to: [
            email
        ], // list of receivers
        subject: `A password reset request is sent`, // Subject line
        html: `<h2 style="color:  rgb(51, 116, 255);"><strong>Hello ${name}!</strong></h2>
        <p>We received a request to reset your password.</p>
        <p><strong>You need to enter the following code:</strong></p>
        <h2 style="color:cornflowerblue;"><strong>${code}</strong></h2>
        <h5><p>If you did not request a new password please ignore this email.</p></h5>
        <h4><p style="color:rgb(85,95,107);">Best regards,</p></h4>
        <h4><p style="color:rgb(85,95,107);">Sharm El-Sheikh Team</p></h4>`
    };

    transporter.sendMail(teamMailOption, function (err, info) {
        if (err) console.log(err);
    });
}

function sendConfirmationMail(email, url, name, isResent) {
    var html;
    if (isResent) {
        html = `<html>
        <h2 style="color:  rgb(51, 116, 255);"><strong>Hello ${name}!</strong></h2>
        <h3><p style="color: rgb(51, 116, 255);">Your registeration is almost done!</p></h3>
        <p>You recently requested another confirmation mail to be sent, Press the below button to verify your email address to complete creating your account:</p>
            
            <style>
              .button {
                background-color: #3374FF;
                border-radius: 15px;
                width: 175px;
                color: white;
                padding: 10px 25px;
                text-align: center;
                text-decoration: none;
                display: block;
                font-size: 16px;
                margin-right: auto;
                margin-left: auto;
                cursor: pointer;
              }
            </style>
            <a href="${url}" class="button">Verify my account</a>
        <h4><p style="color:rgb(0,0,0);">We require a verified email address so you can take the full advantage of all the app features, and also you can safely recover your account in the future.</p></h4>
        
        <h4><p style="color:rgb(0,0,0);">If you did not recently attempt to create a new account with this email address. you can safely disregard this email.</p></h4>
        <h4><p style="color:rgb(85,95,107);">Thanks for helping us ensure your new account is secure,</p>
        <h4><p style="color:rgb(85,95,107);">Sharm El-Sheikh Team</p></h4></html>
        </h4>`
    }
    else {
        html = `<html>
        <h2 style="color:  rgb(51, 116, 255);"><strong>Hello ${name}!</strong></h2>
        <h3><p style="color: rgb(51, 116, 255);">Your registeration is almost done!</p></h3>
        <p>Press the below button to verify your email address to complete creating your account:</p>
            
            <style>
              .button {
                background-color: #3374FF;
                border-radius: 15px;
                width: 175px;
                color: white;
                padding: 10px 25px;
                text-align: center;
                text-decoration: none;
                display: block;
                font-size: 16px;
                margin-right: auto;
                margin-left: auto;
                cursor: pointer;
              }
            </style>
            <a href="${url}" class="button">Verify my account</a>
        <h4><p style="color:rgb(0,0,0);">We require a verified email address so you can take the full advantage of all the app features, and also you can safely recover your account in the future.</p></h4>
        
        <h4><p style="color:rgb(0,0,0);">If you did not recently attempt to create a new account with this email address. you can safely disregard this email.</p></h4>
        <h4><p style="color:rgb(85,95,107);">Thanks for helping us ensure your new account is secure,</p>
        <h4><p style="color:rgb(85,95,107);">Sharm El-Sheikh Team</p></h4></html>
        </h4>`}
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sharmelshiikh@gmail.com',
            pass: 'sharm2020'
        }
    });

    const teamMailOption = {
        from: 'sharmelshiikh@gmail.com', // sender address
        to: [
            email
        ], // list of receivers
        subject: `Account confirmation Sharm ElSheikh`, // Subject line
        html: html
    };

    transporter.sendMail(teamMailOption, function (err, info) {
        if (err) console.log(err);
    });
}