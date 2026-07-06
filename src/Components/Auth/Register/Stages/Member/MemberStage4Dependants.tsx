import { MemberForm } from '../types'
import { StageInput } from '../StageInput'

interface Props {
  form:     MemberForm
  onChange: (field: keyof MemberForm, value: string) => void
}

const MemberStage4Dependants = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

    <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
      Enter details of your spouse and dependants who will be covered under your NHIMA membership.
    </p>

    <div style={{
      padding:      '12px 14px',
      background:   'rgba(255,255,255,0.06)',
      borderRadius: '10px',
      marginBottom: '4px',
    }}>
      <p style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.7)', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.05em' }}>
        Spouse Details
      </p>

      <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
        <StageInput
          label="Spouse First Name"
          value={form.spouseFirstName}
          onChange={(e) => onChange('spouseFirstName', e.target.value)}
          placeholder="e.g. Jane"
        />
        <StageInput
          label="Spouse Last Name"
          value={form.spouseLastName}
          onChange={(e) => onChange('spouseLastName', e.target.value)}
          placeholder="e.g. Mumba"
        />
        <StageInput
          label="Spouse NRC Number"
          value={form.spouseNrc}
          onChange={(e) => onChange('spouseNrc', e.target.value)}
          placeholder="e.g. 234567/89/1"
        />
        <StageInput
          label="Spouse Date of Birth"
          value={form.spouseDob}
          onChange={(e) => onChange('spouseDob', e.target.value)}
          type="date"
        />
      </div>
    </div>

    <StageInput
      label="Number of Dependent Children"
      value={form.numChildren}
      onChange={(e) => onChange('numChildren', e.target.value)}
      type="number"
      placeholder="e.g. 2"
    />

    <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.45)', lineHeight:1.6 }}>
      Children under 18 years are automatically covered. You will be able to add their details after registration.
    </p>

  </div>
)

export default MemberStage4Dependants