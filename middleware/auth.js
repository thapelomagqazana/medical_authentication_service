const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * @module AuthMiddleware
 * @description Middleware to authenticate requests using JSON Web Tokens (JWT).
 */

/**
 * @function authenticateToken
 * @description Middleware function to authenticate user by verifying the JWT token.
 * @param {Object} req - Express request object containing headers.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header("x-auth-token");

    // Check if no token
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid" });
    }
};