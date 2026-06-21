import {
  BsArrow90DegRight,
  BsFileTextFill,
  BsPeopleFill,
  BsClipboardCheckFill,
} from 'react-icons/bs'

import {
  FaMoneyBill,
  FaFileInvoiceDollar,
  FaUserCheck,
  FaHospital,
} from 'react-icons/fa'

import { Link } from 'react-router-dom'
import './EmpDashboard.scss'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Employer {
  firstName?: string
  companyName?: string
  role?: string
}

interface DashboardData {
  employer?: Employer
  currentMonthContribution?: number
  totalEmployees?: number
  totalContributions?: number
  pendingEmployees?: number
  totalClaims?: number
  pendingClaims?: number
  totalBenefitsPaid?: number
  complianceStatus?: string
}

interface EmpDashboardProps {
  data: DashboardData
}

// ─── Component ────────────────────────────────────────────────────────────────

const EmpDashboard = ({ data }: EmpDashboardProps) => {
  const emp = data?.employer

  const cards = [
    {
      icon: FaMoneyBill,
      value: `ZMW ${data?.currentMonthContribution?.toLocaleString() || 0}`,
      title: 'Monthly Contributions',
      subtitle: 'Current Month',
    },
    {
      icon: BsPeopleFill,
      value: data?.totalEmployees || 0,
      title: 'Registered Employees',
      subtitle: 'Active Members',
    },
    {
      icon: FaFileInvoiceDollar,
      value: `ZMW ${data?.totalContributions?.toLocaleString() || 0}`,
      title: 'Total Contributions',
      subtitle: 'All Time',
    },
    {
      icon: FaUserCheck,
      value: data?.pendingEmployees || 0,
      title: 'Pending Employees',
      subtitle: 'Awaiting Approval',
    },
    {
      icon: BsClipboardCheckFill,
      value: data?.totalClaims || 0,
      title: 'Employee Claims',
      subtitle: 'Submitted Claims',
    },
    {
      icon: FaHospital,
      value: data?.pendingClaims || 0,
      title: 'Pending Claims',
      subtitle: 'Awaiting Processing',
    },
    {
      icon: FaMoneyBill,
      value: `ZMW ${data?.totalBenefitsPaid?.toLocaleString() || 0}`,
      title: 'Benefits Paid',
      subtitle: 'Medical Benefits',
    },
    {
      icon: BsFileTextFill,
      value: data?.complianceStatus || 'Compliant',
      title: 'Compliance Status',
      subtitle: 'NHIMA Standing',
    },
  ]

  return (
    <div className="emp-dashboard animate-fade-in">

      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">
          Welcome, {emp?.firstName || 'Employer'}!
        </h1>
        <p className="page-subtitle">
          {emp?.companyName || emp?.role || 'Employer Portal'}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        {cards.map((card, index) => (
          <div key={index} className="stat-card">
            <div className="stat-card__accent" />
            <div className="stat-card__body">
              <p className="stat-card__title">{card.title}</p>
              <p className="stat-card__value">{card.value}</p>
              <p className="stat-card__subtitle">{card.subtitle}</p>
            </div>
            <card.icon className="stat-card__icon" />
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link
          to="/dashboard/contributions"
          className="btn-primary"
        >
          Make Contributions
          <BsArrow90DegRight className="w-4 h-4" />
        </Link>
        <Link to="/dashboard/employees" className="btn-secondary">
          Manage Employees
        </Link>
        <Link to="/dashboard/claims" className="btn-secondary">
          View Claims
        </Link>
        <Link to="/dashboard/reports" className="btn-secondary">
          Generate Reports
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="activity-grid">

        {/* Recent Contributions */}
        <div className="activity-card">
          <h3 className="activity-card__title">Recent Contributions</h3>
          <div>
            {[
              { month: 'June 2026',  amount: 'ZMW 45,000' },
              { month: 'May 2026',   amount: 'ZMW 42,500' },
              { month: 'April 2026', amount: 'ZMW 40,200' },
            ].map((row) => (
              <div key={row.month} className="contribution-row">
                <span>{row.month}</span>
                <span>{row.amount}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="activity-card">
          <h3 className="activity-card__title">Pending Actions</h3>
          <ul className="pending-list">
            <li>Employees awaiting approval</li>
            <li>Outstanding contributions</li>
            <li>Claims requiring review</li>
            <li>Compliance verification due</li>
          </ul>
        </div>

      </div>
    </div>
  )
}

export default EmpDashboard
