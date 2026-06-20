const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db');
require('dotenv').config();

// Register Route
router.post('/register', async (req, res) => {
    const { fullname, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await pool.query(
            'SELECT * FROM students WHERE email = $1', 
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: 'Email already registered!' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save student to database
        const newStudent = await pool.query(
            'INSERT INTO students (fullname, email, password) VALUES ($1, $2, $3) RETURNING *',
            [fullname, email, hashedPassword]
        );

        res.status(201).json({ message: 'Registration successful!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if student exists
        const student = await pool.query(
            'SELECT * FROM students WHERE email = $1',
            [email]
        );

        if (student.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, student.rows[0].password);

        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid email or password!' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: student.rows[0].id, email: student.rows[0].email, role: 'student' },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ 
            message: 'Login successful!',
            token,
            student: {
                id: student.rows[0].id,
                fullname: student.rows[0].fullname,
                email: student.rows[0].email
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error!' });
    }
});

module.exports = router;