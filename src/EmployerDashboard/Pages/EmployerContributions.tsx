import { useState, useMemo } from 'react'

import {
  BsBuilding, BsDownload, BsCheckCircleFill,
  BsPeopleFill, BsCurrencyDollar, BsCalendar3,
  BsSearch, BsCheckAll, BsSendFill,
} from 'react-icons/bs'
import { FaUniversity, FaMobileAlt } from 'react-icons/fa'
import { MdCreditCard, MdReceipt } from 'react-icons/md'
import './EmployerContributions.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employee {
  id:       string
  nhima_id: string
  name:     string
  position: string
  amount:   number
  status:   'paid' | 'pending' | 'overdue'
}

interface HistoryRecord {
  id:      string
  period:  string
  ref:     string
  total:   number
  count:   number
  status:  'paid' | 'pending'
}

type PayMethod = 'bank' | 'mobile' | 'card' | 'cheque'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', nhima_id: 'NHM-MEM-000021', name: 'James Mwale',    position: 'Accountant',       amount: 3200, status: 'pending' },
  { id: '2', nhima_id: 'NHM-MEM-000034', name: 'Grace Banda',    position: 'HR Manager',        amount: 4500, status: 'pending' },
  { id: '3', nhima_id: 'NHM-MEM-000047', name: 'Peter Tembo',    position: 'IT Officer',        amount: 3800, status: 'overdue' },
  { id: '4', nhima_id: 'NHM-MEM-000058', name: 'Rose Phiri',     position: 'Driver',            amount: 2200, status: 'pending' },
  { id: '5', nhima_id: 'NHM-MEM-000062', name: 'David Lungu',    position: 'Security Officer',  amount: 2000, status: 'paid'    },
  { id: '6', nhima_id: 'NHM-MEM-000071', name: 'Mary Sakala',    position: 'Secretary',         amount: 2800, status: 'pending' },
  { id: '7', nhima_id: 'NHM-MEM-000083', name: 'John Zulu',      position: 'Finance Manager',   amount: 5200, status: 'pending' },
  { id: '8', nhima_id: 'NHM-MEM-000095', name: 'Alice Kabwe',    position: 'Nurse',             amount: 3500, status: 'overdue' },
]

const MOCK_HISTORY: HistoryRecord[] = [
  { id: '1', period: 'May 2026',   ref: 'REF-20260501-ABC', total: 27200, count: 8, status: 'paid'    },
  { id: '2', period: 'April 2026', ref: 'REF-20260401-ABC', total: 27200, count: 8, status: 'paid'    },
  { id: '3', period: 'March 2026', ref: 'REF-20260301-ABC', total: 25800, count: 8, status: 'paid'    },
  { id: '4', period: 'Feb 2026',   ref: 'REF-20260201-ABC', total: 25800, count: 8, status: 'paid'    },
  { id: '5', period: 'Jan 2026',   ref: 'REF-20260101-ABC', total: 24500, count: 7, status: 'paid'    },
]

const PAY_METHODS: { id: PayMethod; icon: string; name: string; desc: string }[] = [
  { id: 'bank',   icon: '🏦', name: 'Bank Transfer', desc: 'Direct EFT'         },
  { id: 'mobile', icon: '📱', name: 'Mobile Money',  desc: 'Airtel · MTN · Zamtel' },
  { id: 'card',   icon: '💳', name: 'Card Payment',  desc: 'Visa / Mastercard'  },
  { id: 'cheque', icon: '📄', name: 'Cheque',        desc: 'Crossed cheque'     },
]

const fmtZMW = (n: number) =>
  `ZMW ${n.toLocaleString('en-ZM', { minimumFractionDigits: 2 })}`

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

// ─── Component ────────────────────────────────────────────────────────────────

const EmployerContributions = () => {
  const [period,     setPeriod]     = useState('2026-06')
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<Set<string>>(new Set())
  const [amounts,    setAmounts]    = useState<Record<string, number>>(
    Object.fromEntries(MOCK_EMPLOYEES.map(e => [e.id, e.amount]))
  )
  const [payMethod,  setPayMethod]  = useState<PayMethod>('bank')
  const [submitted,  setSubmitted]  = useState(false)
  const [activeTab,  setActiveTab]  = useState<'pay' | 'history'>('pay')

  const filtered = useMemo(() =>
    MOCK_EMPLOYEES.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.nhima_id.toLowerCase().includes(search.toLowerCase())
    ), [search])

  const unpaid = filtered.filter(e => e.status !== 'paid')

  const toggleAll = () => {
    if (selected.size === unpaid.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(unpaid.map(e => e.id)))
    }
  }

  const toggleOne = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  const totalSelected = Array.from(selected).reduce(
    (sum, id) => sum + (amounts[id] ?? 0), 0
  )

  const totalEmployees  = MOCK_EMPLOYEES.length
  const paidCount       = MOCK_EMPLOYEES.filter(e => e.status === 'paid').length
  const pendingCount    = MOCK_EMPLOYEES.filter(e => e.status === 'pending').length
  const overdueCount    = MOCK_EMPLOYEES.filter(e => e.status === 'overdue').length
  const totalThisMonth  = MOCK_EMPLOYEES.reduce((s, e) => s + e.amount, 0)

  const handleSubmit = () => {
    if (!selected.size) return
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 4000)
    setSelected(new Set())
  }

  return (
    <div className="emp-contributions animate-fade-in">

      {/* ── Hero ── */}
      <div className="contrib-hero">
        <div className="contrib-hero__left">
          <p className="contrib-hero__eyebrow">NHIMA Contributions</p>
          <h1 className="contrib-hero__title">Bulk Employee Payment</h1>
          <p className="contrib-hero__subtitle">
            Zambia National Bank · TPIN: 1001234567
          </p>
        </div>
        <div className="contrib-hero__stats">
          <div className="contrib-hero__stat">
            <p className="contrib-hero__stat-value">{totalEmployees}</p>
            <p className="contrib-hero__stat-label">Employees</p>
          </div>
          <div className="contrib-hero__stat">
            <p className="contrib-hero__stat-value">{fmtZMW(totalThisMonth)}</p>
            <p className="contrib-hero__stat-label">Due This Month</p>
          </div>
          <div className="contrib-hero__stat">
            <p className="contrib-hero__stat-value">{paidCount}/{totalEmployees}</p>
            <p className="contrib-hero__stat-label">Paid</p>
          </div>
        </div>
      </div>

      {/* ── Summary cards ── */}
      <div className="summary-cards">
        {[
          { label: 'Total Due',       value: fmtZMW(totalThisMonth), bar: 'gold'  },
          { label: 'Employees Paid',  value: `${paidCount} of ${totalEmployees}`,  bar: 'green' },
          { label: 'Pending',         value: `${pendingCount} employees`,           bar: 'amber' },
          { label: 'Overdue',         value: `${overdueCount} employees`,           bar: 'navy'  },
        ].map(c => (
          <div key={c.label} className="summary-card">
            <div className={`summary-card__bar summary-card__bar--${c.bar}`} />
            <p className="summary-card__value">{c.value}</p>
            <p className="summary-card__label">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0' }}>
        {(['pay', 'history'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '0.625rem 1.25rem',
            fontSize: '0.875rem',
            fontWeight: 600,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderBottom: activeTab === tab ? '2px solid #f5a623' : '2px solid transparent',
            color: activeTab === tab ? '#f5a623' : '#64748b',
            marginBottom: '-1px',
            transition: 'all 0.15s',
          }}>
            {tab === 'pay' ? '💳 Make Payment' : '📋 Payment History'}
          </button>
        ))}
      </div>

      {activeTab === 'pay' && (
        <>
          {/* ── Employee table ── */}
          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">Select Employees to Pay</p>
                <p className="panel__subtitle">Choose employees and confirm amounts for {period}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Period */}
                <div className="period-bar">
                  <label>Period</label>
                  <input type="month" value={period} onChange={e => setPeriod(e.target.value)} />
                </div>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                  <BsSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }} />
                  <input
                    placeholder="Search employee…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ paddingLeft: '2rem', paddingRight: '0.875rem', paddingTop: '0.5rem', paddingBottom: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '0.625rem', fontSize: '0.8rem', outline: 'none', width: '180px' }}
                  />
                </div>
              </div>
            </div>

            <div className="emp-table-wrap">
              <table className="emp-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input type="checkbox" className="row-check"
                        checked={selected.size === unpaid.length && unpaid.length > 0}
                        onChange={toggleAll} />
                    </th>
                    <th>Employee</th>
                    <th>NHIMA ID</th>
                    <th>Position</th>
                    <th>Amount (ZMW)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(emp => (
                    <tr key={emp.id} style={{ opacity: emp.status === 'paid' ? 0.5 : 1 }}>
                      <td>
                        <input type="checkbox" className="row-check"
                          disabled={emp.status === 'paid'}
                          checked={selected.has(emp.id)}
                          onChange={() => toggleOne(emp.id)} />
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <span className="emp-avatar">{initials(emp.name)}</span>
                          <div>
                            <p className="emp-name">{emp.name}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#94a3b8' }}>{emp.nhima_id}</td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>{emp.position}</td>
                      <td>
                        <input
                          type="number"
                          className="amount-input"
                          value={amounts[emp.id] ?? emp.amount}
                          disabled={emp.status === 'paid'}
                          onChange={e => setAmounts(prev => ({ ...prev, [emp.id]: Number(e.target.value) }))}
                        />
                      </td>
                      <td>
                        <span className={`status-pill status-pill--${emp.status}`}>
                          {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              <p className="table-footer__selected">
                {selected.size} of {unpaid.length} unpaid employees selected
              </p>
              <div className="table-footer__total">
                <span>Selected total: <strong>{fmtZMW(totalSelected)}</strong></span>
                <button className="btn-outline" onClick={toggleAll}>
                  <BsCheckAll style={{ marginRight: 4 }} />
                  {selected.size === unpaid.length ? 'Deselect All' : 'Select All Unpaid'}
                </button>
              </div>
            </div>
          </div>

          {/* ── Payment method ── */}
          <div className="panel">
            <div className="panel__header">
              <div>
                <p className="panel__title">Payment Method</p>
                <p className="panel__subtitle">How will you send this payment?</p>
              </div>
            </div>
            <div className="panel__body">
              <div className="pay-methods">
                {PAY_METHODS.map(m => (
                  <div
                    key={m.id}
                    className={`pay-method ${payMethod === m.id ? 'pay-method--active' : ''}`}
                    onClick={() => setPayMethod(m.id)}
                  >
                    <span className="pay-method__check">✓</span>
                    <span className="pay-method__icon">{m.icon}</span>
                    <p className="pay-method__name">{m.name}</p>
                    <p className="pay-method__desc">{m.desc}</p>
                  </div>
                ))}
              </div>

              {/* Bank transfer details */}
              {payMethod === 'bank' && (
                <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', background: '#f8fafc', borderRadius: '0.875rem', border: '1px solid #e2e8f0' }}>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bank Transfer Details</p>
                  {[
                    { label: 'Bank Name',    value: 'Zanaco Bank Zambia' },
                    { label: 'Account Name', value: 'NHIMA Contributions Account' },
                    { label: 'Account No.',  value: '1234567890123' },
                    { label: 'Branch Code',  value: '260001' },
                    { label: 'Reference',    value: `BULK-${period}-ZNB` },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.375rem 0', borderBottom: '1px solid #f1f5f9', fontSize: '0.825rem' }}>
                      <span style={{ color: '#94a3b8' }}>{r.label}</span>
                      <span style={{ fontWeight: 600, color: '#1e293b', fontFamily: r.label.includes('No') || r.label.includes('Code') || r.label.includes('Ref') ? 'monospace' : 'inherit' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Mobile money details */}
              {payMethod === 'mobile' && (
                <div style={{ marginTop: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem' }}>
                  {[
                    { name: 'Airtel Money', number: '*115#', color: '#dc2626', logo: '' },
                    { name: 'MTN MoMo',     number: '*176#', color: '#f59e0b', logo: '🟡' },
                    { name: 'Zamtel Kwacha',number: '*115#', color: '#16a34a', logo: '🟢' },
                  ].map(n => (
                    <div key={n.name} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '0.875rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '1.5rem' }}>{n.logo}</span>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', marginTop: '0.375rem' }}>{n.name}</p>
                      <p style={{ fontFamily: 'monospace', fontSize: '1rem', fontWeight: 800, color: n.color, marginTop: '0.25rem' }}>{n.number}</p>
                      <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '0.25rem' }}>Merchant: NHIMA</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Confirm bar ── */}
          {submitted ? (
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '1.25rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <BsCheckCircleFill style={{ color: '#16a34a', fontSize: '1.5rem', flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: 700, color: '#15803d' }}>Payment submitted successfully!</p>
                <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.2rem' }}>Your bulk contribution has been received. A receipt will be sent to your email.</p>
              </div>
            </div>
          ) : (
            <div className="pay-confirm">
              <div className="pay-confirm__info">
                <span>{selected.size} employees selected</span>
                <strong>{fmtZMW(totalSelected)}</strong>
                <span style={{ marginTop: '0.25rem', display: 'block' }}>Period: {period} · Method: {PAY_METHODS.find(m => m.id === payMethod)?.name}</span>
              </div>
              <button
                className="pay-confirm__btn"
                onClick={handleSubmit}
                disabled={!selected.size}
                style={{ opacity: !selected.size ? 0.5 : 1, cursor: !selected.size ? 'not-allowed' : 'pointer' }}
              >
                <BsSendFill />
                Submit Bulk Payment
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
              <p className="panel__title">Payment History</p>
              <p className="panel__subtitle">All bulk contribution records</p>
            </div>
            <button className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <BsDownload /> Export Statement
            </button>
          </div>
          <div className="panel__body" style={{ padding: '0 1.5rem' }}>
            {MOCK_HISTORY.map(h => (
              <div key={h.id} className="history-row">
                <div className="history-row__left">
                  <span className="history-row__period">{h.period}</span>
                  <span className="history-row__ref">{h.ref}</span>
                </div>
                <div className="history-row__right">
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{h.count} employees</span>
                  <span className="history-row__amount">{fmtZMW(h.total)}</span>
                  <span className={`status-pill status-pill--${h.status}`}>
                    {h.status === 'paid' ? 'Paid' : 'Pending'}
                  </span>
                  <button className="history-row__download">
                    <BsDownload style={{ marginRight: 4 }} /> Receipt
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

export default EmployerContributions
