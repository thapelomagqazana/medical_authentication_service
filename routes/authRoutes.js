const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authController = require("../controllers/authController");

// POST api/auth/register
// Public route
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

// POST api/auth/login
// Public route
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    authController.login
);

module.exports = router;