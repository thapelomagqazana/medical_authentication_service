const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const { check } = require("express-validator");
const profileController = require("../controllers/profileController");

/**
 * @module ProfileRoutes
 * @description Routes for handling user profile operations such as fetching and updating profiles.
 */

/**
 * @route GET /api/profile/me
 * @description Fetches the profile of the logged-in user.
 * @access Private
 * @param {Object} req - Express request object containing user information from the auth middleware.
 * @param {Object} res - Express response object containing user profile information.
 * @returns {Object} 200 - User profile information.
 * @returns {Object} 404 - User not found.
 * @returns {Object} 500 - Server error.
 */
router.get("/me", 
    authMiddleware, 
    profileController.getProfile);

/**
 * @route POST /api/profile/me
 * @description Updates the profile of the logged-in user.
 * @access Private
 * @param {Object} req - Express request object containing user information and profile data in the body.
 * @param {Object} res - Express response object containing updated user profile information.
 * @returns {Object} 200 - Updated user profile information.
 * @returns {Object} 400 - Bad request due to validation errors.
 * @returns {Object} 404 - User not found.
 * @returns {Object} 500 - Server error.
 */
router.post("/me", 
    authMiddleware, 
    [
        check("firstName", "First name is required").not().isEmpty(),
        check("lastName", "Last name is required").not().isEmpty(),
    ], 
    profileController.updateProfile);

module.exports = router;