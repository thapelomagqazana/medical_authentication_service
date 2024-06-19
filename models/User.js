/**
 * @module UserModel
 * @description This module defines the Mongoose schema and model for User.
 */
const mongoose = require("mongoose");


/**
 * @typedef {Object} UserSchema
 * @property {string} firstName - The first name of the user. This field is required.
 * @property {string} lastName - The last name of the user. This field is required.
 * @property {string} address - The address of the user. This field is optional.
 * @property {string} phone - The phone number of the user. This field is optional.
 * @property {string} email - The email address of the user. This field is required and must be unique.
 * @property {string} password - The password of the user. This field is required.
 * @property {string} bio - The bio of the user. This field is optional.
 * @property {string} avatar - The avatar of the user. This field is optional.
 */

/**
 * @description Mongoose schema for the User model.
 * @type {mongoose.Schema<UserSchema>}
 */
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Additional profile fields
    bio: { type: String },
    avatar: { type: String },
}, { timestamps: true });

/**
 * @description Mongoose model for the User schema.
 * @module UserModel
 * @type {mongoose.Model<mongoose.Document<UserSchema>>}
 */
module.exports = mongoose.model("User", userSchema);