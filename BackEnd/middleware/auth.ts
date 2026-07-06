import jwt from "jsonwebtoken";
import pool from "../config/db";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
    user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not Authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number };

        const user = await pool.query(
            "SELECT * FROM Super_Admin WHERE id = $1",
            [decoded.id]
        );

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
