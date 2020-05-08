const mongoose = require('mongoose');
const Jwt = require('jsonwebtoken');
const Joi = require('joi');

const adminSchema = new mongoose.Schema({
    name : { type : String, required : true },
    email : {type : String, required : true },
    password: {type : String, required:true},
    isAdmin : {type : Boolean}
});

function adminValidate(admin){
    const schema = {
        name : Joi.string().min(5).max(50).required(),
        email : Joi.string().min(5).max(50).required().email(),
        password : Joi.string().min(5).max(50).required(),
        isAdmin : Joi.boolean().required()
    }
    return Joi.validate(admin, schema);
}
function validateLogin(admin){
    const schema = {
        email : Joi.string().min(5).max(50).required().email(),
        password : Joi.string().min(5).max(50).required()
    }
    return Joi.validate(admin, schema);
}

exports.Admin = mongoose.model('admin', adminSchema);
exports.adminValidate = adminValidate;
exports.validateLogin = validateLogin;