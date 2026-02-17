import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Not Authorized, no token" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await pool.query("SELECT * FROM Super_Admin WHERE id = $1", [decoded.id]);
        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Not Authorized, user not found" });
        }
        req.user = user.rows[0];
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Not Authorized, invalid token" });
    }
};
