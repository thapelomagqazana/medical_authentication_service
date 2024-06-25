const { validationResult } = require("express-validator");
const User = require("../models/User");

/**
 * @module ProfileController
 * @description Controller for handling user profile operations such as fetching and updating profiles.
 */

/**
 * @function getProfile
 * @description Fetches the profile of the logged-in user.
 * @param {Object} req - Express request object containing user information.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

/**
 * @function updateProfile
 * @description Updates the profile of the logged-in user.
 * @param {Object} req - Express request object containing user information and profile data in the body.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 */
exports.updateProfile = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { firstName, lastName, address, phone, bio, avatar } = req.body;

    // Build profile object
    const profileFields = {};
    if (firstName) profileFields.firstName = firstName;
    if (lastName) profileFields.lastName = lastName;
    if (address) profileFields.address = address;
    if (phone) profileFields.phone = phone;
    if (bio) profileFields.bio = bio;
    if (avatar) profileFields.avatar = avatar;

    try {
        let user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Update profile
        user = await User.findByIdAndUpdate(
            req.user.id,
            { $set: profileFields },
            { new: true }
        );
        
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};