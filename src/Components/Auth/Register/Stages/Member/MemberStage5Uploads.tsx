import { MemberForm } from '../types'

interface Props {
  form:     MemberForm
  onChange: (field: keyof MemberForm, value: string) => void
}

const UploadField = ({
  label, value, onChange, hint,
}: {
  label: string; value: string; onChange: (v: string) => void; hint?: string
}) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
    <label style={{
      fontSize:'12px', fontWeight:600,
      color:'rgba(255,255,255,0.7)',
      textTransform:'uppercase', letterSpacing:'0.05em',
    }}>
      {label}
    </label>
    {hint && (
      <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.4)', marginBottom:'2px' }}>{hint}</p>
    )}
    <label style={{
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      height:'100px',
      border:'1.5px dashed rgba(255,255,255,0.25)',
      borderRadius:'10px',
      background: value ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
      cursor:'pointer', gap:'6px',
    }}>
      <input
        type="file"
        accept="image/*,.pdf"
        style={{ display:'none' }}
        onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0].name) }}
      />
      {value ? (
        <>
          <span style={{ fontSize:'20px' }}>✅</span>
          <span style={{ fontSize:'11px', color:'#6ee7b7', textAlign:'center', padding:'0 8px' }}>{value}</span>
        </>
      ) : (
        <>
          <span style={{ fontSize:'20px' }}>📎</span>
          <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.45)' }}>Tap to upload — JPG, PNG or PDF</span>
        </>
      )}
    </label>
  </div>
)

const MemberStage5Uploads = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>

    <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
      Upload clear, legible copies of the following documents. Files must be JPG, PNG or PDF and under 5MB.
    </p>

    <UploadField
      label="NRC — Front Side"
      hint="Clear photo of the front of your National Registration Card"
      value={form.nrcFrontUrl}
      onChange={(v) => onChange('nrcFrontUrl', v)}
    />

    <UploadField
      label="NRC — Back Side"
      hint="Clear photo of the back of your National Registration Card"
      value={form.nrcBackUrl}
      onChange={(v) => onChange('nrcBackUrl', v)}
    />

    <UploadField
      label="Passport Photo"
      hint="Recent passport-size photograph (white background preferred)"
      value={form.passportPhotoUrl}
      onChange={(v) => onChange('passportPhotoUrl', v)}
    />

    <UploadField
      label="Proof of Employment"
      hint="Employment letter, payslip, or contract from your employer"
      value={form.proofOfEmployUrl}
      onChange={(v) => onChange('proofOfEmployUrl', v)}
    />

  </div>
)

export default MemberStage5Uploads