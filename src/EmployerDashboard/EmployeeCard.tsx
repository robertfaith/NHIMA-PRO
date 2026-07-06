import { BsPencil, BsTrash } from "react-icons/bs"

// ─── Types ────────────────────────────────────────────────────────────────────

interface Beneficiary {
  id: number
  member_nhima_id: string
  firstname: string
  lastname: string
  relationship: string
  dob: string
  national_id: string
}

interface BeneficiaryCardProps {
  beneficiary: Beneficiary
  memberName: string
  onEdit: (beneficiary: Beneficiary) => void
  onDelete: (beneficiary: Beneficiary) => void
}

// ─── Relationship badge colours ───────────────────────────────────────────────

const BADGE_COLORS: Record<string, string> = {
  Spouse:   "bg-pink-100 text-pink-700",
  Child:    "bg-sky-100 text-sky-700",
  Parent:   "bg-amber-100 text-amber-700",
  Sibling:  "bg-violet-100 text-violet-700",
  Guardian: "bg-teal-100 text-teal-700",
  Other:    "bg-slate-100 text-slate-600",
}

// ─── Component ────────────────────────────────────────────────────────────────

const BeneficiaryCard = ({ beneficiary, memberName, onEdit, onDelete }: BeneficiaryCardProps) => {
  const initials = `${beneficiary.firstname[0]}${beneficiary.lastname[0]}`.toUpperCase()
  const badgeClass = BADGE_COLORS[beneficiary.relationship] ?? BADGE_COLORS.Other
  const formattedDob = beneficiary.dob
    ? new Date(beneficiary.dob).toLocaleDateString("en-ZM", { day: "2-digit", month: "short", year: "numeric" })
    : "—"

  return (
    <div className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">

      {/* Coloured top accent bar */}
      <div className="h-1 w-full bg-indigo-500" />

      <div className="p-5 flex flex-col gap-3">

        {/* Avatar + name + badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-indigo-700 font-semibold text-sm">{initials}</span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 leading-tight">
                {beneficiary.firstname} {beneficiary.lastname}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">DOB: {formattedDob}</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${badgeClass}`}>
            {beneficiary.relationship}
          </span>
        </div>

        {/* Meta details */}
        <div className="border-t border-slate-100 pt-3 space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Member</span>
            <span className="text-slate-700 font-medium">{memberName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">NRC</span>
            <span className="text-slate-700 font-medium">{beneficiary.national_id || "—"}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onEdit(beneficiary)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <BsPencil size={13} /> Edit
          </button>
          <button
            onClick={() => onDelete(beneficiary)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
          >
            <BsTrash size={13} /> Remove
          </button>
        </div>

      </div>
    </div>
  )
}

export default BeneficiaryCard
