import pool from '../config/db.js';

async function checkDB() {
  try {
    console.log('Attempting to connect to Postgres...');
    const client = await pool.connect();
    console.log('✓ Connected to Postgres');
    
    // check admin table exists
    const result = await client.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admin')"
    );
    if (result.rows[0].exists) {
      console.log('✓ admin table exists');
    } else {
      console.warn('⚠ admin table does NOT exist — create it first');
    }
    
    client.release();
    console.log('✓ All checks passed');
    process.exit(0);
  } catch (err) {
    console.error('✗ DB Error:', err.message);
    process.exit(1);
  }
}

checkDB();
