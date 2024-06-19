const jwt = require("jsonwebtoken");
const User = require("../models/User");
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
const authMiddleware = async (req, res, next) => {
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

/**
 * @function authorize
 * @description Middleware function to authorize user based on roles.
 * @param {...string} roles - Roles that are allowed to access the route.
 * @returns {Function} Middleware function.
 */
const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user.id);

            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Unauthorized' });
            }

            next();
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ msg: 'Server error' });
        }
    };
};

module.exports = {
    authMiddleware,
    authorize,
};