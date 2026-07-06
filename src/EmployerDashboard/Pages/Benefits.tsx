import { useCallback, useEffect, useState } from "react"
import { BsPlus, BsSearch, BsPencil, BsTrash, BsPersonCheck, BsX } from "react-icons/bs"
import './Beneficiaries.scss'

// ─── Types ────────────────────────────────────────────────────────
interface Member {
  id:        number
  nhima_id:  string
  firstname: string
  lastname:  string
}

interface Beneficiary {
  id:              number
  member_nhima_id: string
  firstname:       string
  lastname:        string
  relationship:    string
  dob:             string
  national_id:     string
}

// ─── Mock data ────────────────────────────────────────────────────
const MOCK_MEMBERS: Member[] = [
  { id: 1, nhima_id: "NHM-001", firstname: "James", lastname: "Mwale" },
  { id: 2, nhima_id: "NHM-002", firstname: "Grace", lastname: "Banda" },
  { id: 3, nhima_id: "NHM-003", firstname: "Peter", lastname: "Tembo" },
]

const MOCK_BENEFICIARIES: Beneficiary[] = [
  { id: 1, member_nhima_id: "NHM-001", firstname: "Alice",  lastname: "Mwale", relationship: "Spouse",  dob: "1988-04-12", national_id: "123456/78/1" },
  { id: 2, member_nhima_id: "NHM-001", firstname: "Liam",   lastname: "Mwale", relationship: "Child",   dob: "2010-09-05", national_id: ""            },
  { id: 3, member_nhima_id: "NHM-002", firstname: "Joseph", lastname: "Banda", relationship: "Parent",  dob: "1958-11-20", national_id: "987654/32/1" },
]

const RELATIONSHIPS = ["Spouse", "Child", "Parent", "Sibling", "Guardian", "Other"]

const emptyForm = (): Omit<Beneficiary, "id"> => ({
  member_nhima_id: "",
  firstname:       "",
  lastname:        "",
  relationship:    "",
  dob:             "",
  national_id:     "",
})

// ─── Beneficiary Modal ────────────────────────────────────────────
interface ModalProps {
  members:  Member[]
  initial:  Omit<Beneficiary, "id"> | null
  onSave:   (data: Omit<Beneficiary, "id">) => void
  onClose:  () => void
}

const BeneficiaryModal = ({ members, initial, onSave, onClose }: ModalProps) => {
  const [form,   setForm]   = useState<Omit<Beneficiary, "id">>(initial ?? emptyForm())
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Beneficiary, "id">, string>>>({})

  const set = (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const e: typeof errors = {}
    if (!form.member_nhima_id)  e.member_nhima_id = "Select a member"
    if (!form.firstname.trim()) e.firstname       = "First name is required"
    if (!form.lastname.trim())  e.lastname        = "Last name is required"
    if (!form.relationship)     e.relationship    = "Select a relationship"
    if (!form.dob)              e.dob             = "Date of birth is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => { if (validate()) onSave(form) }

  return (
    <div className="ben-modal-backdrop">
      <div className="ben-modal">

        {/* Header */}
        <div className="ben-modal__header">
          <div>
            <h2 className="ben-modal__title">
              {initial ? "Edit Beneficiary" : "Add Beneficiary"}
            </h2>
            <p className="ben-modal__subtitle">
              {initial
                ? "Update beneficiary details"
                : "Register a new beneficiary for a member"}
            </p>
          </div>
          <button className="ben-modal__close" onClick={onClose}>
            <BsX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="ben-modal__body">

          {/* Member select */}
          <div className="ben-field">
            <label className="ben-label">Member</label>
            <select
              value={form.member_nhima_id}
              onChange={set("member_nhima_id")}
              className={`ben-select ${errors.member_nhima_id ? "ben-select--error" : ""}`}
            >
              <option value="">Select member…</option>
              {members.map((m) => (
                <option key={m.id} value={m.nhima_id}>
                  {m.firstname} {m.lastname} — {m.nhima_id}
                </option>
              ))}
            </select>
            {errors.member_nhima_id && (
              <p className="ben-error">{errors.member_nhima_id}</p>
            )}
          </div>

          {/* Name row */}
          <div className="ben-grid-2">
            {(["firstname", "lastname"] as const).map((field) => (
              <div key={field} className="ben-field">
                <label className="ben-label">
                  {field === "firstname" ? "First Name" : "Last Name"}
                </label>
                <input
                  value={form[field]}
                  onChange={set(field)}
                  placeholder={field === "firstname" ? "e.g. Alice" : "e.g. Mwale"}
                  className={`ben-input ${errors[field] ? "ben-input--error" : ""}`}
                />
                {errors[field] && (
                  <p className="ben-error">{errors[field]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Relationship + DOB */}
          <div className="ben-grid-2">
            <div className="ben-field">
              <label className="ben-label">Relationship</label>
              <select
                value={form.relationship}
                onChange={set("relationship")}
                className={`ben-select ${errors.relationship ? "ben-select--error" : ""}`}
              >
                <option value="">Select…</option>
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              {errors.relationship && (
                <p className="ben-error">{errors.relationship}</p>
              )}
            </div>
            <div className="ben-field">
              <label className="ben-label">Date of Birth</label>
              <input
                type="date"
                value={form.dob}
                onChange={set("dob")}
                className={`ben-input ${errors.dob ? "ben-input--error" : ""}`}
              />
              {errors.dob && <p className="ben-error">{errors.dob}</p>}
            </div>
          </div>

          {/* NRC */}
          <div className="ben-field">
            <label className="ben-label">
              National ID (NRC){" "}
              <span className="ben-label--optional">— optional</span>
            </label>
            <input
              value={form.national_id}
              onChange={set("national_id")}
              placeholder="e.g. 123456/78/1"
              className="ben-input"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="ben-modal__footer">
          <button className="ben-btn ben-btn--ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="ben-btn ben-btn--primary" onClick={handleSubmit}>
            {initial ? "Save Changes" : "Add Beneficiary"}
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Delete Modal ─────────────────────────────────────────────────
const DeleteModal = ({
  beneficiary,
  onConfirm,
  onClose,
}: {
  beneficiary: Beneficiary
  onConfirm:   () => void
  onClose:     () => void
}) => (
  <div className="ben-modal-backdrop">
    <div className="ben-modal ben-modal--sm">
      <div className="ben-delete-icon">
        <BsTrash size={20} className="ben-delete-icon__svg" />
      </div>
      <h2 className="ben-delete-title">Remove Beneficiary</h2>
      <p className="ben-delete-desc">
        Are you sure you want to remove{" "}
        <strong>{beneficiary.firstname} {beneficiary.lastname}</strong>?
        This action cannot be undone.
      </p>
      <div className="ben-grid-2">
        <button className="ben-btn ben-btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button className="ben-btn ben-btn--danger" onClick={onConfirm}>
          Remove
        </button>
      </div>
    </div>
  </div>
)

// ─── Relationship badge ───────────────────────────────────────────
const BADGE_CLASSES: Record<string, string> = {
  Spouse:   "ben-badge--spouse",
  Child:    "ben-badge--child",
  Parent:   "ben-badge--parent",
  Sibling:  "ben-badge--sibling",
  Guardian: "ben-badge--guardian",
  Other:    "ben-badge--other",
}

const RelBadge = ({ rel }: { rel: string }) => (
  <span className={`ben-badge ${BADGE_CLASSES[rel] ?? BADGE_CLASSES.Other}`}>
    {rel}
  </span>
)

// ─── Beneficiary Card ─────────────────────────────────────────────
const BeneficiaryCard = ({
  beneficiary,
  memberName,
  onEdit,
  onDelete,
}: {
  beneficiary: Beneficiary
  memberName:  string
  onEdit:      () => void
  onDelete:    () => void
}) => (
  <div className="ben-card">

    {/* Top */}
    <div className="ben-card__top">
      <div className="ben-card__avatar-wrap">
        <div className="ben-card__avatar">
          {beneficiary.firstname[0]}{beneficiary.lastname[0]}
        </div>
        <div>
          <p className="ben-card__name">
            {beneficiary.firstname} {beneficiary.lastname}
          </p>
          <p className="ben-card__dob">
            DOB:{" "}
            {beneficiary.dob
              ? new Date(beneficiary.dob).toLocaleDateString("en-ZM", {
                  day: "2-digit", month: "short", year: "numeric",
                })
              : "—"}
          </p>
        </div>
      </div>
      <RelBadge rel={beneficiary.relationship} />
    </div>

    {/* Meta */}
    <div className="ben-card__meta">
      <div className="ben-card__meta-row">
        <span>Member</span>
        <span>{memberName}</span>
      </div>
      <div className="ben-card__meta-row">
        <span>NRC</span>
        <span>{beneficiary.national_id || "—"}</span>
      </div>
    </div>

    {/* Actions */}
    <div className="ben-card__actions">
      <button className="ben-card__action-btn ben-card__action-btn--edit" onClick={onEdit}>
        <BsPencil size={13} /> Edit
      </button>
      <button className="ben-card__action-btn ben-card__action-btn--delete" onClick={onDelete}>
        <BsTrash size={13} /> Remove
      </button>
    </div>

  </div>
)

// ─── Main Page ────────────────────────────────────────────────────
const Beneficiaries = () => {
  const [members,       setMembers]       = useState<Member[]>([])
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([])
  const [loading,       setLoading]       = useState(true)
  const [search,        setSearch]        = useState("")
  const [selectedMember,setSelectedMember]= useState("")
  const [showModal,     setShowModal]     = useState(false)
  const [editTarget,    setEditTarget]    = useState<Beneficiary | null>(null)
  const [deleteTarget,  setDeleteTarget]  = useState<Beneficiary | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setMembers(MOCK_MEMBERS)
    setBeneficiaries(MOCK_BENEFICIARIES)
    setLoading(false)
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const memberMap = Object.fromEntries(
    members.map((m) => [m.nhima_id, `${m.firstname} ${m.lastname}`])
  )

  const filtered = beneficiaries.filter((b) => {
    const fullName     = `${b.firstname} ${b.lastname}`.toLowerCase()
    const matchesSearch = fullName.includes(search.toLowerCase())
    const matchesMember = selectedMember ? b.member_nhima_id === selectedMember : true
    return matchesSearch && matchesMember
  })

  const handleAdd = (data: Omit<Beneficiary, "id">) => {
    setBeneficiaries((prev) => [...prev, { ...data, id: Date.now() }])
    setShowModal(false)
  }

  const handleEdit = (data: Omit<Beneficiary, "id">) => {
    if (!editTarget) return
    setBeneficiaries((prev) =>
      prev.map((b) => (b.id === editTarget.id ? { ...data, id: b.id } : b))
    )
    setEditTarget(null)
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setBeneficiaries((prev) => prev.filter((b) => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  return (
    <div className="animate-fade-in">

      {/* Header */}
      <div className="ben-page-header">
        <div>
          <h1 className="ben-page-title">Beneficiary Management</h1>
          <p className="ben-page-subtitle">
            Add and manage beneficiaries registered under NHIMA members
          </p>
        </div>
        <button className="ben-btn ben-btn--primary" onClick={() => setShowModal(true)}>
          <BsPlus size={18} /> Add Beneficiary
        </button>
      </div>

      {/* Stats strip */}
      <div className="ben-stats">
        {[
          { label: "Total Beneficiaries",        value: beneficiaries.length },
          { label: "Members with Beneficiaries", value: new Set(beneficiaries.map((b) => b.member_nhima_id)).size },
          { label: "Spouses",                    value: beneficiaries.filter((b) => b.relationship === "Spouse").length },
          { label: "Children",                   value: beneficiaries.filter((b) => b.relationship === "Child").length },
        ].map((s) => (
          <div key={s.label} className="ben-stat-card">
            <p className="ben-stat-card__value">{s.value}</p>
            <p className="ben-stat-card__label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="ben-filters">
        <div className="ben-search">
          <BsSearch className="ben-search__icon" />
          <input
            className="ben-search__input"
            placeholder="Search beneficiaries by name…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="ben-select ben-filter-select"
          value={selectedMember}
          onChange={(e) => setSelectedMember(e.target.value)}
        >
          <option value="">All Members</option>
          {members.map((m) => (
            <option key={m.id} value={m.nhima_id}>
              {m.firstname} {m.lastname} — {m.nhima_id}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="ben-loading">
          <div className="ben-spinner" />
        </div>
      ) : (
        <div className="ben-grid">
          {filtered.length === 0 ? (
            <div className="ben-empty">
              <BsPersonCheck size={36} className="ben-empty__icon" />
              <p className="ben-empty__title">No beneficiaries found</p>
              <p className="ben-empty__sub">
                {search || selectedMember
                  ? "Try adjusting your filters"
                  : 'Click "Add Beneficiary" to get started'}
              </p>
            </div>
          ) : (
            filtered.map((b) => (
              <BeneficiaryCard
                key={b.id}
                beneficiary={b}
                memberName={memberMap[b.member_nhima_id] ?? b.member_nhima_id}
                onEdit={()   => setEditTarget(b)}
                onDelete={()  => setDeleteTarget(b)}
              />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      {showModal && (
        <BeneficiaryModal
          members={members}
          initial={null}
          onSave={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* ✅ Edit modal — was broken before (rendered empty div) */}
      {editTarget && (
        <BeneficiaryModal
          members={members}
          initial={editTarget}
          onSave={handleEdit}
          onClose={() => setEditTarget(null)}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          beneficiary={deleteTarget}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}

    </div>
  )
}

export default Beneficiaries