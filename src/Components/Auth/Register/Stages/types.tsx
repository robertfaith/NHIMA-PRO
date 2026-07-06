

export type MemberForm = {
  // Stage 1 — Personal
  title:            string
  firstName:        string
  middleName:       string
  lastName:         string
  dob:              string
  gender:           string
  maritalStatus:    string
  nrc:              string
  nationality:      string

  // Stage 2 — Contact
  phonePrimary:     string
  phoneAlt:         string
  email:            string
  address:          string
  district:         string
  province:         string
  constituency:     string

  // Stage 3 — Employment
  employmentStatus: string
  employerName:     string
  employerTpin:     string
  memberTpin:       string
  monthlyIncome:    string
  employmentDate:   string
  jobTitle:         string
  nhimaBranch:      string

  // Stage 4 — Dependants
  spouseFirstName:  string
  spouseLastName:   string
  spouseNrc:        string
  spouseDob:        string
  numChildren:      string

  // Stage 5 — Uploads
  nrcFrontUrl:      string
  nrcBackUrl:       string
  passportPhotoUrl: string
  proofOfEmployUrl: string

  // Stage 6 — Password
  password:         string
  confirmPassword:  string
}

export type EmployerForm = {
  // Stage 1 — Company
  companyName:      string
  tpin:             string
  registrationNo:   string
  industry:         string
  // Stage 2 — Contact
  contactPerson:    string
  contactPhone:     string
  contactEmail:     string
  website:          string
  // Stage 3 — Address
  physicalAddress:  string
  district:         string
  province:         string
  poBox:            string
  // Stage 4 — Business
  numEmployees:     string
  businessType:     string
  nhimaBranch:      string
  // Stage 5 — Uploads
  certificateUrl:   string
  tpinDocUrl:       string
  // Stage 6 — Password
  password:         string
  confirmPassword:  string
}

export type AgentForm = {
  // Stage 1 — Personal
  title:            string
  firstName:        string
  middleName:       string
  lastName:         string
  nrc:              string
  dob:              string
  gender:           string
  // Stage 2 — Contact
  phone:            string
  email:            string
  address:          string
  province:         string
  // Stage 3 — Employment
  currentEmployer:  string
  jobTitle:         string
  employmentDate:   string
  // Stage 4 — Verification
  licenseNumber:    string
  licenseExpiry:    string
  supervisorName:   string
  // Stage 5 — Security
  nrcFrontUrl:      string
  licenseDocUrl:    string
  // Stage 6 — Password
  password:         string
  confirmPassword:  string
}