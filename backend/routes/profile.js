const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Get current user's profile
router.get('/', authRequired, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, fullname, email FROM students WHERE id = $1',
            [req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ student: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

// Update current user's profile (fullname and/or password)
router.put('/', authRequired, async (req, res) => {
    const { fullname, password } = req.body || {};

    if (!fullname && !password) {
        return res.status(400).json({ message: 'Nothing to update' });
    }

    try {
        if (fullname) {
            await pool.query('UPDATE students SET fullname = $1 WHERE id = $2', [
                fullname,
                req.user.id
            ]);
        }

        if (password) {
            if (typeof password !== 'string' || password.length < 6) {
                return res
                    .status(400)
                    .json({ message: 'Password must be at least 6 characters!' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            await pool.query('UPDATE students SET password = $1 WHERE id = $2', [
                hashedPassword,
                req.user.id
            ]);
        }

        const updated = await pool.query(
            'SELECT id, fullname, email FROM students WHERE id = $1',
            [req.user.id]
        );

        return res.status(200).json({
            message: 'Profile updated',
            student: updated.rows[0]
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;
