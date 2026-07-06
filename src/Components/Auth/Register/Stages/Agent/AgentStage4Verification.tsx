import { AgentForm } from '../types'
import { StageInput } from '../StageInput'

interface Props { form: AgentForm; onChange: (field: keyof AgentForm, value: string) => void }

const AgentStage4Verification = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
      Enter your NHIMA agent licence details for verification.
    </p>
    <StageInput label="Licence Number"    value={form.licenseNumber} onChange={(e) => onChange('licenseNumber', e.target.value)} placeholder="NHIMA-AG-XXXXX" />
    <StageInput label="Licence Expiry"    value={form.licenseExpiry} onChange={(e) => onChange('licenseExpiry', e.target.value)} type="date" />
    <StageInput label="Supervisor Name"   value={form.supervisorName} onChange={(e) => onChange('supervisorName', e.target.value)} placeholder="Supervisor Full Name" />
  </div>
)

export default AgentStage4Verification