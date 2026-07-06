import { AgentForm } from '../types'
import { StageInput } from '../StageInput'

interface Props { form: AgentForm; onChange: (field: keyof AgentForm, value: string) => void }

const AgentStage3Employment = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Current Employer"  value={form.currentEmployer} onChange={(e) => onChange('currentEmployer', e.target.value)} placeholder="ABC Company Ltd" />
    <StageInput label="Job Title"         value={form.jobTitle}        onChange={(e) => onChange('jobTitle',        e.target.value)} placeholder="Insurance Agent" />
    <StageInput label="Date of Employment" value={form.employmentDate} onChange={(e) => onChange('employmentDate', e.target.value)} type="date" />
  </div>
)

export default AgentStage3Employment