import { useState } from 'react'
import { MemberForm } from '../types'
import { StageInput } from '../StageInput'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface Props { form: MemberForm; onChange: (field: keyof MemberForm, value: string) => void }

const MemberStage6Password = ({ form, onChange }: Props) => {
  const [show1, setShow1] = useState(false)
  const [show2, setShow2] = useState(false)
  const match = form.password && form.confirmPassword && form.password === form.confirmPassword

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
      <p style={{ fontSize:'13px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 }}>
        Create a strong password to secure your NHIMA account.
      </p>
      <div style={{ position:'relative' }}>
        <StageInput label="Create Password" value={form.password}
          onChange={(e) => onChange('password', e.target.value)}
          type={show1 ? 'text' : 'password'} placeholder="••••••••" />
        <button type="button" onClick={() => setShow1(!show1)}
          style={{ position:'absolute', right:'14px', bottom:'14px', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)' }}>
          {show1 ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      <div style={{ position:'relative' }}>
        <StageInput label="Confirm Password" value={form.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          type={show2 ? 'text' : 'password'} placeholder="••••••••"
          error={form.confirmPassword && !match ? 'Passwords do not match' : undefined} />
        <button type="button" onClick={() => setShow2(!show2)}
          style={{ position:'absolute', right:'14px', bottom:'14px', background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,0.5)' }}>
          {show2 ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
        </button>
      </div>
      {match && (
        <p style={{ fontSize:'13px', color:'#6ee7b7' }}>✅ Passwords match</p>
      )}
    </div>
  )
}

export default MemberStage6Password