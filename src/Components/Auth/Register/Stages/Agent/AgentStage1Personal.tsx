import { AgentForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props { form: AgentForm; onChange: (field: keyof AgentForm, value: string) => void }

const AgentStage1Personal = ({ form, onChange }: Props) => (
  <div className="form-grid">

    <div className="form-field field-full">
      <StageInput
        label="Full Name"
        value={form.fullName}
        onChange={(e) => onChange('fullName', e.target.value)}
        placeholder="Robert Mumba"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="NRC Number"
        value={form.nrc}
        onChange={(e) => onChange('nrc', e.target.value)}
        placeholder="123456/78/9"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Date of Birth"
        value={form.dob}
        onChange={(e) => onChange('dob', e.target.value)}
        type="date"
      />
    </div>

    <div className="form-field field-full">
      <StageSelect
        label="Gender"
        value={form.gender}
        onChange={(v) => onChange('gender', v)}
        options={[
          { value: 'Male',   label: 'Male'   },
          { value: 'Female', label: 'Female' },
        ]}
      />
    </div>

  </div>
)

export default AgentStage1Personal
