import { EmployerForm } from '../types'
import { StageInput } from '../StageInput'

interface Props { form: EmployerForm; onChange: (field: keyof EmployerForm, value: string) => void }

const EmployerStage2Contact = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Contact Person"  value={form.contactPerson}  onChange={(e) => onChange('contactPerson',  e.target.value)} placeholder="John Banda" />
    <StageInput label="Contact Phone"   value={form.contactPhone}   onChange={(e) => onChange('contactPhone',   e.target.value)} placeholder="+260 97 1234567" type="tel" />
    <StageInput label="Contact Email"   value={form.contactEmail}   onChange={(e) => onChange('contactEmail',   e.target.value)} placeholder="hr@company.co.zm" type="email" />
    <StageInput label="Website"         value={form.website}        onChange={(e) => onChange('website',        e.target.value)} placeholder="www.company.co.zm" />
  </div>
)

export default EmployerStage2Contact