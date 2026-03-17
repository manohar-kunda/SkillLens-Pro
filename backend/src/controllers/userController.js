const pool = require('../config/db');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT id, name, first_name, last_name, email, github_url, linkedin_url, profile_pic, role, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Get Profile Error:', error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        const { first_name, last_name, github_url, linkedin_url } = req.body;

        await pool.query(
            `UPDATE users 
             SET first_name = ?, last_name = ?, github_url = ?, linkedin_url = ?
             WHERE id = ?`,
            [first_name, last_name, github_url, linkedin_url, req.user.id]
        );

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Update Profile Error:', error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

// @desc    Update profile picture
// @route   PATCH /api/users/profile-pic
// @access  Private
const updateProfilePic = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const profilePicPath = `/uploads/profiles/${req.file.filename}`;

        await pool.query(
            'UPDATE users SET profile_pic = ? WHERE id = ?',
            [profilePicPath, req.user.id]
        );

        res.json({ 
            message: 'Profile picture updated successfully',
            profile_pic: profilePicPath
        });
    } catch (error) {
        console.error('Update Profile Pic Error:', error);
        res.status(500).json({ message: 'Server error while updating profile picture' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    updateProfilePic
};
