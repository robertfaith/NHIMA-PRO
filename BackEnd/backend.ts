import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.ts";
import adminRoutes from "./routes/users.ts";
import pool from "./config/db.js";

dotenv.config();

// Startup env summary (do not print secrets)
const envSummary = {
  PORT: process.env.PORT || 1999,
  CLIENT_URL: !!process.env.CLIENT_URL,
  DB_USER: !!process.env.DB_USER,
  DB_HOST: !!process.env.DB_HOST,
  DB_NAME: !!process.env.ABBank_db,
  DB_PASSWORD: !!process.env.DB_PASSWORD,
  DB_PORT: !!process.env.DB_PORT,
};
console.log('Backend starting with env presence:', envSummary);

const app = express();
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", authRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 1999;

async function startServer() {
  try {
    // verify database connection if credentials present
    const requiredDb = ['DB_USER', 'DB_HOST', 'ABBank_db', 'DB_PASSWORD', 'DB_PORT'];
    const missing = requiredDb.filter((k) => !process.env[k]);
    if (missing.length === 0) {
      const client = await pool.connect();
      client.release();
      console.log('Database pool connected');
    } else {
      console.warn(`DB credentials missing (${missing.join(',')}) — skipping DB connection test`);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
  }
}

startServer();
