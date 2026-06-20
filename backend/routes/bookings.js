const express = require('express');
const pool = require('../db');
const { authRequired } = require('../middleware/auth');

const router = express.Router();

// Create a booking for the logged-in student
router.post('/', authRequired, async (req, res) => {
    const { counsellor_name, session_date, session_time, mode, notes } = req.body || {};

    if (!session_date || !session_time || !mode) {
        return res
            .status(400)
            .json({ message: 'session_date, session_time, and mode are required' });
    }

    if (!['in-person', 'online'].includes(mode)) {
        return res.status(400).json({ message: "mode must be 'in-person' or 'online'" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO bookings
            (student_id, counsellor_name, session_date, session_time, mode, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, student_id, counsellor_name, session_date, session_time, mode, notes, created_at`,
            [
                req.user.id,
                counsellor_name || null,
                session_date,
                session_time,
                mode,
                notes || null
            ]
        );

        return res.status(201).json({ booking: result.rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

// List bookings for the logged-in student
router.get('/', authRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, student_id, counsellor_name, session_date, session_time, mode, notes, created_at
             FROM bookings
             WHERE student_id = $1
             ORDER BY session_date DESC, session_time DESC, created_at DESC`,
            [req.user.id]
        );

        return res.status(200).json({ bookings: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;
