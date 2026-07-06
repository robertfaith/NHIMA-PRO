import { z } from 'zod';

const zambiaMobileRegex = /^(\+260|0)(9[5-7]|7[5-7])\d{7}$/;

// ── Create Patient Schema ─────────────────────────────────────────────────
export const createPatientSchema = z.object({
  // Personal
  first_name: z
    .string({ required_error: 'First name is required' })
    .min(2, 'First name must be at least 2 characters')
    .max(100),
  middle_name: z.string().max(100).optional().nullable(),
  last_name: z
    .string({ required_error: 'Last name is required' })
    .min(2, 'Last name must be at least 2 characters')
    .max(100),
  date_of_birth: z
    .string({ required_error: 'Date of birth is required' })
    .refine((val) => {
      const date = new Date(val);
      const now  = new Date();
      return !isNaN(date.getTime()) && date < now;
    }, 'Date of birth must be a valid past date'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Gender is required',
  }),
  marital_status: z
    .enum(['single', 'married', 'divorced', 'widowed', 'separated'])
    .optional()
    .nullable(),
  nationality: z.string().max(100).default('Zambian'),
  religion: z.string().max(100).optional().nullable(),

  // Identification
  id_type: z
    .enum(['national_id', 'passport', 'drivers_license', 'birth_certificate', 'none'])
    .default('none'),
  id_number: z.string().max(100).optional().nullable(),

  // Contact
  phone_primary: z
    .string({ required_error: 'Primary phone number is required' })
    .regex(zambiaMobileRegex, 'Enter a valid Zambian mobile number (e.g. 0971234567)'),
  phone_secondary: z
    .string()
    .regex(zambiaMobileRegex, 'Enter a valid Zambian mobile number')
    .optional()
    .nullable()
    .or(z.literal('')),
  email: z.string().email('Enter a valid email address').optional().nullable().or(z.literal('')),

  // Address
  residential_address: z.string().max(500).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  province: z.string().max(100).default('Lusaka'),
  constituency: z.string().max(100).optional().nullable(),

  // Next of Kin
  next_of_kin_name: z
    .string({ required_error: 'Next of kin name is required' })
    .min(2, 'Next of kin name must be at least 2 characters')
    .max(200),
  next_of_kin_phone: z
    .string({ required_error: 'Next of kin phone is required' })
    .regex(zambiaMobileRegex, 'Enter a valid Zambian mobile number'),
  next_of_kin_relation: z.string().max(100).optional().nullable(),

  // Clinical
  blood_group: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'])
    .default('unknown'),
  allergies:           z.string().max(1000).optional().nullable(),
  chronic_conditions:  z.string().max(1000).optional().nullable(),
  current_medications: z.string().max(1000).optional().nullable(),

  // Admin
  registered_by: z.string().optional().nullable(),
  notes:         z.string().max(2000).optional().nullable(),
});

// ── Update Patient Schema (all fields optional) ────────────────────────────
export const updatePatientSchema = createPatientSchema.partial();

// ── Query Params Schema ────────────────────────────────────────────────────
export const patientQuerySchema = z.object({
  search: z.string().optional(),
  page:   z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit:  z.string().regex(/^\d+$/).transform(Number).default('20'),
  gender: z.enum(['male', 'female', 'other']).optional(),
});

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type PatientQueryInput  = z.infer<typeof patientQuerySchema>;