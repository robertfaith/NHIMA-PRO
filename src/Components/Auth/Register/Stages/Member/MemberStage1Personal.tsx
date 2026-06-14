import { MemberForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props {
  form:     MemberForm
  onChange: (field: keyof MemberForm, value: string) => void
}

const MemberStage1Personal = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

    <StageSelect
      label="Title"
      value={form.title}
      onChange={(v) => onChange('title', v)}
      options={[
        { value:'Mr',  label:'Mr'  },
        { value:'Mrs', label:'Mrs' },
        { value:'Ms',  label:'Ms'  },
        { value:'Dr',  label:'Dr'  },
        { value:'Rev', label:'Rev' },
      ]}
    />

    <StageInput
      label="First Name"
      value={form.firstName}
      onChange={(e) => onChange('firstName', e.target.value)}
      placeholder="e.g. Robert"
    />

    <StageInput
      label="Middle Name"
      value={form.middleName}
      onChange={(e) => onChange('middleName', e.target.value)}
      placeholder="e.g. Chanda (optional)"
    />

    <StageInput
      label="Last Name"
      value={form.lastName}
      onChange={(e) => onChange('lastName', e.target.value)}
      placeholder="e.g. Mumba"
    />

    <StageInput
      label="Date of Birth"
      value={form.dob}
      onChange={(e) => onChange('dob', e.target.value)}
      type="date"
    />

    <StageSelect
      label="Gender"
      value={form.gender}
      onChange={(v) => onChange('gender', v)}
      options={[
        { value:'Male',   label:'Male'   },
        { value:'Female', label:'Female' },
      ]}
    />

    <StageSelect
      label="Marital Status"
      value={form.maritalStatus}
      onChange={(v) => onChange('maritalStatus', v)}
      options={[
        { value:'Single',   label:'Single'   },
        { value:'Married',  label:'Married'  },
        { value:'Divorced', label:'Divorced' },
        { value:'Widowed',  label:'Widowed'  },
      ]}
    />

    <StageInput
      label="NRC Number"
      value={form.nrc}
      onChange={(e) => onChange('nrc', e.target.value)}
      placeholder="e.g. 123456/78/1"
    />

    <StageSelect
      label="Nationality"
      value={form.nationality}
      onChange={(v) => onChange('nationality', v)}
      options={[
        { value:'Zambian',     label:'Zambian'     },
        { value:'Non-Zambian', label:'Non-Zambian' },
      ]}
    />

  </div>
)

export default MemberStage1Personal