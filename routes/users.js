const express = require('express');
const Jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
    adminValidate,
    Admin,
    validateLogin
} = require('../models/admin');


const router = express.Router();

//signup
router.post('/admin/signup', async (req, res) => {
    try {

        const {
            error
        } = adminValidate(req.body);
        if (error) {
            return res.status(400).send("Invalid inputs");
        }
        let user = await Admin.findOne({
            email: req.body.email
        });
        if (user) {
            return res.status(400).send("User already exists");
        }
        user = new Admin(req.body);
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        user.password = await bcrypt.hash(user.password, salt);
        const data = await user.save();
        const token = Jwt.sign({
            _id: data._id,
            isAdmin: data.isAdmin
        }, "jwtPrivateKey");
        return res.status(200).json({
            message: "signup successful",
            token
        });
    } catch (err) {
        return res.status(400).send("An unknown error occured");
    }
});

//login
router.post('/admin/login', async (req, res) => {
    try {
        const {
            error
        } = validateLogin(req.body);
        if (error) {
            return res.status(400).send("Invalid details");
        }
        const user = await Admin.findOne({
            email: req.body.email
        });
        if (!user) {
            return res.status(404).send("Incorrect email or password..check again!");
        }
        const passwordVerify = await bcrypt.compare(req.body.password, user.password);
        if (!passwordVerify) {
            return res.status(404).send("Incorrect email or password..check again!");
        }
        const token = Jwt.sign({
            _id: user._id,
            isAdmin: user.isAdmin
        }, "jwtPrivateKey");

        //send token in header
        return res.header('x-auth-header', token).status(200).send("login successful");
    } catch (err) {
        console.log(err);
    }
});



module.exports = router;