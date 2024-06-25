const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

/**
 * @module AuthRoutes
 * @description Routes for handling user authentication such as registration and login.
 */

/**
 * @route POST /api/auth/register
 * @description Register a new user.
 * @access Public
 * @param {string} firstName - First name of the user. Must not be empty.
 * @param {string} lastName - Last name of the user. Must not be empty.
 * @param {string} email - Email of the user. Must be a valid email address.
 * @param {string} password - Password of the user. Must be at least 6 characters long.
 * @returns {Object} 200 - User successfully registered with a JSON Web Token.
 * @returns {Object} 400 - Bad request due to validation errors.
 */
router.post(
    "/register",
    [
        check("firstName", "First name is required").not().isEmpty(),
        check("lastName", "Last name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
    ],
    authController.register
);


/**
 * @route POST /api/auth/login
 * @description Login an existing user.
 * @access Public
 * @param {string} email - Email of the user. Must be a valid email address.
 * @param {string} password - Password of the user. Must not be empty.
 * @returns {Object} 200 - User successfully logged in with a JSON Web Token.
 * @returns {Object} 400 - Bad request due to invalid credentials.
 */
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    authController.login
);

module.exports = router;