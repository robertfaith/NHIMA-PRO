import type { FAQCategory, FAQItem, HelpTopic, SearchChip } from './faqType';

export const faqCategories: FAQCategory[] = [
  { id: 'all', label: 'All Questions' },
  { id: 'registration', label: 'Registration' },
  { id: 'members', label: 'Members' },
  { id: 'employers', label: 'Employers' },
  { id: 'providers', label: 'Healthcare Providers' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'claims', label: 'Claims' },
  { id: 'payments', label: 'Payments' },
  { id: 'account', label: 'Account' },
  { id: 'general', label: 'General' },
];

export const searchChips: SearchChip[] = [
  { label: 'Registration', targetCategory: 'registration' },
  { label: 'Employer Registration', targetCategory: 'employers' },
  { label: 'Claims', targetCategory: 'claims' },
  { label: 'Benefits', targetCategory: 'benefits' },
  { label: 'Contributions', targetCategory: 'payments' },
  { label: 'Payments', targetCategory: 'payments' },
  { label: 'Login & Security', targetCategory: 'account' },
  { label: 'Healthcare Providers', targetCategory: 'providers' },
];

export const helpTopics: HelpTopic[] = [
  {
    id: 'member-services',
    title: 'Member Services',
    description: 'Register, manage dependents and access your membership card.',
    icon: 'user',
    targetCategory: 'members',
  },
  {
    id: 'employers',
    title: 'Employers',
    description: 'Register your business and manage staff contributions.',
    icon: 'briefcase',
    targetCategory: 'employers',
  },
  {
    id: 'providers',
    title: 'Healthcare Providers',
    description: 'Accreditation, facility listings and claims processing.',
    icon: 'hospital',
    targetCategory: 'providers',
  },
  {
    id: 'benefits',
    title: 'Benefits',
    description: 'See what is covered under your NHIMA benefit package.',
    icon: 'shield',
    targetCategory: 'benefits',
  },
  {
    id: 'claims',
    title: 'Claims',
    description: 'Submit, track and understand the claims process.',
    icon: 'clipboard',
    targetCategory: 'claims',
  },
  {
    id: 'contributions',
    title: 'Contributions',
    description: 'Check your contribution history and statements.',
    icon: 'chart',
    targetCategory: 'payments',
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Accepted payment methods and how to pay online.',
    icon: 'card',
    targetCategory: 'payments',
  },
  {
    id: 'account',
    title: 'Account & Login',
    description: 'Reset your password and keep your profile up to date.',
    icon: 'lock',
    targetCategory: 'account',
  },
];

export const faqItems: FAQItem[] = [
  // Registration
  {
    id: 'reg-1',
    category: 'registration',
    question: 'Who is eligible to register with NHIMA?',
    answer:
      'Every Zambian resident is eligible to register with NHIMA, including formal sector employees, informal sector workers, self-employed individuals, and members of the public who wish to contribute voluntarily. Membership provides access to a defined package of health services at accredited facilities across the country.',
  },
  {
    id: 'reg-2',
    category: 'registration',
    question: 'How do I register as an individual member?',
    answer:
      'You can register online through the NHIMA member portal, in person at any NHIMA service centre, or through your employer if you are formally employed. You will need a valid National Registration Card (NRC), a passport-size photograph, and your Tax Payer Identification Number (TPIN) where applicable.',
  },
  {
    id: 'reg-3',
    category: 'registration',
    question: 'What documents do I need to complete registration?',
    answer:
      'You will need a valid NRC or passport, proof of residence, a recent passport-size photograph, and details of any dependents you wish to add, such as birth certificates for children or a marriage certificate for a spouse.',
  },
  {
    id: 'reg-4',
    category: 'registration',
    question: 'How long does registration take to process?',
    answer:
      'Online registration is typically processed within 24 to 48 hours. Registrations submitted at a service centre with complete documentation are often activated on the same day, after which your membership number and card become available.',
  },
  {
    id: 'reg-5',
    category: 'registration',
    question: 'Can I register on behalf of a family member?',
    answer:
      'The principal member must complete their own registration first. Once your account is active, you can add a spouse and eligible children as dependents directly through your online profile or at a service centre.',
  },
  // Employers
  {
    id: 'emp-1',
    category: 'employers',
    question: 'How does an employer register with NHIMA?',
    answer:
      'Employers register through the NHIMA employer portal by providing their company registration certificate, TPIN, PACRA details, and a list of employees. Once verified, the employer receives an employer code used for all subsequent contribution submissions.',
  },
  {
    id: 'emp-2',
    category: 'employers',
    question: 'What is an employer required to contribute?',
    answer:
      'Employers are required to remit a statutory contribution calculated as a percentage of each employee\'s gross monthly earnings, matched by an equal contribution deducted from the employee. Current contribution rates are published on the NHIMA website and updated periodically by regulation.',
  },
  {
    id: 'emp-3',
    category: 'employers',
    question: 'By when must monthly contributions be submitted?',
    answer:
      'Contributions for a given month must be remitted by the 10th day of the following month. Late submissions may attract penalties as prescribed under the National Health Insurance Act.',
  },
  {
    id: 'emp-4',
    category: 'employers',
    question: 'How do I add or remove an employee from my payroll on NHIMA?',
    answer:
      'Employers can update their staff list at any time through the employer portal by submitting a new hire form for additions or a separation notice for exits. Changes typically reflect in the system within one billing cycle.',
  },
  {
    id: 'emp-5',
    category: 'employers',
    question: 'Can an employer view contribution history for all staff?',
    answer:
      'Yes. The employer portal provides a full contribution ledger showing monthly remittances per employee, outstanding balances, and downloadable statements for audit and reconciliation purposes.',
  },
  // Members / benefits mixed under members
  {
    id: 'mem-1',
    category: 'members',
    question: 'How do I download or print my membership card?',
    answer:
      'Log in to your member portal account, navigate to "My Membership," and select "Download Card." A digital copy of your card is generated instantly as a PDF, which is accepted at all accredited facilities alongside your NRC.',
  },
  {
    id: 'mem-2',
    category: 'members',
    question: 'How do I add a dependent to my membership?',
    answer:
      'From your member dashboard, select "Manage Dependents" and choose "Add Dependent." You will be asked to upload supporting documents such as a birth certificate or marriage certificate. Approved dependents appear on your account within a few working days.',
  },
  {
    id: 'mem-3',
    category: 'members',
    question: 'Who qualifies as a dependent under my membership?',
    answer:
      'A spouse and children under the age of 21 (or up to 25 if enrolled in full-time education) qualify as dependents. Additional categories, including persons with disabilities under your care, may also be eligible on review.',
  },
  {
    id: 'mem-4',
    category: 'members',
    question: 'How do I update my personal profile details?',
    answer:
      'Sign in to the member portal, go to "Profile Settings," and edit your contact number, email address, or physical address. Changes to your legal name or NRC number require submission of supporting documents for verification.',
  },
  {
    id: 'mem-5',
    category: 'members',
    question: 'How can I check my contribution balance?',
    answer:
      'Your contribution history is available under "My Contributions" in the member portal, showing a month-by-month record of amounts received from you and your employer, along with your current active status.',
  },
  // Providers
  {
    id: 'prov-1',
    category: 'providers',
    question: 'How does a healthcare facility become NHIMA accredited?',
    answer:
      'A facility must apply through the provider accreditation portal, submitting its operating licence, staffing details, and facility inspection reports. NHIMA conducts a site assessment against its accreditation standards before granting provider status.',
  },
  {
    id: 'prov-2',
    category: 'providers',
    question: 'How often is accreditation renewed?',
    answer:
      'Provider accreditation is reviewed annually. Facilities must submit updated licensing and compliance documents ahead of the renewal date to maintain their accredited status without interruption.',
  },
  {
    id: 'prov-3',
    category: 'providers',
    question: 'Where can I find a list of accredited facilities?',
    answer:
      'A searchable directory of accredited hospitals, clinics, and pharmacies is available on the NHIMA website, filterable by province, district, and facility type.',
  },
  {
    id: 'prov-4',
    category: 'providers',
    question: 'How do providers submit claims for reimbursement?',
    answer:
      'Accredited providers submit claims electronically through the provider claims portal, attaching treatment records and itemised invoices. Claims are reviewed against the member\'s benefit package before payment is processed.',
  },
  {
    id: 'prov-5',
    category: 'providers',
    question: 'What happens if a provider\'s accreditation lapses?',
    answer:
      'Services rendered after an accreditation lapse are not eligible for reimbursement until the facility renews its status. NHIMA notifies providers in advance of upcoming renewal deadlines to avoid disruption.',
  },
  // Benefits
  {
    id: 'ben-1',
    category: 'benefits',
    question: 'What medical services are covered under NHIMA?',
    answer:
      'The standard benefit package covers outpatient and inpatient care, maternity services, surgery, diagnostic tests, and prescribed medication at accredited facilities. Certain specialised or elective procedures may fall outside the standard package.',
  },
  {
    id: 'ben-2',
    category: 'benefits',
    question: 'Is emergency care covered even at a non-accredited facility?',
    answer:
      'Emergency, life-threatening cases are covered even if the nearest facility is not accredited, provided the case is reported and documented promptly. Members should transfer to an accredited facility for follow-up care once stabilised.',
  },
  {
    id: 'ben-3',
    category: 'benefits',
    question: 'Are pre-existing conditions covered by NHIMA?',
    answer:
      'Yes. Unlike many private insurance schemes, NHIMA covers pre-existing conditions from the date your membership becomes active, in line with the principle of universal health coverage.',
  },
  {
    id: 'ben-4',
    category: 'benefits',
    question: 'Is maternity care included in my benefits?',
    answer:
      'Maternity care, including antenatal visits, delivery, and postnatal check-ups, is included in the standard benefit package at accredited facilities offering maternity services.',
  },
  {
    id: 'ben-5',
    category: 'benefits',
    question: 'Does my cover extend to my dependents automatically?',
    answer:
      'Once a dependent is successfully added and approved on your membership, they are covered under the same benefit package as the principal member from the date of approval.',
  },
  // Claims
  {
    id: 'clm-1',
    category: 'claims',
    question: 'Do I need to submit a claim myself as a member?',
    answer:
      'In most cases, no. Accredited providers submit claims directly to NHIMA on your behalf after treatment. You are only required to present a valid membership card and NRC at the point of care.',
  },
  {
    id: 'clm-2',
    category: 'claims',
    question: 'How long does claims processing take?',
    answer:
      'Complete claims are typically processed within 21 working days of submission. Claims with missing documentation may take longer while the provider is asked to supply the outstanding information.',
  },
  {
    id: 'clm-3',
    category: 'claims',
    question: 'How can I check the status of a claim?',
    answer:
      'Members can view claim status under "My Claims" in the member portal, while providers can track submitted claims through the provider claims dashboard, both showing real-time processing stages.',
  },
  {
    id: 'clm-4',
    category: 'claims',
    question: 'What should I do if a claim is rejected?',
    answer:
      'A rejected claim notice includes the reason for rejection. Providers may correct and resubmit the claim within the stipulated resubmission window, or members may lodge a formal query through the contact centre.',
  },
  {
    id: 'clm-5',
    category: 'claims',
    question: 'Can I be billed directly if my claim is declined?',
    answer:
      'If a service falls outside your benefit package or accreditation requirements were not met, the facility may bill you directly. Reviewing your benefit package in advance helps avoid unexpected charges.',
  },
  // Payments
  {
    id: 'pay-1',
    category: 'payments',
    question: 'What payment methods does NHIMA accept?',
    answer:
      'NHIMA accepts payments via mobile money, bank transfer, debit or credit card through the online payment gateway, and direct payment at any designated bank branch or service centre.',
  },
  {
    id: 'pay-2',
    category: 'payments',
    question: 'How do I pay my voluntary contributions online?',
    answer:
      'Log in to your member portal, select "Make a Payment," choose your preferred payment method, and enter the contribution period you wish to pay for. A receipt is generated automatically once payment is confirmed.',
  },
  {
    id: 'pay-3',
    category: 'payments',
    question: 'What happens if I miss a contribution payment?',
    answer:
      'Missing a contribution may result in a temporary suspension of benefits until the outstanding amount is settled. Formal sector members should also confirm with their employer that remittances are up to date.',
  },
  {
    id: 'pay-4',
    category: 'payments',
    question: 'Can I download a statement of my contribution history?',
    answer:
      'Yes. A downloadable PDF statement covering any selected period is available under "My Contributions," useful for personal records, loan applications, or tax purposes.',
  },
  // Account
  {
    id: 'acc-1',
    category: 'account',
    question: 'How do I reset a forgotten password?',
    answer:
      'On the login page, select "Forgot Password" and enter your registered email address or phone number. You will receive a secure reset link or one-time code to set a new password.',
  },
  {
    id: 'acc-2',
    category: 'account',
    question: 'How do I keep my account secure?',
    answer:
      'Use a strong, unique password, avoid sharing your login details, and enable two-factor authentication where available. NHIMA will never ask for your password by phone or email.',
  },
  {
    id: 'acc-3',
    category: 'account',
    question: 'Can I change the email or phone number linked to my account?',
    answer:
      'Yes, under "Profile Settings" you can update your contact details. For security, a verification code is sent to both your old and new contact method before the change is confirmed.',
  },
  {
    id: 'acc-4',
    category: 'account',
    question: 'Why is my account showing as inactive?',
    answer:
      'An account may show as inactive due to outstanding contributions, incomplete registration documents, or a temporary administrative hold. Contact the support centre to identify the exact reason and resolve it.',
  },
  // General
  {
    id: 'gen-1',
    category: 'general',
    question: 'What is NHIMA and why was it established?',
    answer:
      'The National Health Insurance Management Authority (NHIMA) administers Zambia\'s National Health Insurance Scheme, established to provide equitable access to quality healthcare services for all citizens through a sustainable, contribution-based financing model.',
  },
  {
    id: 'gen-2',
    category: 'general',
    question: 'Is NHIMA membership compulsory?',
    answer:
      'Yes. Membership is mandatory for all eligible Zambians under the National Health Insurance Act, with contributions structured differently for formal sector employees, self-employed individuals, and informal sector workers.',
  },
  {
    id: 'gen-3',
    category: 'general',
    question: 'How do I contact NHIMA support?',
    answer:
      'Support is available through the contact centre hotline, email, live chat on the member portal, and in person at any NHIMA service centre nationwide. Contact details are listed on the Contact page.',
  },
];
