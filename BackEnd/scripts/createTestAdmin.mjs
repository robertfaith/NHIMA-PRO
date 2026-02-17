import bcrypt from 'bcrypt';
import pool from '../config/db.js';

async function createTestAdmin() {
  try {
    const email = 'test@example.com';
    const password = 'testpass123';
    
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hash:', hashedPassword);
    
    console.log('Connecting to DB...');
    const client = await pool.connect();
    
    // Check if admin already exists
    const existing = await client.query('SELECT * FROM admin WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      console.log(`✓ Admin ${email} already exists, skipping insert`);
      client.release();
      process.exit(0);
    }
    
    // Insert test admin
    console.log(`Inserting test admin (${email})...`);
    const result = await client.query(
      'INSERT INTO admin (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );
    
    console.log('✓ Test admin created:', result.rows[0]);
    console.log(`\nLogin with:\n  Email: ${email}\n  Password: ${password}`);
    
    client.release();
    process.exit(0);
  } catch (err) {
    console.error('✗ Error:', err.message);
    console.error(err);
    process.exit(1);
  }
}

createTestAdmin();
