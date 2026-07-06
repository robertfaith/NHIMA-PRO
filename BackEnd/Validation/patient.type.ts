// ── Enums ──────────────────────────────────────────────────────────────────
export type Gender         = 'male' | 'female' | 'other';
export type MaritalStatus  = 'single' | 'married' | 'divorced' | 'widowed' | 'separated';
export type IdType         = 'national_id' | 'passport' | 'drivers_license' | 'birth_certificate' | 'none';
export type BloodGroup     = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | 'unknown';

// ── Core Patient (as stored in DB) ────────────────────────────────────────
export interface Patient {
  id:                   string;
  patient_number:       string;

  // Personal
  first_name:           string;
  middle_name?:         string | null;
  last_name:            string;
  date_of_birth:        string;       // ISO date string
  gender:               Gender;
  marital_status?:      MaritalStatus | null;
  nationality:          string;
  religion?:            string | null;

  // Identification
  id_type:              IdType;
  id_number?:           string | null;

  // Contact
  phone_primary:        string;
  phone_secondary?:     string | null;
  email?:               string | null;

  // Address
  residential_address?: string | null;
  district?:            string | null;
  province:             string;
  constituency?:        string | null;

  // Next of Kin
  next_of_kin_name:     string;
  next_of_kin_phone:    string;
  next_of_kin_relation?: string | null;

  // Clinical
  blood_group:          BloodGroup;
  allergies?:           string | null;
  chronic_conditions?:  string | null;
  current_medications?: string | null;

  // Admin
  is_active:            boolean;
  registered_by?:       string | null;
  notes?:               string | null;

  created_at:           string;
  updated_at:           string;
}

// ── Create Patient DTO (what we receive from the form) ────────────────────
export type CreatePatientDTO = Omit<
  Patient,
  'id' | 'patient_number' | 'is_active' | 'created_at' | 'updated_at'
>;

// ── Update Patient DTO ────────────────────────────────────────────────────
export type UpdatePatientDTO = Partial<CreatePatientDTO>;

// ── Paginated Response ────────────────────────────────────────────────────
export interface PaginatedPatients {
  data:       Patient[];
  total:      number;
  page:       number;
  limit:      number;
  totalPages: number;
}

// ── API Response wrapper ──────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?:   T;
  errors?: string[];
}