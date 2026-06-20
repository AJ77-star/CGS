const express = require('express');
const pool = require('../db');
const { counsellorRequired } = require('../middleware/auth');

const router = express.Router();

// Get bookings for the logged-in counsellor
router.get('/bookings', counsellorRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.id, b.student_id, s.fullname AS student_name, s.email AS student_email,
                    b.counsellor_name, b.session_date, b.session_time, b.mode, b.notes, b.created_at
             FROM bookings b
             JOIN students s ON s.id = b.student_id
             WHERE LOWER(b.counsellor_name) = LOWER($1)
             ORDER BY b.session_date DESC, b.session_time DESC`,
            [req.counsellor.fullname]
        );

        return res.status(200).json({ bookings: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

// Get quiz results for students booked with this counsellor
router.get('/progress', counsellorRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT q.id, q.student_id, s.fullname AS student_name, s.email AS student_email,
                    q.subjects, q.track, q.iq_score, q.recommendation, q.ai_explanation
             FROM quiz_results q
             JOIN students s ON s.id = q.student_id
             WHERE s.id IN (
                 SELECT DISTINCT b.student_id FROM bookings b
                 WHERE LOWER(b.counsellor_name) = LOWER($1)
             )
             ORDER BY q.id DESC`,
            [req.counsellor.fullname]
        );

        return res.status(200).json({ quizResults: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;