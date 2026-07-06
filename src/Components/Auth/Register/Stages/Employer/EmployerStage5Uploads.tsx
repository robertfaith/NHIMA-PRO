import { EmployerForm } from '../types'

interface Props { form: EmployerForm; onChange: (field: keyof EmployerForm, value: string) => void }

const UploadField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
    <label style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{label}</label>
    <label style={{
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      height:'110px', border:'1.5px dashed rgba(255,255,255,0.25)', borderRadius:'10px',
      background: value ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
      cursor:'pointer', gap:'8px',
    }}>
      <input type="file" accept="image/*,.pdf" style={{ display:'none' }}
        onChange={(e) => { if (e.target.files?.[0]) onChange(e.target.files[0].name) }} />
      {value
        ? <><span style={{ fontSize:'24px' }}>✅</span><span style={{ fontSize:'12px', color:'#6ee7b7' }}>{value}</span></>
        : <><span style={{ fontSize:'24px' }}>📎</span><span style={{ fontSize:'12px', color:'rgba(255,255,255,0.5)' }}>Tap to upload — JPG, PNG or PDF</span></>
      }
    </label>
  </div>
)

const EmployerStage5Uploads = ({ form, onChange }: Props) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
    <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
      Upload your company's Certificate of Incorporation and TPIN document.
    </p>
    <UploadField label="Certificate of Incorporation" value={form.certificateUrl} onChange={(v) => onChange('certificateUrl', v)} />
    <UploadField label="TPIN Document"                value={form.tpinDocUrl}     onChange={(v) => onChange('tpinDocUrl',     v)} />
  </div>
)

export default EmployerStage5Uploads