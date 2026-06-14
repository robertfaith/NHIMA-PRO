import { AgentForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: AgentForm; onChange: (field: keyof AgentForm, value: string) => void }

const AgentStage1Personal = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Full Name"     value={form.fullName} onChange={(e) => onChange('fullName', e.target.value)} placeholder="Robert Mumba" />
    <StageInput label="NRC Number"    value={form.nrc}      onChange={(e) => onChange('nrc',      e.target.value)} placeholder="123456/78/9" />
    <StageInput label="Date of Birth" value={form.dob}      onChange={(e) => onChange('dob',      e.target.value)} type="date" />
    <StageSelect label="Gender" value={form.gender} onChange={(v) => onChange('gender', v)}
      options={[{ value:'Male', label:'Male' }, { value:'Female', label:'Female' }]} />
  </div>
)

export default AgentStage1Personal