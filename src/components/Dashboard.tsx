import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

interface Application {
  id: string;
  company: string;
  role: string;
  status: "Applied" | "Interviewing" | "Offer" | "Rejected";
  date: string;
  notes: string;
  cv_id: string | null;
}

interface CV {
  id: string;
  full_name: string;
  email: string;
  skills: string[];
  experience: unknown[];
}

export default function Dashboard({ userId }: { userId: string }) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [cv, setCv] = useState<CV | null>(null);
  const [suggestions, setSuggestions] = useState<Array<{ job_title: string; company: string; match_score: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    loadData();
  }, [userId]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [appsRes, cvsRes, suggRes] = await Promise.all([
        supabase.from("applications").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
        supabase.from("cvs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(1),
        supabase.from("job_suggestions").select("job_title, company, match_score").eq("user_id", userId).order("match_score", { ascending: false }).limit(3),
      ]);

      setApplications(appsRes.data || []);
      setCv(cvsRes.data?.[0] || null);
      setSuggestions(suggRes.data || []);

      const firstError = appsRes.error || cvsRes.error || suggRes.error;
      if (firstError) {
        console.error("Dashboard load warning:", firstError.message);
      }
    } catch (err: unknown) {
      console.error("Dashboard load error:", err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-navy-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
        {error}
      </div>
    );
  }

  const appCounts = {
    Applied: applications.filter((a) => a.status === "Applied").length,
    Interviewing: applications.filter((a) => a.status === "Interviewing").length,
    Offer: applications.filter((a) => a.status === "Offer").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const completionScore = cv ? calculateCompletion(cv) : 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Dashboard</h2>
        <p className="text-navy-600 mt-1">Build your CV and find your next opportunity</p>
      </div>

      {cv && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-navy-900">Your CV</h3>
            <Link to="/cv-editor" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">Edit CV &rarr;</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-navy-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-navy-900">{completionScore}%</p>
              <p className="text-xs text-navy-600">Complete</p>
            </div>
            <div className="p-3 bg-navy-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-navy-900">{cv.skills?.length || 0}</p>
              <p className="text-xs text-navy-600">Skills</p>
            </div>
            <div className="p-3 bg-navy-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-navy-900">{Array.isArray(cv.experience) ? cv.experience.length : 0}</p>
              <p className="text-xs text-navy-600">Experiences</p>
            </div>
            <div className="p-3 bg-navy-50 rounded-lg text-center">
              <p className="text-2xl font-bold text-navy-900">{applications.length}</p>
              <p className="text-xs text-navy-600">Applications</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/cv-builder" className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-navy-800 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div><p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Build CV from Scratch</p><p className="text-xs text-navy-500">Create a professional CV step by step</p></div>
            </Link>
            <Link to="/cv-editor" className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-navy-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <div><p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Edit Current CV</p><p className="text-xs text-navy-500">Update and refine your existing CV</p></div>
            </Link>
            <Link to="/social-import" className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
              </div>
              <div><p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Import from Social</p><p className="text-xs text-navy-500">Pull data from LinkedIn, GitHub, and more</p></div>
            </Link>
            <Link to="/job-matcher" className="flex items-center gap-3 p-4 rounded-lg border border-navy-100 hover:bg-navy-50 transition-colors group">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div><p className="text-sm font-medium text-navy-900 group-hover:text-navy-700">Find Jobs with AI</p><p className="text-xs text-navy-500">Get personalized job recommendations</p></div>
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          {suggestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-navy-900">Top Job Matches</h3>
                <Link to="/job-matcher" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">View all &rarr;</Link>
              </div>
              <div className="space-y-3">
                {suggestions.map((job, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-navy-50 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-navy-900 truncate">{job.job_title}</p>
                      <p className="text-xs text-navy-500">{job.company}</p>
                    </div>
                    <span className={`ml-3 px-2 py-0.5 text-xs font-medium rounded-full flex-shrink-0 ${job.match_score >= 90 ? "bg-green-100 text-green-800" : job.match_score >= 75 ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800"}`}>
                      {job.match_score}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-navy-900">Applications</h3>
              <Link to="/applications" className="text-sm font-medium text-navy-600 hover:text-navy-800 transition-colors">View all &rarr;</Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-center"><p className="text-xl font-bold text-blue-800">{appCounts.Applied}</p><p className="text-xs text-blue-600">Applied</p></div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center"><p className="text-xl font-bold text-yellow-800">{appCounts.Interviewing}</p><p className="text-xs text-yellow-600">Interviewing</p></div>
              <div className="p-3 bg-green-50 rounded-lg text-center"><p className="text-xl font-bold text-green-800">{appCounts.Offer}</p><p className="text-xs text-green-600">Offers</p></div>
              <div className="p-3 bg-red-50 rounded-lg text-center"><p className="text-xl font-bold text-red-800">{appCounts.Rejected}</p><p className="text-xs text-red-600">Rejected</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function calculateCompletion(cv: { full_name?: string; email?: string; phone?: string; summary?: string; skills?: string[]; experience?: unknown[]; education?: unknown[]; linkedin?: string; github?: string }): number {
  let score = 0;
  if (cv.full_name) score += 15;
  if (cv.email) score += 10;
  if (cv.phone) score += 5;
  if (cv.summary) score += 15;
  if (cv.skills && cv.skills.length > 0) score += 15;
  if (cv.experience && Array.isArray(cv.experience) && cv.experience.length > 0) score += 20;
  if (cv.education && Array.isArray(cv.education) && cv.education.length > 0) score += 10;
  if (cv.linkedin || cv.github) score += 10;
  return Math.min(score, 100);
}
