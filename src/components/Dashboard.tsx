import { useApplicoStore } from "../store/applicoStore";
import { ApplicationStatus } from "../types";
import { Link } from "react-router-dom";

const STATUS_BADGES: Record<ApplicationStatus, string> = {
  Applied: "bg-blue-100 text-blue-800",
  Interviewing: "bg-yellow-100 text-yellow-800",
  Offer: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const applications = useApplicoStore((s) => s.applications);

  const counts = {
    Applied: applications.filter((a) => a.status === "Applied").length,
    Interviewing: applications.filter((a) => a.status === "Interviewing").length,
    Offer: applications.filter((a) => a.status === "Offer").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const recent = [...applications]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const total = applications.length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Dashboard</h2>
        <p className="text-navy-600 mt-1">Overview of your job search progress</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Applied" count={counts.Applied} color="bg-blue-500" total={total} />
        <StatCard label="Interviewing" count={counts.Interviewing} color="bg-yellow-500" total={total} />
        <StatCard label="Offer" count={counts.Offer} color="bg-green-500" total={total} />
        <StatCard label="Rejected" count={counts.Rejected} color="bg-red-500" total={total} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Recent Applications</h3>
            <Link to="/applications" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">
              View all &rarr;
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="text-navy-400 text-sm py-4">No applications yet. Start tracking your job search!</p>
          ) : (
            <div className="space-y-3">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-navy-900 truncate">{app.company}</p>
                    <p className="text-xs text-navy-500 truncate">{app.role}</p>
                  </div>
                  <span className={`ml-3 px-2.5 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${STATUS_BADGES[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/applications"
              className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Add Application</p>
                <p className="text-xs text-navy-500">Track a new job application</p>
              </div>
            </Link>
            <Link
              to="/cv-manager"
              className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Upload CV</p>
                <p className="text-xs text-navy-500">Add or manage your CVs</p>
              </div>
            </Link>
          </div>

          {total > 0 && (
            <div className="mt-6 pt-4 border-t border-navy-100">
              <div className="flex justify-between text-sm text-navy-600 mb-2">
                <span>Response Rate</span>
                <span className="font-medium">
                  {Math.round(((counts.Interviewing + counts.Offer + counts.Rejected) / total) * 100)}%
                </span>
              </div>
              <div className="w-full bg-navy-100 rounded-full h-2">
                <div
                  className="bg-navy-600 h-2 rounded-full transition-all"
                  style={{ width: `${((counts.Interviewing + counts.Offer + counts.Rejected) / total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-navy-600 mt-3 mb-2">
                <span>Offer Rate</span>
                <span className="font-medium">{Math.round((counts.Offer / total) * 100)}%</span>
              </div>
              <div className="w-full bg-navy-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(counts.Offer / total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, count, color, total }: { label: string; count: number; color: string; total: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-5">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm font-medium text-navy-600">{label}</span>
      </div>
      <p className="text-3xl font-bold text-navy-900 mt-2">{count}</p>
      {total > 0 && <p className="text-xs text-navy-400 mt-1">{Math.round((count / total) * 100)}% of total</p>}
    </div>
  );
}
