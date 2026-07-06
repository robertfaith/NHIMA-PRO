import { MemberForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props {
  form:     MemberForm
  onChange: (field: keyof MemberForm, value: string) => void
}

const BRANCHES = [
  'Lusaka','Ndola','Kitwe','Livingstone',
  'Kasama','Chipata','Mongu','Solwezi','Mansa','Choma',
]

const MemberStage3Employment = ({ form, onChange }: Props) => (
  <div className="form-grid">

    <div className="form-field field-full">
      <StageSelect
        label="Employment Status"
        value={form.employmentStatus}
        onChange={(v) => onChange('employmentStatus', v)}
        options={[
          { value:'Formal',        label:'Formal Employment'   },
          { value:'Informal',      label:'Informal Employment' },
          { value:'Self-Employed', label:'Self-Employed'       },
          { value:'Unemployed',    label:'Unemployed'          },
        ]}
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Employer Name"
        value={form.employerName}
        onChange={(e) => onChange('employerName', e.target.value)}
        placeholder="ABC Company Ltd"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Employer ZRA TPIN"
        value={form.employerTpin}
        onChange={(e) => onChange('employerTpin', e.target.value)}
        placeholder="e.g. 1000XXXXX"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Your ZRA TPIN (Member)"
        value={form.memberTpin}
        onChange={(e) => onChange('memberTpin', e.target.value)}
        placeholder="e.g. 1000XXXXX"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Monthly Gross Income (ZMW)"
        value={form.monthlyIncome}
        onChange={(e) => onChange('monthlyIncome', e.target.value)}
        placeholder="e.g. 5000.00"
        type="number"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Occupation / Job Title"
        value={form.jobTitle}
        onChange={(e) => onChange('jobTitle', e.target.value)}
        placeholder="e.g. Nurse, Teacher, Engineer"
      />
    </div>

    <div className="form-field">
      <StageInput
        label="Date of Employment"
        value={form.employmentDate}
        onChange={(e) => onChange('employmentDate', e.target.value)}
        type="date"
      />
    </div>

    <div className="form-field">
      <StageSelect
        label="Nearest NHIMA Branch"
        value={form.nhimaBranch}
        onChange={(v) => onChange('nhimaBranch', v)}
        options={BRANCHES.map((b) => ({ value: b, label: b }))}
      />
    </div>

  </div>
)

export default MemberStage3Employment
