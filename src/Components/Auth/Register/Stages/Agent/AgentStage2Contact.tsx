import { AgentForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: AgentForm; onChange: (field: keyof AgentForm, value: string) => void }

const PROVINCES = ['Lusaka','Copperbelt','Eastern','Luapula','Northern','Muchinga','North-Western','Western','Southern','Central']

const AgentStage2Contact = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Phone Number"     value={form.phone}   onChange={(e) => onChange('phone',   e.target.value)} placeholder="+260 97 1234567" type="tel" />
    <StageInput label="Email Address"    value={form.email}   onChange={(e) => onChange('email',   e.target.value)} placeholder="agent@email.com" type="email" />
    <StageInput label="Physical Address" value={form.address} onChange={(e) => onChange('address', e.target.value)} placeholder="Plot 12, Cairo Road" />
    <StageSelect label="Province" value={form.province} onChange={(v) => onChange('province', v)}
      options={PROVINCES.map((p) => ({ value: p, label: p }))} />
  </div>
)

export default AgentStage2Contact