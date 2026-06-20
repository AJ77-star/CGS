const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const { adminRequired } = require('../middleware/auth');
require('dotenv').config();

router.post('/register', adminRequired, async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        const existingUser = await pool.query(
            'SELECT * FROM counsellors WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
            'INSERT INTO counsellors (fullname, email, password) VALUES ($1, $2, $3) RETURNING *',
            [fullname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const counsellor = await pool.query(
            'SELECT * FROM counsellors WHERE email = $1',
            [email]
        );

        if (counsellor.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const validPassword = await bcrypt.compare(password, counsellor.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        const token = jwt.sign(
            { id: counsellor.rows[0].id, fullname: counsellor.rows[0].fullname, email: counsellor.rows[0].email, role: 'counsellor' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({
            message: 'Login successful!',
            token,
            counsellor: {
                id: counsellor.rows[0].id,
                fullname: counsellor.rows[0].fullname,
                email: counsellor.rows[0].email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

router.get('/list', async (_req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, fullname FROM counsellors ORDER BY fullname ASC'
        );
        res.status(200).json({ counsellors: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;