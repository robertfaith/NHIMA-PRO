import {Pool} from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const dbPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.ABBank_db,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

dbPool.on("connect", () => {
    console.log("Connected to the database");
})

dbPool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});

export default dbPool;