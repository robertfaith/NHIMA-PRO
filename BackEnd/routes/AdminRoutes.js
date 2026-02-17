import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../config/db.js';

const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ loginStatus: false, Error: 'Email and password required' });

        const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(401).json({ loginStatus: false, Error: 'Invalid credentials' });

        const user = result.rows[0];
        let passwordMatches = false;
        try {
            passwordMatches = await bcrypt.compare(password, user.password);
        } catch (e) {
            passwordMatches = false;
        }
        // fallback for unhashed passwords
        if (!passwordMatches) passwordMatches = password === user.password;

        if (!passwordMatches) return res.status(401).json({ loginStatus: false, Error: 'Invalid credentials' });

        const token = generateToken(user.id || user.email);
        res.cookie('token', token, cookieOptions);
        return res.json({ loginStatus: true, user: { id: user.id, email: user.email } });
    } catch (err) {
        console.error('Admin login error', err);
        return res.status(500).json({ loginStatus: false, Error: 'Server error' });
    }
});

// Admin logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', { ...cookieOptions, maxAge: 1 });
    return res.json({ logoutStatus: true });
});

export default router;
