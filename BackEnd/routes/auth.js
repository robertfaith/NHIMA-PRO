import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from '../config/db.js';
import { protect } from "../middleware/auth.js";


const router = express.Router();

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
//Register User
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    const userExists = await pool.query("SELECT * FROM Super_Admin WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await pool.query(
        "INSERT INTO Super_Admin (Username, email, password) VALUES ($1, $2, $3) RETURNING id, Username, email",
        [username, email, hashedPassword]
    );
    const token = generateToken(newUser.rows[0].id);
    res.cookie("token", token, cookieOptions);
    return res.status(201).json({ user: newUser.rows[0], token });
})

//Login User
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide all required fields" });
    }
    const user = await pool.query("SELECT * FROM Super_Admin WHERE email = $1", [email]);
    if (user.rows.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = generateToken(user.rows[0].id);
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({ user: user.rows[0], token });
});

//me
router.get("/me", protect, async (req, res) => {
    res.json(req.user)
    //return infor of the logged in user from protect middleware
})

//Logout User
router.post("/logout", (req, res) => {
    res.cookie("token", "", { ...cookieOptions, maxAge: 1 });
    return res.status(200).json({ message: "Logged out successfully" });
});

export default router;