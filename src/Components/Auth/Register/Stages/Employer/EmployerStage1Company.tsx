import { EmployerForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: EmployerForm; onChange: (field: keyof EmployerForm, value: string) => void }

const INDUSTRIES = ['Healthcare','Education','Manufacturing','Retail','Finance','Construction','Agriculture','Transport','Government','Other']

const EmployerStage1Company = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Company Name"       value={form.companyName}    onChange={(e) => onChange('companyName',    e.target.value)} placeholder="ABC Company Ltd" />
    <StageInput label="TPIN Number"        value={form.tpin}           onChange={(e) => onChange('tpin',           e.target.value)} placeholder="100XXXXXXX" />
    <StageInput label="Registration Number" value={form.registrationNo} onChange={(e) => onChange('registrationNo', e.target.value)} placeholder="PACRA Reg. No." />
    <StageSelect label="Industry" value={form.industry} onChange={(v) => onChange('industry', v)}
      options={INDUSTRIES.map((i) => ({ value: i, label: i }))} />
  </div>
)

export default EmployerStage1Company