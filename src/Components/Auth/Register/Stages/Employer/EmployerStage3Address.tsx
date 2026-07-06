import { EmployerForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: EmployerForm; onChange: (field: keyof EmployerForm, value: string) => void }

const PROVINCES = ['Lusaka','Copperbelt','Eastern','Luapula','Northern','Muchinga','North-Western','Western','Southern','Central']

const EmployerStage3Address = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Physical Address"  value={form.physicalAddress} onChange={(e) => onChange('physicalAddress', e.target.value)} placeholder="Plot 5, Cairo Road, Lusaka" />
    <StageInput label="District"          value={form.district}        onChange={(e) => onChange('district',        e.target.value)} placeholder="Lusaka" />
    <StageSelect label="Province" value={form.province} onChange={(v) => onChange('province', v)}
      options={PROVINCES.map((p) => ({ value: p, label: p }))} />
    <StageInput label="P.O Box"           value={form.poBox}           onChange={(e) => onChange('poBox',           e.target.value)} placeholder="P.O Box 30XXX" />
  </div>
)

export default EmployerStage3Address