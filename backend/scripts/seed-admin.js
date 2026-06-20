const bcrypt = require('bcrypt');
const pool = require('../db');
require('dotenv').config();

async function seedAdmin() {
    const fullname = 'System Administrator';
    const email = 'admin@careerguide.com';
    const password = 'admin321';

    try {
        const existing = await pool.query('SELECT id FROM admins WHERE email = $1', [email]);

        if (existing.rows.length > 0) {
            console.log('Admin account already exists:', email);
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO admins (fullname, email, password) VALUES ($1, $2, $3)',
            [fullname, email, hashedPassword]
        );

        console.log('Default admin created successfully.');
        console.log('Email:', email);
        console.log('Password:', password);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed admin:', error.message);
        process.exit(1);
    }
}

seedAdmin();
