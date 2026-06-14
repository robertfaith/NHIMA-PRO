import { MemberForm } from '../types'
import { StageInput, StageSelect } from '../StageInput'

interface Props {
  form:     MemberForm
  onChange: (field: keyof MemberForm, value: string) => void
}

const PROVINCES = [
  'Lusaka','Copperbelt','Eastern','Luapula',
  'Northern','Muchinga','North-Western','Western','Southern','Central',
]

const DISTRICTS: Record<string, string[]> = {
  Lusaka:       ['Lusaka','Chilanga','Chongwe','Kafue','Luangwa'],
  Copperbelt:   ['Ndola','Kitwe','Chingola','Mufulira','Luanshya','Kalulushi'],
  Eastern:      ['Chipata','Petauke','Lundazi','Chadiza','Katete'],
  Southern:     ['Livingstone','Choma','Mazabuka','Monze','Kalomo'],
  Northern:     ['Kasama','Mbala','Mpika','Luwingu'],
  Muchinga:     ['Chinsali','Mpika','Nakonde','Isoka'],
  Luapula:      ['Mansa','Nchelenge','Kawambwa','Samfya'],
  'North-Western': ['Solwezi','Kasempa','Mwinilunga','Zambezi'],
  Western:      ['Mongu','Kaoma','Senanga','Kalabo'],
  Central:      ['Kabwe','Mumbwa','Kapiri Mposhi','Serenje'],
}

const MemberStage2Contact = ({ form, onChange }: Props) => {
  const districts = DISTRICTS[form.province] ?? []

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

      <StageInput
        label="Mobile Number (Primary)"
        value={form.phonePrimary}
        onChange={(e) => onChange('phonePrimary', e.target.value)}
        placeholder="+260 97 1234567"
        type="tel"
      />

      <StageInput
        label="Alternative Number"
        value={form.phoneAlt}
        onChange={(e) => onChange('phoneAlt', e.target.value)}
        placeholder="+260 96 7654321 (optional)"
        type="tel"
      />

      <StageInput
        label="Email Address"
        value={form.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="robert@email.com"
        type="email"
      />

      <StageInput
        label="Physical Address"
        value={form.address}
        onChange={(e) => onChange('address', e.target.value)}
        placeholder="Plot 12, Cairo Road"
      />

      <StageSelect
        label="Province"
        value={form.province}
        onChange={(v) => { onChange('province', v); onChange('district', '') }}
        options={PROVINCES.map((p) => ({ value: p, label: p }))}
      />

      <StageSelect
        label="District"
        value={form.district}
        onChange={(v) => onChange('district', v)}
        options={districts.map((d) => ({ value: d, label: d }))}
      />

      <StageInput
        label="Constituency"
        value={form.constituency}
        onChange={(e) => onChange('constituency', e.target.value)}
        placeholder="e.g. Kanyama"
      />

    </div>
  )
}

export default MemberStage2Contact