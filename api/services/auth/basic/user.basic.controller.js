const handleApiError = require("../../../utils/ErrorHandler");
const User = require("../user.model");
const bcrypt = require('bcryptjs');
var nodemailer = require("nodemailer");


exports.signUp = async (req, res) => {
    try {
        let user = new User(req.body);
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.isApproved = false;
        user.lastAccessDate = new Date()
        await user.save();
        sendConfirmationMail(req.body.email, `http://localhost:5000/user/confirm/${user._id}`, user.name, false)
        res.status(200).send({ message: "User Successfully registered" })
    }
    catch (error) {
        handleApiError(res, error, "signUp")
    }
}

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("User not found")
        user.isApproved = true;
        await user.save()
        return res.status(200).send("Successfully approved")
    }
    catch (error) {
        handleApiError(res, error, "approveUser")
    }
}

exports.signIn = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Invalid email or password');
        if (!user.isApproved) return res.status(409).send("User not confirmed yet")
        const validpassword = await bcrypt.compare(req.body.password, user.password);
        if (!validpassword) return res.status(400).send('Invalid email or password');
        user.lastAccessDate = new Date()
        await user.save()
        res.status(200).send(user);
    }
    catch (error) {
        handleApiError(res, error, "signIn")
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        if (!users) return res.status(200).send([]);
        res.status(200).send(users);
    }
    catch (error) {
        handleApiError(res, error, "getAllUsers");
    }
}

exports.getAllRegularUsers = async (req, res) => {
    try {
        const users = await User.find({ userType: "REGULAR" }).select("-password");
        if (!users) return res.status(200).send([]);
        res.status(200).send(users);
    }
    catch (error) {
        handleApiError(res, error, "getAllRegularUsers");
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const admin = await User.findById(req.headers.adminid)
        if (!admin) return res.status(401).send("Invalid admin")
        if (admin.userType != "ADMIN") return res.status(401).send("Invalid admin credentials")
        await User.findByIdAndDelete(req.headers.id)
        res.status(200).send("User successfully deleted")
    }
    catch (error) {
        handleApiError(res, error, "deleteUser");
    }
}

exports.editUser = async (req, res) => {
    try {
        const admin = await User.findById(req.headers.adminid)
        if (!admin) return res.status(401).send("Invalid admin")
        if (admin.userType != "ADMIN") return res.status(401).send("Invalid admin credentials")
        await User.findByIdAndUpdate(req.body.id, req.body)
        res.status(200).send("User successfully updated")
    }
    catch (error) {
        handleApiError(res, error, "editUser");
    }
}


function sendConfirmationMail(email, url, name, isResent) {
    var html;

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
        <h4><p style="color:rgb(85,95,107);">Thank you</p></h4></html>
        </h4>`
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'ghanditest06@gmail.com',
            pass: 'test12test34'
        }
    });

    const teamMailOption = {
        from: 'ghanditest06@gmail.com', // sender address
        to: [
            email
        ], // list of receivers
        subject: `Account confirmation`, // Subject line
        html: html
    };

    transporter.sendMail(teamMailOption, function (err, info) {
        if (err) console.log(err);
    });
}