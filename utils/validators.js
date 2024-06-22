// validators.js

const Joi = require('joi');

// Define Joi schema for account creation
const createAccountSchema = Joi.object({
    first_name: Joi.string().trim().required().min(2).max(50),
    last_name: Joi.string().trim().required().min(2).max(50),
    email: Joi.string().trim().required().email(),
    phone: Joi.string().trim().required().pattern(/^\d{10}$/), // Example pattern for a 10-digit phone number
    password: Joi.string().required().min(6),
    birthday: Joi.date().required().iso(),
});

// Define Joi schema for account update
const updateAccountSchema = Joi.object({
    first_name: Joi.string().trim().min(2).max(50),
    last_name: Joi.string().trim().min(2).max(50),
    email: Joi.string().trim().email(),
    phone: Joi.string().trim().pattern(/^\d{10}$/),
    birthday: Joi.date().iso(),
}).min(1);


// Function to validate account update request
function validateUpdateAccount(reqBody) {
    return updateAccountSchema.validate(reqBody, { abortEarly: false });
}

module.exports = {
    validateUpdateAccount,
    createAccountSchema
};
