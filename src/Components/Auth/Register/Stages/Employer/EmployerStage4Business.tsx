import { EmployerForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: EmployerForm; onChange: (field: keyof EmployerForm, value: string) => void }

const BRANCHES = ['Lusaka','Ndola','Kitwe','Livingstone','Kasama','Chipata','Mongu','Solwezi','Mansa','Choma']

const EmployerStage4Business = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <StageInput label="Number of Employees" value={form.numEmployees} onChange={(e) => onChange('numEmployees', e.target.value)} type="number" placeholder="e.g. 50" />
    <StageSelect label="Business Type" value={form.businessType} onChange={(v) => onChange('businessType', v)}
      options={[{ value:'Private', label:'Private' }, { value:'Public', label:'Public' }, { value:'NGO', label:'NGO / Non-Profit' }, { value:'Government', label:'Government' }]} />
    <StageSelect label="Nearest NHIMA Branch" value={form.nhimaBranch} onChange={(v) => onChange('nhimaBranch', v)}
      options={BRANCHES.map((b) => ({ value: b, label: b }))} />
  </div>
)

export default EmployerStage4Business