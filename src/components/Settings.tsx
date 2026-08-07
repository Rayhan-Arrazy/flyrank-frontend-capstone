import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Settings() {
  const [counts, setCounts] = useState({ applications: 0, cvs: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCounts();
  }, []);

  const loadCounts = async () => {
    try {
      const [appsRes, cvsRes] = await Promise.all([
        supabase.from("applications").select("id", { count: "exact" }),
        supabase.from("cvs").select("id", { count: "exact" }),
      ]);
      setCounts({
        applications: appsRes.count || 0,
        cvs: cvsRes.count || 0,
      });
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }

  const handleClearData = async () => {
    if (!confirm("Are you sure you want to clear all data? This cannot be undone.")) return;
    try {
      await supabase.from("applications").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("job_suggestions").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      await supabase.from("cvs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
      window.location.reload();
    } catch {
      // silent
    }
  };

  const handleExportData = async () => {
    try {
      const [apps, cvs, sugg] = await Promise.all([
        supabase.from("applications").select("*"),
        supabase.from("cvs").select("*"),
        supabase.from("job_suggestions").select("*"),
      ]);
      const data = { applications: apps.data, cvs: cvs.data, job_suggestions: sugg.data };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "applico-data.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silent
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Settings</h2>
        <p className="text-navy-600 mt-1">Manage your data and preferences</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-6">
        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-navy-900">Data Summary</h3>
          {loading ? (
            <p className="text-sm text-navy-400">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-navy-900">{counts.applications}</p><p className="text-sm text-navy-600">Applications</p></div>
              <div className="p-4 bg-navy-50 rounded-lg"><p className="text-2xl font-bold text-navy-900">{counts.cvs}</p><p className="text-sm text-navy-600">Saved CVs</p></div>
            </div>
          )}
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-navy-900">Data Management</h3>
          <div className="flex gap-3">
            <button onClick={handleExportData} className="px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors">Export Data</button>
            <button onClick={handleClearData} className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">Clear All Data</button>
          </div>
        </section>
      </div>
    </div>
  );
}
