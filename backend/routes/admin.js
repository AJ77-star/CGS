const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { adminRequired } = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body || {};

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Admin login successful',
            token,
            admin: {
                id: admin.id,
                fullname: admin.fullname,
                email: admin.email
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/overview', adminRequired, async (req, res) => {
    try {
        const [students, bookings, quizResults] = await Promise.all([
            pool.query('SELECT COUNT(*)::int AS count FROM students'),
            pool.query('SELECT COUNT(*)::int AS count FROM bookings'),
            pool.query('SELECT COUNT(*)::int AS count FROM quiz_results')
        ]);

        return res.status(200).json({
            stats: {
                students: students.rows[0].count,
                bookings: bookings.rows[0].count,
                quizResults: quizResults.rows[0].count
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/students', adminRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT s.id, s.fullname, s.email,
                    (SELECT COUNT(*)::int FROM quiz_results q WHERE q.student_id = s.id) AS quiz_count,
                    (SELECT COUNT(*)::int FROM bookings b WHERE b.student_id = s.id) AS booking_count
             FROM students s
             ORDER BY s.id DESC`
        );

        return res.status(200).json({ students: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/bookings', adminRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.id, b.student_id, s.fullname AS student_name, s.email AS student_email,
                    b.counsellor_name, b.session_date, b.session_time, b.mode, b.notes, b.created_at
             FROM bookings b
             JOIN students s ON s.id = b.student_id
             ORDER BY b.session_date DESC, b.session_time DESC, b.created_at DESC`
        );

        return res.status(200).json({ bookings: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/quiz-results', adminRequired, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT q.id, q.student_id, s.fullname AS student_name, s.email AS student_email,
                    q.subjects, q.track, q.environment, q.activity, q.skill, q.iq_score,
                    q.recommendation, q.ai_explanation
             FROM quiz_results q
             JOIN students s ON s.id = q.student_id
             ORDER BY q.id DESC`
        );

        return res.status(200).json({ quizResults: result.rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;