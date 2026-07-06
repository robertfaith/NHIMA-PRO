import { useState } from 'react'
import {
  BsSendFill, BsDownload, BsCheckCircleFill,
  BsFileEarmarkMedicalFill, BsPlusCircle,
} from 'react-icons/bs'
import './MemberClaims.scss'

// ─── Types ────────────────────────────────────────────────────────
type ClaimTab   = 'submit' | 'history'
type ClaimType  = 'Outpatient' | 'Inpatient' | 'Maternity' | 'Dental' | 'Optical' | 'Emergency' | 'Chronic' | 'Surgical'

interface ClaimRecord {
  id:       string
  type:     ClaimType
  facility: string
  date:     string
  amount:   number
  approved: number
  status:   'approved' | 'pending' | 'rejected' | 'review' | 'paid'
  ref:      string
}

// ─── Mock data ────────────────────────────────────────────────────
const MOCK_CLAIMS: ClaimRecord[] = [
  { id: '1', type: 'Outpatient', facility: 'Kanyama Health Centre',   date: '12 May 2026',  amount: 850,   approved: 850,   status: 'paid',     ref: 'CLM-2026-000041' },
  { id: '2', type: 'Inpatient',  facility: 'University Teaching Hosp', date: '03 Apr 2026', amount: 12500, approved: 10000, status: 'approved',  ref: 'CLM-2026-000028' },
  { id: '3', type: 'Dental',     facility: 'Lusaka Dental Clinic',     date: '20 Mar 2026', amount: 2200,  approved: 0,     status: 'pending',   ref: 'CLM-2026-000019' },
  { id: '4', type: 'Maternity',  facility: 'Levy Mwanawasa Hospital',  date: '10 Jan 2026', amount: 5500,  approved: 5500,  status: 'paid',      ref: 'CLM-2026-000007' },
  { id: '5', type: 'Optical',    facility: 'Vision Plus Eye Centre',   date: '02 Dec 2025', amount: 1800,  approved: 0,     status: 'rejected',  ref: 'CLM-2025-000198' },
]

const CLAIM_TYPES: ClaimType[] = [
  'Outpatient', 'Inpatient', 'Maternity', 'Dental',
  'Optical', 'Emergency', 'Chronic', 'Surgical',
]

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

// ─── Component ────────────────────────────────────────────────────
const MemberClaims = () => {
  const [activeTab,  setActiveTab]  = useState<ClaimTab>('submit')
  const [claimType,  setClaimType]  = useState<ClaimType>('Outpatient')
  const [facility,   setFacility]   = useState('')
  const [dateOfService, setDateOfService] = useState('')
  const [amount,     setAmount]     = useState('')
  const [diagnosis,  setDiagnosis]  = useState('')
  const [notes,      setNotes]      = useState('')
  const [files,      setFiles]      = useState<string[]>([])
  const [submitted,  setSubmitted]  = useState(false)

  const totalClaimed  = MOCK_CLAIMS.reduce((s, c) => s + c.amount,    0)
  const totalApproved = MOCK_CLAIMS.reduce((s, c) => s + c.approved,  0)
  const pendingCount  = MOCK_CLAIMS.filter(c => c.status === 'pending' || c.status === 'review').length
  const rejectedCount = MOCK_CLAIMS.filter(c => c.status === 'rejected').length

  const handleSubmit = () => {
    if (!facility || !dateOfService || !amount) return
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setActiveTab('history') }, 3500)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files
    if (f) setFiles(prev => [...prev, ...Array.from(f).map(x => x.name)])
  }

  return (
    <div className="member-claims animate-fade-in">

      {/* ── Hero ── */}
      <div className="claims-hero">
        <div className="claims-hero__left">
          <p className="claims-hero__eyebrow">My NHIMA Claims</p>
          <h1 className="claims-hero__title">Submit & Track Claims</h1>
          <p className="claims-hero__subtitle">
            Grace Banda · NHM-MEM-000034 · Active Member
          </p>
        </div>
        <div className="claims-hero__badge">
          <p className="claims-hero__badge-value">{fmtZMW(totalApproved)}</p>
          <p className="claims-hero__badge-label">Total Benefits Received</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip">
        {[
          { label: 'Total Claims',    value: MOCK_CLAIMS.length,              accent: 'gold'  },
          { label: 'Total Claimed',   value: fmtZMW(totalClaimed),            accent: 'blue'  },
          { label: 'Pending Review',  value: `${pendingCount} claim(s)`,      accent: 'amber' },
          { label: 'Rejected',        value: rejectedCount > 0 ? `${rejectedCount} claim(s)` : 'None', accent: 'red' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display:'flex', gap:'0.5rem', borderBottom:'1px solid #e2e8f0' }}>
        {(['submit','history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding:'0.625rem 1.25rem', fontSize:'0.875rem', fontWeight:600,
            background:'none', border:'none', cursor:'pointer',
            borderBottom: activeTab===tab ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab===tab ? '#f5a623' : '#64748b',
            marginBottom:'-1px', transition:'all 0.15s',
          }}>
            {tab === 'submit' ? '📋 Submit Claim' : '🗂️ My Claims'}
          </button>
        ))}
      </div>

      {/* ── Submit tab ── */}
      {activeTab === 'submit' && (
        <>
          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">New Claim Submission</p>
                <p className="panel__subtitle">Fill in all required fields accurately</p>
              </div>
              <BsFileEarmarkMedicalFill style={{ color:'#f5a623', fontSize:'1.5rem' }} />
            </div>
            <div className="panel__body">
              <div className="form-grid">

                {/* Claim type */}
                <div className="form-field">
                  <label>Claim Type *</label>
                  <select value={claimType} onChange={e => setClaimType(e.target.value as ClaimType)}>
                    {CLAIM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Date of service */}
                <div className="form-field">
                  <label>Date of Service *</label>
                  <input type="date" value={dateOfService} onChange={e => setDateOfService(e.target.value)}
                    max={new Date().toISOString().split('T')[0]} />
                </div>

                {/* Facility */}
                <div className="form-field form-field--full">
                  <label>Health Facility *</label>
                  <input type="text" value={facility} onChange={e => setFacility(e.target.value)}
                    placeholder="e.g. Kanyama Health Centre, Lusaka" />
                  <span className="form-field__hint">Must be a NHIMA-accredited facility</span>
                </div>

                {/* Amount */}
                <div className="form-field">
                  <label>Total Bill Amount (ZMW) *</label>
                  <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                    placeholder="e.g. 2500.00" />
                </div>

                {/* Diagnosis */}
                <div className="form-field">
                  <label>Diagnosis / Condition</label>
                  <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Malaria, Hypertension" />
                </div>

                {/* Notes */}
                <div className="form-field form-field--full">
                  <label>Additional Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Any additional information about the treatment…" />
                </div>

              </div>

              {/* Document upload */}
              <div style={{ marginTop:'1.25rem' }}>
                <label style={{ fontSize:'0.8rem', fontWeight:700, color:'#475569', display:'block', marginBottom:'0.625rem' }}>
                  Supporting Documents *
                </label>
                <label className={`upload-box ${files.length > 0 ? 'upload-box--filled' : ''}`}>
                  <input type="file" multiple accept="image/*,.pdf" onChange={handleFileUpload} />
                  <span className="upload-box__icon">{files.length > 0 ? '✅' : '📎'}</span>
                  <p className="upload-box__label">
                    {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload documents'}
                  </p>
                  <p className="upload-box__sub">
                    {files.length > 0
                      ? files.join(', ')
                      : 'Medical invoice, prescription, referral letter — JPG, PNG or PDF'}
                  </p>
                </label>
              </div>

              {/* Required docs checklist */}
              <div style={{ marginTop:'1rem', padding:'1rem 1.25rem', background:'#f8fafc', borderRadius:'0.875rem', border:'1px solid #e2e8f0' }}>
                <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#64748b', marginBottom:'0.625rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  Required Documents Checklist
                </p>
                {[
                  'Original medical invoice / receipt from facility',
                  'Doctor\'s prescription or referral letter',
                  'Completed NHIMA claim form (if inpatient)',
                  'Copy of your NRC or NHIMA membership card',
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.625rem', marginBottom:'0.375rem' }}>
                    <BsPlusCircle style={{ color:'#f5a623', fontSize:'0.875rem', flexShrink:0 }} />
                    <span style={{ fontSize:'0.8rem', color:'#475569' }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Submit bar / success */}
          {submitted ? (
            <div style={{ background:'#f0fdf4', border:'1px solid #86efac', borderRadius:'1.25rem', padding:'1.25rem 1.5rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
              <BsCheckCircleFill style={{ color:'#16a34a', fontSize:'1.5rem', flexShrink:0 }} />
              <div>
                <p style={{ fontWeight:700, color:'#15803d' }}>Claim submitted successfully!</p>
                <p style={{ fontSize:'0.8rem', color:'#16a34a', marginTop:'0.2rem' }}>
                  Your claim has been received and is under review. You will be notified via SMS and email.
                </p>
              </div>
            </div>
          ) : (
            <div className="submit-bar">
              <div className="submit-bar__info">
                <span>Submitting {claimType} claim</span>
                <strong>{amount ? fmtZMW(Number(amount)) : 'Enter amount'}</strong>
                <span style={{ marginTop:'0.25rem', display:'block' }}>{facility || 'Enter facility name'}</span>
              </div>
              <button
                className="submit-bar__btn"
                onClick={handleSubmit}
                disabled={!facility || !dateOfService || !amount}
              >
                <BsSendFill /> Submit Claim
              </button>
            </div>
          )}
        </>
      )}

      {/* ── History tab ── */}
      {activeTab === 'history' && (
        <div className="panel">
          <div className="panel__header">
            <div>
              <p className="panel__title">My Claims History</p>
              <p className="panel__subtitle">All submitted NHIMA claims</p>
            </div>
            <button className="btn-gold">
              <BsDownload /> Download
            </button>
          </div>
          <div style={{ padding:'0 1.5rem' }}>
            {MOCK_CLAIMS.map(c => (
              <div key={c.id} className="claim-row">
                <div className="claim-row__left">
                  <span className="claim-row__type">{c.type} — {c.facility}</span>
                  <span className="claim-row__meta">{c.ref} · {c.date}</span>
                </div>
                <div className="claim-row__right">
                  <span className="claim-row__amount">{fmtZMW(c.amount)}</span>
                  <span className={`status-pill status-pill--${c.status}`}>
                    {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                  </span>
                  <button className="claim-row__view">View</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberClaims