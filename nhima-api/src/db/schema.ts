import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export const genderEnum          = pgEnum('gender',           ['Male', 'Female'])
export const employmentTypeEnum  = pgEnum('employment_type',  ['Formal', 'Informal', 'Self-employed'])
export const relationshipEnum    = pgEnum('relationship',     ['Spouse', 'Parent', 'Child', 'Sibling', 'Guardian', 'Other'])
export const userRoleEnum        = pgEnum('user_role',        ['ADMIN', 'EMPLOYER', 'AGENT', 'MEMBER'])
export const accountStatusEnum   = pgEnum('account_status',  ['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'])
export const claimStatusEnum     = pgEnum('claim_status',    ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PAID'])
export const claimTypeEnum       = pgEnum('claim_type',      ['Outpatient', 'Inpatient', 'Dental', 'Maternity', 'Surgical', 'Optical', 'Other'])
export const contributionStatusEnum = pgEnum('contribution_status', ['PAID', 'PENDING', 'OVERDUE', 'WAIVED'])
export const complianceStatusEnum   = pgEnum('compliance_status',   ['COMPLIANT', 'NON_COMPLIANT', 'UNDER_REVIEW'])
export const agentTypeEnum       = pgEnum('agent_type',      ['FIELD', 'OFFICE', 'SUPERVISOR'])
export const provinceEnum        = pgEnum('province',        [
  'Lusaka', 'Copperbelt', 'Central', 'Eastern', 'Western',
  'Northern', 'Luapula', 'North-Western', 'Southern', 'Muchinga',
])

// ─────────────────────────────────────────────────────────────────────────────
// ADMINS
// ─────────────────────────────────────────────────────────────────────────────

export const adminsTable = pgTable('admins', {
  id:              uuid('id').primaryKey().defaultRandom(),
  nhima_id:        varchar('nhima_id',    { length: 20  }).unique().notNull(),
  firstname:       varchar('firstname',   { length: 100 }).notNull(),
  lastname:        varchar('lastname',    { length: 100 }).notNull(),
  email:           varchar('email',       { length: 150 }).unique().notNull(),
  phone:           varchar('phone',       { length: 20  }),
  password:        varchar('password',    { length: 255 }).notNull(),
  role:            userRoleEnum('role').default('ADMIN').notNull(),
  status:          accountStatusEnum('status').default('ACTIVE').notNull(),

  // Permissions
  can_approve_members:      boolean('can_approve_members').default(true),
  can_process_claims:       boolean('can_process_claims').default(true),
  can_manage_employers:     boolean('can_manage_employers').default(true),
  can_manage_agents:        boolean('can_manage_agents').default(true),
  can_view_reports:         boolean('can_view_reports').default(true),
  can_manage_facilities:    boolean('can_manage_facilities').default(true),
  can_manage_users:         boolean('can_manage_users').default(false), // super-admin only

  // OTP / session
  otp_code:        varchar('otp_code',       { length: 6   }),
  otp_expires_at:  timestamp('otp_expires_at'),
  last_login:      timestamp('last_login'),

  created_at:      timestamp('created_at').defaultNow(),
  updated_at:      timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// EMPLOYERS
// ─────────────────────────────────────────────────────────────────────────────

export const employersTable = pgTable('employers', {
  id:                uuid('id').primaryKey().defaultRandom(),
  nhima_id:          varchar('nhima_id',        { length: 20  }).unique().notNull(),

  // Company info
  company_name:      varchar('company_name',    { length: 255 }).notNull(),
  tpin:              varchar('tpin',            { length: 20  }).unique().notNull(),
  business_reg_no:   varchar('business_reg_no', { length: 50  }).unique(),
  industry:          varchar('industry',        { length: 100 }),
  company_size:      varchar('company_size',    { length: 20  }), // e.g. "1-10", "11-50"

  // Contact person
  contact_firstname: varchar('contact_firstname', { length: 100 }).notNull(),
  contact_lastname:  varchar('contact_lastname',  { length: 100 }).notNull(),
  contact_phone:     varchar('contact_phone',     { length: 20  }).notNull(),
  contact_position:  varchar('contact_position',  { length: 100 }),

  // Account
  email:             varchar('email',    { length: 150 }).unique().notNull(),
  phone:             varchar('phone',    { length: 20  }),
  password:          varchar('password', { length: 255 }).notNull(),
  status:            accountStatusEnum('status').default('PENDING').notNull(),
  compliance_status: complianceStatusEnum('compliance_status').default('UNDER_REVIEW'),

  // Address
  address:           varchar('address',  { length: 300 }),
  province:          provinceEnum('province'),
  district:          varchar('district', { length: 100 }),
  postal_address:    varchar('postal_address', { length: 100 }),

  // Documents
  reg_certificate_url: varchar('reg_certificate_url', { length: 500 }),
  tpin_certificate_url: varchar('tpin_certificate_url', { length: 500 }),

  // OTP / session
  otp_code:          varchar('otp_code',      { length: 6 }),
  otp_expires_at:    timestamp('otp_expires_at'),
  is_verified:       boolean('is_verified').default(false),
  last_login:        timestamp('last_login'),

  // Meta
  registered_by:     uuid('registered_by'),  // agent or admin id
  approved_by:       uuid('approved_by'),    // admin id
  approved_at:       timestamp('approved_at'),

  created_at:        timestamp('created_at').defaultNow(),
  updated_at:        timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// AGENTS
// ─────────────────────────────────────────────────────────────────────────────

export const agentsTable = pgTable('agents', {
  id:               uuid('id').primaryKey().defaultRandom(),
  nhima_id:         varchar('nhima_id',       { length: 20  }).unique().notNull(),
  agent_number:     varchar('agent_number',   { length: 20  }).unique().notNull(),

  // Personal info
  firstname:        varchar('firstname',      { length: 100 }).notNull(),
  lastname:         varchar('lastname',       { length: 100 }).notNull(),
  nrc:              varchar('nrc',            { length: 20  }).unique().notNull(),
  dob:              date('dob'),
  gender:           genderEnum('gender'),
  phone:            varchar('phone',          { length: 20  }).notNull(),
  email:            varchar('email',          { length: 150 }).unique().notNull(),
  password:         varchar('password',       { length: 255 }).notNull(),
  status:           accountStatusEnum('status').default('PENDING').notNull(),

  // Agent details
  agent_type:       agentTypeEnum('agent_type').default('FIELD'),
  licence_number:   varchar('licence_number', { length: 50  }).unique(),
  licence_expiry:   date('licence_expiry'),
  branch:           varchar('branch',         { length: 100 }),
  province:         provinceEnum('province'),
  district:         varchar('district',       { length: 100 }),
  supervisor_id:    uuid('supervisor_id'),    // self-reference to agents.id

  // Performance
  registrations_target: integer('registrations_target').default(50),

  // Documents
  nrc_front_url:    varchar('nrc_front_url',  { length: 500 }),
  nrc_back_url:     varchar('nrc_back_url',   { length: 500 }),
  certificate_url:  varchar('certificate_url', { length: 500 }),

  // OTP / session
  otp_code:         varchar('otp_code',       { length: 6 }),
  otp_expires_at:   timestamp('otp_expires_at'),
  is_verified:      boolean('is_verified').default(false),
  last_login:       timestamp('last_login'),

  // Meta
  approved_by:      uuid('approved_by'),  // admin id
  approved_at:      timestamp('approved_at'),

  created_at:       timestamp('created_at').defaultNow(),
  updated_at:       timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// MEMBERS
// ─────────────────────────────────────────────────────────────────────────────

export const membersTable = pgTable('members', {
  id:               uuid('id').primaryKey().defaultRandom(),
  nhima_id:         varchar('nhima_id',       { length: 20  }).unique().notNull(),

  // Personal info
  firstname:        varchar('firstname',      { length: 100 }).notNull(),
  lastname:         varchar('lastname',       { length: 100 }).notNull(),
  nrc:              varchar('nrc',            { length: 20  }).unique().notNull(),
  dob:              date('dob').notNull(),
  gender:           genderEnum('gender').notNull(),
  phone:            varchar('phone',          { length: 20  }).notNull(),
  email:            varchar('email',          { length: 150 }).unique(),
  address:          varchar('address',        { length: 300 }),
  province:         provinceEnum('province'),
  district:         varchar('district',       { length: 100 }),

  // Account
  password:         varchar('password',       { length: 255 }).notNull(),
  status:           accountStatusEnum('status').default('PENDING').notNull(),

  // Employment info
  employer_id:      uuid('employer_id'),      // FK → employers.id
  employment_type:  employmentTypeEnum('employment_type'),
  employment_date:  date('employment_date'),
  occupation:       varchar('occupation',     { length: 100 }),

  // Next of kin
  next_of_kin_name:         varchar('next_of_kin_name',         { length: 200 }),
  next_of_kin_phone:        varchar('next_of_kin_phone',        { length: 20  }),
  next_of_kin_relationship: relationshipEnum('next_of_kin_relationship'),
  next_of_kin_nrc:          varchar('next_of_kin_nrc',          { length: 20  }),

  // Documents
  nrc_front_url:    varchar('nrc_front_url',  { length: 500 }),
  nrc_back_url:     varchar('nrc_back_url',   { length: 500 }),
  passport_photo_url: varchar('passport_photo_url', { length: 500 }),

  // OTP / verification
  otp_code:         varchar('otp_code',       { length: 6 }),
  otp_expires_at:   timestamp('otp_expires_at'),
  is_verified:      boolean('is_verified').default(false),
  last_login:       timestamp('last_login'),

  // Meta
  registered_by:    uuid('registered_by'),   // agent id
  approved_by:      uuid('approved_by'),     // admin id
  approved_at:      timestamp('approved_at'),

  created_at:       timestamp('created_at').defaultNow(),
  updated_at:       timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// BENEFICIARIES  (linked to a member)
// ─────────────────────────────────────────────────────────────────────────────

export const beneficiariesTable = pgTable('beneficiaries', {
  id:           uuid('id').primaryKey().defaultRandom(),
  member_id:    uuid('member_id').notNull(),   // FK → members.id
  nhima_id:     varchar('nhima_id', { length: 20 }),  // member's nhima_id

  firstname:    varchar('firstname',    { length: 100 }).notNull(),
  lastname:     varchar('lastname',     { length: 100 }).notNull(),
  nrc:          varchar('nrc',          { length: 20  }),
  dob:          date('dob').notNull(),
  gender:       genderEnum('gender'),
  phone:        varchar('phone',        { length: 20  }),
  relationship: relationshipEnum('relationship').notNull(),

  // Documents
  nrc_front_url: varchar('nrc_front_url', { length: 500 }),
  nrc_back_url:  varchar('nrc_back_url',  { length: 500 }),

  is_active:    boolean('is_active').default(true),

  created_at:   timestamp('created_at').defaultNow(),
  updated_at:   timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// CONTRIBUTIONS
// ─────────────────────────────────────────────────────────────────────────────

export const contributionsTable = pgTable('contributions', {
  id:            uuid('id').primaryKey().defaultRandom(),
  member_id:     uuid('member_id').notNull(),    // FK → members.id
  employer_id:   uuid('employer_id'),            // FK → employers.id
  reference_no:  varchar('reference_no', { length: 50 }).unique().notNull(),

  amount:        varchar('amount',       { length: 20  }).notNull(), // store as string e.g. "3200.00"
  currency:      varchar('currency',     { length: 5   }).default('ZMW'),
  period_month:  varchar('period_month', { length: 7   }).notNull(), // e.g. "2026-06"
  status:        contributionStatusEnum('status').default('PENDING'),

  paid_at:       timestamp('paid_at'),
  payment_method: varchar('payment_method', { length: 50 }), // e.g. "Bank Transfer", "Mobile Money"
  receipt_url:   varchar('receipt_url',  { length: 500 }),

  recorded_by:   uuid('recorded_by'),   // admin or agent id
  notes:         text('notes'),

  created_at:    timestamp('created_at').defaultNow(),
  updated_at:    timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// CLAIMS
// ─────────────────────────────────────────────────────────────────────────────

export const claimsTable = pgTable('claims', {
  id:               uuid('id').primaryKey().defaultRandom(),
  claim_number:     varchar('claim_number',  { length: 30 }).unique().notNull(),
  member_id:        uuid('member_id').notNull(),         // FK → members.id
  beneficiary_id:   uuid('beneficiary_id'),              // FK → beneficiaries.id (if on behalf)

  claim_type:       claimTypeEnum('claim_type').notNull(),
  status:           claimStatusEnum('status').default('SUBMITTED'),

  // Facility / provider
  facility_name:    varchar('facility_name',  { length: 255 }),
  facility_address: varchar('facility_address', { length: 300 }),
  treatment_date:   date('treatment_date').notNull(),
  diagnosis:        text('diagnosis'),
  treatment_notes:  text('treatment_notes'),

  // Financials
  amount_claimed:   varchar('amount_claimed',  { length: 20 }).notNull(),
  amount_approved:  varchar('amount_approved', { length: 20 }),
  amount_paid:      varchar('amount_paid',     { length: 20 }),
  currency:         varchar('currency',        { length: 5  }).default('ZMW'),

  // Documents
  invoice_url:      varchar('invoice_url',     { length: 500 }),
  prescription_url: varchar('prescription_url', { length: 500 }),
  discharge_url:    varchar('discharge_url',   { length: 500 }),
  supporting_docs:  text('supporting_docs'),   // JSON array of URLs

  // Processing
  submitted_at:     timestamp('submitted_at').defaultNow(),
  reviewed_by:      uuid('reviewed_by'),       // admin id
  reviewed_at:      timestamp('reviewed_at'),
  rejection_reason: text('rejection_reason'),
  paid_at:          timestamp('paid_at'),
  notes:            text('notes'),

  created_at:       timestamp('created_at').defaultNow(),
  updated_at:       timestamp('updated_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// REFRESH TOKENS  (shared across all roles)
// ─────────────────────────────────────────────────────────────────────────────

export const refreshTokensTable = pgTable('refresh_tokens', {
  id:          uuid('id').primaryKey().defaultRandom(),
  user_id:     uuid('user_id').notNull(),    // id from whichever role table
  user_role:   userRoleEnum('user_role').notNull(),
  token:       text('token').unique().notNull(),
  expires_at:  timestamp('expires_at').notNull(),
  revoked:     boolean('revoked').default(false),
  revoked_at:  timestamp('revoked_at'),
  user_agent:  text('user_agent'),
  ip_address:  varchar('ip_address', { length: 45 }),
  created_at:  timestamp('created_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// AUDIT LOGS
// ─────────────────────────────────────────────────────────────────────────────

export const auditLogsTable = pgTable('audit_logs', {
  id:          uuid('id').primaryKey().defaultRandom(),
  user_id:     uuid('user_id'),
  user_role:   userRoleEnum('user_role'),
  action:      varchar('action',    { length: 100 }).notNull(), // e.g. 'LOGIN', 'APPROVE_CLAIM'
  entity:      varchar('entity',    { length: 100 }),           // e.g. 'members', 'claims'
  entity_id:   uuid('entity_id'),
  details:     text('details'),    // JSON string for extra context
  ip_address:  varchar('ip_address', { length: 45 }),
  created_at:  timestamp('created_at').defaultNow(),
})

// ─────────────────────────────────────────────────────────────────────────────
// PASSWORD RESETS
// ─────────────────────────────────────────────────────────────────────────────

export const passwordResetsTable = pgTable('password_resets', {
  id:          uuid('id').primaryKey().defaultRandom(),
  user_id:     uuid('user_id').notNull(),
  user_role:   userRoleEnum('user_role').notNull(),
  token:       varchar('token',      { length: 255 }).unique().notNull(),
  expires_at:  timestamp('expires_at').notNull(),
  used:        boolean('used').default(false),
  created_at:  timestamp('created_at').defaultNow(),
})
