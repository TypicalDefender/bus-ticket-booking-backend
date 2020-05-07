const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Joi = require('joi');

const userSchema = new mongoose.Schema({
    name: String,
    sex: String,
    age: Number,
    phone: { type: String, unique: true },
    email: { type: String, unique: true },
});

userSchema.plugin(uniqueValidator);

function userValidation(user){
    const schema = {
        name: Joi.string().trim().min(5).max(100).required(),
        sex: Joi.string().trim().max(1).required(),
        age: Joi.number().min(18).required(),
        phone: Joi.string().trim().max(10).required(),
        email: Joi.string().trim().email().required(),
    }
    return Joi.validate(user, schema);
}

exports.userValidate = userValidation;
exports.User = mongoose.model('user', userSchema); 
