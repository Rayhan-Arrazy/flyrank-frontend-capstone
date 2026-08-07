import { useState } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { Application, ApplicationStatus } from "../types";

const STATUS_OPTIONS: ApplicationStatus[] = ["Applied", "Interviewing", "Offer", "Rejected"];
const STATUS_BADGES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-800",
  Interviewing: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function ApplicationTracker() {
  const { applications, savedCVs, addApplication, updateApplication, deleteApplication } = useApplicoStore();
  const [filter, setFilter] = useState<ApplicationStatus | "All">("All");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ company: "", role: "", status: "Applied" as ApplicationStatus, date: new Date().toISOString().split("T")[0], notes: "", coverLetter: "", cvIndex: "" });

  const filtered = filter === "All" ? applications : applications.filter((a) => a.status === filter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    const cv = form.cvIndex !== "" ? savedCVs[parseInt(form.cvIndex)] || null : null;
    if (editingId) {
      updateApplication(editingId, { ...form, cv });
      setEditingId(null);
    } else {
      addApplication({ ...form, cv });
    }
    setForm({ company: "", role: "", status: "Applied", date: new Date().toISOString().split("T")[0], notes: "", coverLetter: "", cvIndex: "" });
    setShowForm(false);
  };

  const handleEdit = (app: Application) => {
    setForm({ company: app.company, role: app.role, status: app.status, date: app.date, notes: app.notes, coverLetter: app.coverLetter, cvIndex: app.cv ? String(savedCVs.indexOf(app.cv)) : "" });
    setEditingId(app.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ company: "", role: "", status: "Applied", date: new Date().toISOString().split("T")[0], notes: "", coverLetter: "", cvIndex: "" });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">Application Tracker</h2>
          <p className="text-navy-600 mt-1">Manage and track all your job applications</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ company: "", role: "", status: "Applied", date: new Date().toISOString().split("T")[0], notes: "", coverLetter: "", cvIndex: "" }); }} className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors text-sm">
          {showForm ? "Cancel" : "+ Add Application"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Company</label>
              <input type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" required className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
              <input type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Job title" required className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as ApplicationStatus })} className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900">
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">Attach CV</label>
              <select value={form.cvIndex} onChange={(e) => setForm({ ...form, cvIndex: e.target.value })} className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900">
                <option value="">No CV</option>
                {savedCVs.map((cv, i) => <option key={i} value={i}>{cv.fullName || `CV ${i + 1}`}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." rows={3} className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300 resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors text-sm">{editingId ? "Update" : "Add"} Application</button>
            <button type="button" onClick={handleCancel} className="px-5 py-2.5 text-navy-700 bg-navy-50 font-medium rounded-lg hover:bg-navy-100 transition-colors text-sm">Cancel</button>
          </div>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {(["All", ...STATUS_OPTIONS] as const).map((status) => (
          <button key={status} onClick={() => setFilter(status)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filter === status ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"}`}>
            {status}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-navy-100">
          <p className="text-navy-500 text-lg">No applications found</p>
          <p className="text-navy-400 text-sm mt-1">Add your first application to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <ApplicationCard key={app.id} app={app} onEdit={() => handleEdit(app)} onDelete={() => deleteApplication(app.id)} onUpdateStatus={(status) => updateApplication(app.id, { status })} />
          ))}
        </div>
      )}
    </div>
  );
}

function ApplicationCard({ app, onEdit, onDelete, onUpdateStatus }: { app: Application; onEdit: () => void; onDelete: () => void; onUpdateStatus: (status: ApplicationStatus) => void }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-navy-900 truncate">{app.company}</h3>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${STATUS_BADGES[app.status]}`}>{app.status}</span>
            {app.cv && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">CV</span>}
          </div>
          <p className="text-navy-600 text-sm mt-1">{app.role}</p>
          <p className="text-navy-400 text-xs mt-1">{app.date}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <select value={app.status} onChange={(e) => onUpdateStatus(e.target.value as ApplicationStatus)} className="text-xs px-2 py-1.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-700">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => setExpanded(!expanded)} className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">{expanded ? "Less" : "More"}</button>
          <button onClick={onEdit} className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">Edit</button>
          <button onClick={onDelete} className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Delete</button>
        </div>
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-navy-100 space-y-3">
          {app.notes && <div><p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">Notes</p><p className="text-sm text-navy-700 whitespace-pre-wrap">{app.notes}</p></div>}
          {app.coverLetter && <div><p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">Cover Letter</p><p className="text-sm text-navy-700 whitespace-pre-wrap bg-navy-50 rounded-lg p-3">{app.coverLetter}</p></div>}
          {app.cv && <div><p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">Attached CV</p><p className="text-sm text-navy-700">{app.cv.fullName} &mdash; {app.cv.email}</p></div>}
        </div>
      )}
    </div>
  );
}
