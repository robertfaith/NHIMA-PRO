import pool from './db';

const migrate = async (): Promise<void> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('🚀 Running migrations...');

    // ── Enable UUID extension ──────────────────────────────────────────────
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // ── ENUM types ─────────────────────────────────────────────────────────
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE gender_type AS ENUM ('male', 'female', 'other');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE marital_status_type AS ENUM (
          'single', 'married', 'divorced', 'widowed', 'separated'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE id_type AS ENUM (
          'national_id', 'passport', 'drivers_license', 'birth_certificate', 'none'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        CREATE TYPE blood_group_type AS ENUM (
          'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'
        );
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    // ── PATIENTS table ─────────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS patients (
        -- Primary key
        id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

        -- Auto-generated Patient ID (e.g. KDH-2026-000001)
        patient_number      VARCHAR(20) UNIQUE NOT NULL,

        -- Personal Information
        first_name          VARCHAR(100) NOT NULL,
        middle_name         VARCHAR(100),
        last_name           VARCHAR(100) NOT NULL,
        date_of_birth       DATE NOT NULL,
        gender              gender_type NOT NULL,
        marital_status      marital_status_type,
        nationality         VARCHAR(100) DEFAULT 'Zambian',
        religion            VARCHAR(100),

        -- Identification
        id_type             id_type DEFAULT 'none',
        id_number           VARCHAR(100),

        -- Contact Information
        phone_primary       VARCHAR(20) NOT NULL,
        phone_secondary     VARCHAR(20),
        email               VARCHAR(150),

        -- Address
        residential_address TEXT,
        district            VARCHAR(100),
        province            VARCHAR(100) DEFAULT 'Lusaka',
        constituency        VARCHAR(100),

        -- Next of Kin
        next_of_kin_name    VARCHAR(200) NOT NULL,
        next_of_kin_phone   VARCHAR(20) NOT NULL,
        next_of_kin_relation VARCHAR(100),

        -- Clinical Baseline
        blood_group         blood_group_type DEFAULT 'unknown',
        allergies           TEXT,
        chronic_conditions  TEXT,
        current_medications TEXT,

        -- Administrative
        is_active           BOOLEAN DEFAULT TRUE,
        registered_by       VARCHAR(200),  -- Auth0 user ID of registering staff
        notes               TEXT,

        -- Timestamps
        created_at          TIMESTAMPTZ DEFAULT NOW(),
        updated_at          TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // ── AUTO-INCREMENT patient number function ─────────────────────────────
    await client.query(`
      CREATE SEQUENCE IF NOT EXISTS patient_number_seq START 1;
    `);

    await client.query(`
      CREATE OR REPLACE FUNCTION generate_patient_number()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.patient_number := 'KDH-' || TO_CHAR(NOW(), 'YYYY') || '-' ||
          LPAD(nextval('patient_number_seq')::TEXT, 6, '0');
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS set_patient_number ON patients;
      CREATE TRIGGER set_patient_number
        BEFORE INSERT ON patients
        FOR EACH ROW
        WHEN (NEW.patient_number IS NULL OR NEW.patient_number = '')
        EXECUTE FUNCTION generate_patient_number();
    `);

    // ── AUTO-UPDATE updated_at trigger ────────────────────────────────────
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
      CREATE TRIGGER update_patients_updated_at
        BEFORE UPDATE ON patients
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // ── INDEXES for fast search ────────────────────────────────────────────
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_patients_patient_number ON patients(patient_number);
      CREATE INDEX IF NOT EXISTS idx_patients_last_name     ON patients(last_name);
      CREATE INDEX IF NOT EXISTS idx_patients_phone_primary ON patients(phone_primary);
      CREATE INDEX IF NOT EXISTS idx_patients_id_number     ON patients(id_number);
      CREATE INDEX IF NOT EXISTS idx_patients_created_at    ON patients(created_at DESC);
    `);

    await client.query('COMMIT');
    console.log('✅ Migrations completed successfully.');
    console.log('   → Table: patients');
    console.log('   → Triggers: patient_number, updated_at');
    console.log('   → Indexes: patient_number, last_name, phone, id_number');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Migration failed — rolled back:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate().catch((err) => {
  console.error(err);
  process.exit(1);
});