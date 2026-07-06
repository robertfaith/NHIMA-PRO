import { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label:    string
  error?:   string
}

interface SelectProps {
  label:    string
  error?:   string
  value:    string
  onChange: (v: string) => void
  options:  { value: string; label: string }[]
}

const baseInput: React.CSSProperties = {
  width:        '100%',
  height:       '50px',
  padding:      '0 16px',
  borderRadius: '10px',
  border:       '1px solid rgba(255,255,255,0.2)',
  background:   'rgba(255,255,255,0.1)',
  color:        '#fff',
  fontSize:     '14px',
  outline:      'none',
  fontFamily:   'Montserrat, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display:      'block',
  fontSize:     '12px',
  fontWeight:   600,
  color:        'rgba(255,255,255,0.7)',
  marginBottom: '6px',
  textTransform:'uppercase',
  letterSpacing:'0.05em',
}

export const StageInput = ({ label, error, ...props }: InputProps) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
    <label style={labelStyle}>{label}</label>
    <input style={{ ...baseInput, borderColor: error ? 'rgba(255,100,100,0.6)' : 'rgba(255,255,255,0.2)' }} {...props} />
    {error && <span style={{ fontSize:'12px', color:'#fca5a5' }}>{error}</span>}
  </div>
)

export const StageSelect = ({ label, error, value, onChange, options }: SelectProps) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
    <label style={labelStyle}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...baseInput, appearance:'none' }}
    >
      <option value="" style={{ background:'#14507D' }}>Select...</option>
      {options.map((o) => (
        <option key={o.value} value={o.value} style={{ background:'#14507D' }}>{o.label}</option>
      ))}
    </select>
    {error && <span style={{ fontSize:'12px', color:'#fca5a5' }}>{error}</span>}
  </div>
)