import {
  FaUserPlus,
  FaUsers,
  FaBuilding,
  FaHospital,
  FaHeartbeat,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
  FaUserCog,
} from 'react-icons/fa';
import type { IconType } from 'react-icons';
import type {
  FAQCategory,
  HelpTopic,
  SearchChip,
  FAQItem,
} from './faqType'; // adjust path/name to match your actual types file

export const faqCategories: FAQCategory[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'registration', label: 'Registration' },
  { id: 'members', label: 'Members' },
  { id: 'employers', label: 'Employers' },
  { id: 'providers', label: 'Healthcare Providers' },
  { id: 'benefits', label: 'Benefits' },
  { id: 'claims', label: 'Claims' },
  { id: 'payments', label: 'Contributions & Payments' },
  { id: 'account', label: 'Account & Portal' },
  { id: 'general', label: 'General' },
];

// icon holds the component reference (IconType), not a rendered <Icon />
export const helpTopics: (Omit<HelpTopic, 'icon'> & { icon: IconType })[] = [
  {
    id: 'registration',
    icon: FaUserPlus,
    title: 'Registration',
    description: 'How to register as a member, add dependants, and get your NHIMA number.',
    category: 'registration',
  },
  {
    id: 'members',
    icon: FaUsers,
    title: 'Member Services',
    description: 'Cards, portal access, and managing your membership details.',
    category: 'members',
  },
  {
    id: 'employers',
    icon: FaBuilding,
    title: 'Employer Services',
    description: 'Registering staff, remittances, and compliance guidelines.',
    category: 'employers',
  },
  {
    id: 'providers',
    icon: FaHospital,
    title: 'Healthcare Providers',
    description: 'Finding accredited facilities and how provider claims work.',
    category: 'providers',
  },
  {
    id: 'benefits',
    icon: FaHeartbeat,
    title: 'Benefits',
    description: 'What is covered, limits, and how to access your benefits.',
    category: 'benefits',
  },
  {
    id: 'claims',
    icon: FaFileInvoiceDollar,
    title: 'Claims',
    description: 'How claims are processed between providers and NHIMA.',
    category: 'claims',
  },
  {
    id: 'payments',
    icon: FaMoneyBillWave,
    title: 'Contributions',
    description: 'Contribution rates, deadlines, and payment methods.',
    category: 'payments',
  },
  {
    id: 'account',
    icon: FaUserCog,
    title: 'Account & Portal',
    description: 'Logging in, resetting passwords, and updating your profile.',
    category: 'account',
  },
];

export const searchChips: SearchChip[] = [
  { label: 'How to register', category: 'registration' },
  { label: 'Contribution rate', category: 'payments' },
  { label: 'Find a facility', category: 'providers' },
  { label: 'File a claim', category: 'claims' },
  { label: 'Add a dependant', category: 'members' },
];

export const faqItems: FAQItem[] = [
  {
    id: 'reg-1',
    category: 'registration',
    question: 'Who is eligible to register with NHIMA?',
    answer:
      'All Zambians and established residents aged 18 and above are eligible to register. Members aged 65 and above, and indigent or disabled persons, are exempt from contributing but remain registered and covered.',
    keywords: ['eligibility', 'age', 'register'],
  },
  {
    id: 'reg-2',
    category: 'registration',
    question: 'Can I register my spouse and children?',
    answer:
      'Yes. You can register a spouse and up to 5 dependants under the age of 18 at no extra cost. Dependants aged 18 and above need to be registered in their own right.',
    keywords: ['dependants', 'spouse', 'children'],
  },
  {
    id: 'mem-1',
    category: 'members',
    question: 'How do I get my NHIMA card?',
    answer:
      'Once your registration is processed, your NHIMA card is issued at your nearest NHIMA branch or, where available, dispatched to your registered address.',
    keywords: ['card', 'collect'],
  },
  {
    id: 'mem-2',
    category: 'members',
    question: 'I lost my NHIMA card. What should I do?',
    answer:
      'Visit any NHIMA branch with a valid ID to request a replacement card. You can also access services at accredited facilities using your NHIMA number while your card is being replaced.',
    keywords: ['lost card', 'replacement'],
  },
  {
    id: 'emp-1',
    category: 'employers',
    question: 'How does an employer register with NHIMA?',
    answer:
      'Employers register through the Employer Portal, submitting company details and a list of employees. Once approved, employers can begin submitting monthly remittances.',
    keywords: ['employer', 'register', 'portal'],
  },
  {
    id: 'emp-2',
    category: 'employers',
    question: 'What happens if an employer fails to remit contributions?',
    answer:
      "Your entitlement to benefits is not affected by your employer's failure to remit. If you suspect your employer is deducting NHIMA contributions but not remitting them, contact NHIMA on the toll-free line or visit a branch.",
    keywords: ['remittance', 'non-payment', 'penalty'],
  },
  {
    id: 'prov-1',
    category: 'providers',
    question: 'How do I find an accredited healthcare facility?',
    answer:
      'You can search the list of accredited facilities on the NHIMA website or through the Facilities page, which is updated regularly across all provinces.',
    keywords: ['facility', 'hospital', 'accredited'],
  },
  {
    id: 'ben-1',
    category: 'benefits',
    question: 'What services are covered under my benefits?',
    answer:
      'Cover includes consultations, diagnostics, prescribed medicines, surgical procedures, maternity and newborn care, inpatient care, and mental health services, delivered cashlessly at accredited facilities.',
    keywords: ['coverage', 'services', 'benefits package'],
  },
  {
    id: 'ben-2',
    category: 'benefits',
    question: 'Are there limits on outpatient visits?',
    answer:
      'Outpatient visits are limited to 3 per health event at secondary and tertiary hospitals, unless the condition is chronic.',
    keywords: ['outpatient', 'limit', 'visits'],
  },
  {
    id: 'claim-1',
    category: 'claims',
    question: 'Do I need to submit a claim myself?',
    answer:
      'No. Services are provided cashlessly, and accredited facilities submit claims directly to NHIMA on your behalf.',
    keywords: ['claim', 'cashless'],
  },
  {
    id: 'pay-1',
    category: 'payments',
    question: 'How much do I contribute to NHIMA?',
    answer:
      'Contributions are calculated as a percentage of your salary, shared between employer and employee. Check the current contribution rate guide for exact figures.',
    keywords: ['contribution rate', 'percentage', 'salary'],
  },
  {
    id: 'pay-2',
    category: 'payments',
    question: 'How do I pay my NHIMA contributions if I am self-employed?',
    answer:
      'Self-employed members can register and pay directly through the Member Portal or at any NHIMA branch using approved payment channels.',
    keywords: ['self employed', 'payment'],
  },
  {
    id: 'acc-1',
    category: 'account',
    question: 'I forgot my portal password. How do I reset it?',
    answer:
      'Click "Forgot Password" on the portal login page and follow the instructions sent to your registered email or phone number.',
    keywords: ['password', 'reset', 'login'],
  },
  {
    id: 'gen-1',
    category: 'general',
    question: "What are NHIMA's office hours?",
    answer:
      'NHIMA branches are open Monday to Friday, 08:00 AM to 05:00 PM. You can also reach support via the toll-free line at any time during business hours.',
    keywords: ['hours', 'contact', 'support'],
  },
];