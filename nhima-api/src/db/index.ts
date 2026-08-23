import { Pool }       from 'pg'
import { drizzle }    from 'drizzle-orm/node-postgres'
import * as schema    from './schema'
import * as dotenv    from 'dotenv'
dotenv.config()

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env')
}

// Local Postgres — no SSL by default. If your local instance requires it,
// set ssl: { rejectUnauthorized: false } here or add ?sslmode=require to the URL.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const db = drizzle(pool, { schema })
export type DB  = typeof db
