import { useState } from 'react'
import { BsDownload, BsCheckCircleFill, BsSendFill } from 'react-icons/bs'
import './MemberContributions.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

type PayMethod = 'mobile' | 'bank' | 'card' | 'ussd'
type Network   = 'airtel' | 'mtn' | 'zamtel'

interface HistoryRecord {
  id:     string
  period: string
  ref:    string
  amount: number
  method: string
  status: 'paid' | 'pending' | 'overdue'
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HISTORY: HistoryRecord[] = [
  { id: '1', period: 'May 2026',   ref: 'REF-20260501-MEM', amount: 3200, method: 'Mobile Money', status: 'paid'    },
  { id: '2', period: 'April 2026', ref: 'REF-20260401-MEM', amount: 3200, method: 'Bank Transfer', status: 'paid'   },
  { id: '3', period: 'March 2026', ref: 'REF-20260301-MEM', amount: 3200, method: 'Mobile Money', status: 'paid'    },
  { id: '4', period: 'Feb 2026',   ref: 'REF-20260201-MEM', amount: 3000, method: 'Card Payment',  status: 'paid'   },
  { id: '5', period: 'Jan 2026',   ref: 'REF-20260101-MEM', amount: 3000, method: 'Mobile Money', status: 'overdue' },
]

const QUICK_AMOUNTS = [1000, 2000, 3000, 3200, 5000]

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

// ─── Component ────────────────────────────────────────────────────────────────

const MemberContributions = () => {
  const [activeTab,  setActiveTab]  = useState<'pay' | 'history'>('pay')
  const [payMethod,  setPayMethod]  = useState<PayMethod>('mobile')
  const [network,    setNetwork]    = useState<Network>('airtel')
  const [amount,     setAmount]     = useState<string>('3200')
  const [phone,      setPhone]      = useState('')
  const [period,     setPeriod]     = useState('2026-06')
  const [submitted,  setSubmitted]  = useState(false)

  const totalPaid    = MOCK_HISTORY.filter(h => h.status === 'paid').reduce((s, h) => s + h.amount, 0)
  const lastPayment  = MOCK_HISTORY[0]
  const overdueCount = MOCK_HISTORY.filter(h => h.status === 'overdue').length

  const handlePay = () => {
    if (!amount || Number(amount) <= 0) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
  }

  const PAY_METHODS: { id: PayMethod; icon: string; name: string; sub: string }[] = [
    { id: 'mobile', icon: '📱', name: 'Mobile Money',  sub: 'Airtel · MTN · Zamtel' },
    { id: 'bank',   icon: '🏦', name: 'Bank Transfer', sub: 'EFT / RTGS'            },
    { id: 'card',   icon: '💳', name: 'Card Payment',  sub: 'Visa / Mastercard'     },
    { id: 'ussd',   icon: '🔢', name: 'USSD',          sub: 'No internet needed'    },
  ]

  const NETWORKS: { id: Network; logo: string; name: string; ussd: string; color: string }[] = [
    { id: 'airtel', logo: '🔴', name: 'Airtel Money',  ussd: '*115#', color: '#dc2626' },
    { id: 'mtn',    logo: '🟡', name: 'MTN MoMo',      ussd: '*176#', color: '#f59e0b' },
    { id: 'zamtel', logo: '🟢', name: 'Zamtel Kwacha', ussd: '*115#', color: '#16a34a' },
  ]

  return (
    <div className="member-contributions animate-fade-in">

      {/* ── Hero ── */}
      <div className="contrib-hero">
        <div className="contrib-hero__left">
          <p className="contrib-hero__eyebrow">My NHIMA Contributions</p>
          <h1 className="contrib-hero__title">Pay at Your Own Time</h1>
          <p className="contrib-hero__subtitle">
            Robert F. Mumba · NHM-MEM-000034 · Zambia National Bank
          </p>
        </div>
        <div className="contrib-hero__badge">
          <p className="contrib-hero__badge-value">{fmtZMW(totalPaid)}</p>
          <p className="contrib-hero__badge-label">Total Paid All Time</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-strip">
        {[
          { label: 'Monthly Contribution',  value: 'ZMW 3,200.00',                                   accent: 'gold'  },
          { label: 'Last Payment',          value: lastPayment?.period ?? '—',                        accent: 'green' },
          { label: 'Months Paid',           value: `${MOCK_HISTORY.filter(h => h.status === 'paid').length} months`, accent: 'amber' },
          { label: 'Overdue',               value: overdueCount > 0 ? `${overdueCount} month(s)` : 'None', accent: 'red' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__accent stat-card__accent--${s.accent}`} />
            <p className="stat-card__value">{s.value}</p>
            <p className="stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0' }}>
        {(['pay', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.625rem 1.25rem', fontSize: '0.875rem', fontWeight: 600,
            background: 'none', border: 'none', cursor: 'pointer',
            borderBottom: activeTab === tab ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab === tab ? '#f5a623' : '#64748b',
            marginBottom: '-1px', transition: 'all 0.15s',
          }}>
            {tab === 'pay' ? '💳 Make Payment' : '📋 My History'}
          </button>
        ))}
      </div>

      {activeTab === 'pay' && (
        <>
          {/* ── Payment method ── */}
          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">Choose Payment Method</p>
                <p className="panel__subtitle">All major payment options supported in Zambia</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>Period</label>
                <input type="month" value={period} onChange={e => setPeriod(e.target.value)}
                  style={{ padding: '0.5rem 0.875rem', border: '1px solid #e2e8f0', borderRadius: '0.625rem', fontSize: '0.8rem', outline: 'none' }} />
              </div>
            </div>

            <div className="panel__body">
              <div className="method-grid">
                {PAY_METHODS.map(m => (
                  <div
                    key={m.id}
                    className={`method-card ${payMethod === m.id ? 'method-card--active' : ''}`}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <span className="method-card__check">✓</span>
                    <span className="method-card__icon">{m.icon}</span>
                    <p className="method-card__name">{m.name}</p>
                    <p className="method-card__sub">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* ── Mobile Money ── */}
              {payMethod === 'mobile' && (
                <>
                  <div className="network-grid">
                    {NETWORKS.map(n => (
                      <div
                        key={n.id}
                        className={`network-btn network-btn--${n.id} ${network === n.id ? 'network-btn--active' : ''}`}
                        onClick={() => setNetwork(n.id)}
                      >
                        <span className="network-btn__logo">{n.logo}</span>
                        <p className="network-btn__name">{n.name}</p>
                        <p className="network-btn__ussd" style={{ color: n.color }}>{n.ussd}</p>
                      </div>
                    ))}
                  </div>

                  <div className="amount-section" style={{ marginTop: '1.25rem' }}>
                    <span className="amount-section__label">Amount to Pay</span>
                    <div className="amount-section__wrap">
                      <span className="amount-section__currency">ZMW</span>
                      <input
                        type="number"
                        className="amount-section__input"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="amount-section__quick">
                      {QUICK_AMOUNTS.map(a => (
                        <button key={a} className="amount-section__quick-btn" onClick={() => setAmount(String(a))}>
                          {fmtZMW(a)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="phone-input">
                    <label>Mobile Money Number</label>
                    <div className="phone-input__wrap">
                      <span className="phone-input__prefix">+260</span>
                      <input
                        type="tel"
                        placeholder="971234567"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        maxLength={9}
                      />
                    </div>
                  </div>

                  {/* Step instructions */}
                  <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      How it works — {NETWORKS.find(n => n.id === network)?.name}
                    </p>
                    {[
                      `Dial ${NETWORKS.find(n => n.id === network)?.ussd} on your phone`,
                      'Select "Pay Bill" or "Business Pay"',
                      'Enter Merchant Code: 12345 (NHIMA)',
                      `Enter amount: ZMW ${Number(amount).toLocaleString()}`,
                      'Enter your PIN to confirm',
                      'You will receive an SMS confirmation',
                    ].map((step, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <span style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: '#0f1f3d', color: '#f5a623', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{step}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Bank Transfer ── */}
              {payMethod === 'bank' && (
                <>
                  <div className="amount-section" style={{ marginTop: '1.25rem' }}>
                    <span className="amount-section__label">Amount to Pay</span>
                    <div className="amount-section__wrap">
                      <span className="amount-section__currency">ZMW</span>
                      <input type="number" className="amount-section__input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="amount-section__quick">
                      {QUICK_AMOUNTS.map(a => (
                        <button key={a} className="amount-section__quick-btn" onClick={() => setAmount(String(a))}>{fmtZMW(a)}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bank Transfer Details</p>
                    {[
                      { label: 'Bank',         value: 'Zanaco Bank Zambia'             },
                      { label: 'Account Name', value: 'NHIMA Contributions Account'    },
                      { label: 'Account No.',  value: '1234567890123'                  },
                      { label: 'Branch Code',  value: '260001'                         },
                      { label: 'Reference',    value: `NHM-MEM-000034-${period}`       },
                    ].map(r => (
                      <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.825rem' }}>
                        <span style={{ color: '#94a3b8' }}>{r.label}</span>
                        <span style={{ fontWeight: 600, color: '#1e293b', fontFamily: ['Account No.', 'Branch Code', 'Reference'].includes(r.label) ? 'monospace' : 'inherit' }}>{r.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ── Card Payment ── */}
              {payMethod === 'card' && (
                <>
                  <div className="amount-section" style={{ marginTop: '1.25rem' }}>
                    <span className="amount-section__label">Amount to Pay</span>
                    <div className="amount-section__wrap">
                      <span className="amount-section__currency">ZMW</span>
                      <input type="number" className="amount-section__input" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
                    </div>
                    <div className="amount-section__quick">
                      {QUICK_AMOUNTS.map(a => (
                        <button key={a} className="amount-section__quick-btn" onClick={() => setAmount(String(a))}>{fmtZMW(a)}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    {[
                      { label: 'Card Number',  placeholder: '0000 0000 0000 0000', type: 'text'   },
                      { label: 'Card Holder',  placeholder: 'GRACE BANDA',          type: 'text'   },
                      { label: 'Expiry Date',  placeholder: 'MM/YY',                type: 'text'   },
                      { label: 'CVV',          placeholder: '•••',                  type: 'password'},
                    ].map(f => (
                      <div key={f.label} style={{ gridColumn: f.label === 'Card Number' || f.label === 'Card Holder' ? 'span 2' : 'span 1' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.375rem' }}>{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder}
                          style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '0.75rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }} />
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.25rem' }}>🔒</span>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Secured by 256-bit SSL encryption. Your card details are never stored.</span>
                  </div>
                </>
              )}

              {/* ── USSD ── */}
              {payMethod === 'ussd' && (
                <div style={{ marginTop: '1.25rem' }}>
                  <div style={{ background: '#0f1f3d', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: '#fff' }}>
                    <p style={{ fontSize: '0.75rem', color: '#f5a623', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Dial this code on any network</p>
                    <p style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'monospace', color: '#ffd07a', letterSpacing: '0.05em' }}>*344#</p>
                    <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>NHIMA Self-Service · No internet required</p>
                  </div>
                  <div style={{ marginTop: '1rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Steps</p>
                    {['Dial *344#', 'Select 1 — Make Contribution', `Enter your NHIMA ID: NHM-MEM-000034`, 'Enter amount and confirm PIN'].map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                        <span style={{ width: '1.25rem', height: '1.25rem', borderRadius: '50%', background: '#0f1f3d', color: '#f5a623', fontSize: '0.65rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                        <span style={{ fontSize: '0.8rem', color: '#475569' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Submit bar ── */}
          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <BsCheckCircleFill style={{ color: '#16a34a', fontSize: '1.5rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, color: '#15803d' }}>Payment initiated successfully!</p>
                <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.2rem' }}>
                  {payMethod === 'mobile' ? 'Check your phone for the payment prompt.' : 'Your contribution has been received. A receipt will be sent to your email.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="submit-bar">
              <div className="submit-bar__info">
                <span>Contributing for {period}</span>
                <strong>{amount ? fmtZMW(Number(amount)) : 'Enter amount'}</strong>
                <span style={{ marginTop: '0.25rem', display: 'block' }}>
                  {PAY_METHODS.find(m => m.id === payMethod)?.name}
                  {payMethod === 'mobile' ? ` · ${NETWORKS.find(n => n.id === network)?.name}` : ''}
                </span>
              </div>
              <button
                className="submit-bar__btn"
                onClick={handlePay}
                disabled={!amount || Number(amount) <= 0}
              >
                <BsSendFill />
                {payMethod === 'ussd' ? 'Got It' : 'Pay Now'}
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
              <p className="panel__title">My Contribution History</p>
              <p className="panel__subtitle">All your personal NHIMA payments</p>
            </div>
            <button className="btn-gold">
              <BsDownload /> Download Statement
            </button>
          </div>
          <div style={{ padding: '0 1.5rem' }}>
            {MOCK_HISTORY.map(h => (
              <div key={h.id} className="history-row">
                <div className="history-row__left">
                  <span className="history-row__period">{h.period}</span>
                  <span className="history-row__ref">{h.ref} · {h.method}</span>
                </div>
                <div className="history-row__right">
                  <span className="history-row__amount">{fmtZMW(h.amount)}</span>
                  <span className={`status-pill status-pill--${h.status}`}>
                    {h.status.charAt(0).toUpperCase() + h.status.slice(1)}
                  </span>
                  <button className="history-row__receipt">
                    <BsDownload size={11} /> Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default MemberContributions
