import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface CVRow {
  id: string;
  full_name: string;
  skills: string[];
  experience: unknown[];
}

interface JobSuggestion {
  id: string;
  job_title: string;
  company: string;
  match_score: number;
  reason: string;
}

interface MockJob {
  job_title: string;
  company: string;
  match_score: number;
  reason: string;
  location: string;
}

export default function JobMatcher({ userId }: { userId: string }) {
  const [cvs, setCvs] = useState<CVRow[]>([]);
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCVs, setLoadingCVs] = useState(true);
  const [minScore, setMinScore] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    loadCVs();
  }, [userId]);

  useEffect(() => {
    if (selectedCVId) {
      loadSuggestions(selectedCVId);
    }
  }, [selectedCVId]);

  const loadCVs = async () => {
    setLoadingCVs(true);
    try {
      const { data, error: fetchError } = await supabase
        .from("cvs")
        .select("id, full_name, skills, experience")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (fetchError) throw fetchError;
      setCvs(data || []);
      if (data && data.length > 0) {
        setSelectedCVId(data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load CVs");
    } finally {
      setLoadingCVs(false);
    }
  };

  const loadSuggestions = async (cvId: string) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("job_suggestions")
        .select("*")
        .eq("cv_id", cvId)
        .order("match_score", { ascending: false });
      if (fetchError) throw fetchError;
      setSuggestions(data || []);
    } catch {
      setSuggestions([]);
    }
  };

  const mockGenerateSuggestions = (cv: CVRow): MockJob[] => {
    const cvSkills = (cv.skills || []).map((s) => s.toLowerCase());
    const jobPool: MockJob[] = [
      { job_title: "Senior Software Engineer", company: "TechCorp Inc.", match_score: 95, reason: "Strong match with your React, TypeScript, and Node.js experience.", location: "San Francisco, CA" },
      { job_title: "Full Stack Developer", company: "StartupXYZ", match_score: 88, reason: "Your full-stack experience with modern frameworks matches perfectly.", location: "Remote" },
      { job_title: "Frontend Engineer", company: "DesignCo", match_score: 85, reason: "Excellent match for UI/UX skills and React expertise.", location: "New York, NY" },
      { job_title: "Technical Lead", company: "Enterprise Solutions", match_score: 82, reason: "Your management experience and technical depth make you ideal for this lead role.", location: "Austin, TX" },
      { job_title: "DevOps Engineer", company: "CloudFirst", match_score: 78, reason: "Your Docker, AWS, and CI/CD experience matches well.", location: "Seattle, WA" },
      { job_title: "Product Manager", company: "InnovateTech", match_score: 75, reason: "Your technical background and leadership experience translate well to PM role.", location: "Remote" },
      { job_title: "Data Engineer", company: "DataDriven Co.", match_score: 72, reason: "Your SQL and Python skills are relevant for this data-focused position.", location: "Chicago, IL" },
      { job_title: "Engineering Manager", company: "ScaleUp Inc.", match_score: 70, reason: "Your team leadership and project management experience align well.", location: "Denver, CO" },
      { job_title: "Solutions Architect", company: "ConsultPro", match_score: 68, reason: "Your broad technical knowledge and client-facing experience are relevant.", location: "Remote" },
      { job_title: "Mobile Developer", company: "AppWorks", match_score: 65, reason: "Your JavaScript background provides foundation for React Native development.", location: "Los Angeles, CA" },
    ];

    const scored = jobPool.map((job) => {
      let score = job.match_score;
      const jobDesc = job.reason.toLowerCase() + " " + job.job_title.toLowerCase();
      const matchingSkills = cvSkills.filter((s) => jobDesc.includes(s));
      score += matchingSkills.length * 3;
      return { ...job, match_score: Math.min(score, 99) };
    });

    scored.sort((a, b) => b.match_score - a.match_score);
    return scored;
  };

  const handleMatch = async () => {
    if (!selectedCVId) return;
    const cv = cvs.find((c) => c.id === selectedCVId);
    if (!cv) return;

    setIsLoading(true);
    setSuggestions([]);
    setError("");

    await new Promise((r) => setTimeout(r, 2000));

    try {
      const results = mockGenerateSuggestions(cv);

      await supabase.from("job_suggestions").delete().eq("cv_id", selectedCVId);

      const rows = results.map((r) => ({
        user_id: userId,
        cv_id: selectedCVId,
        job_title: r.job_title,
        company: r.company,
        match_score: r.match_score,
        reason: r.reason,
      }));

      const { error: insertError } = await supabase.from("job_suggestions").insert(rows);
      if (insertError) throw insertError;

      await loadSuggestions(selectedCVId);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSuggestions = suggestions.filter((s) => s.match_score >= minScore);

  if (loadingCVs) {
    return (
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-navy-600" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">AI Job Matcher</h2>
        <p className="text-navy-600 mt-1">Upload your CV and get AI-powered job recommendations</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">Select CV to Match</label>
          <div className="space-y-2">
            {cvs.map((cv) => (
              <label key={cv.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCVId === cv.id ? "border-navy-500 bg-navy-50" : "border-navy-200 hover:bg-navy-50"}`}>
                <input type="radio" name="cv" checked={selectedCVId === cv.id} onChange={() => setSelectedCVId(cv.id)} className="text-navy-600" />
                <div><p className="text-sm font-medium text-navy-900">{cv.full_name || "Untitled CV"}</p><p className="text-xs text-navy-500">{cv.skills?.length || 0} skills &middot; {Array.isArray(cv.experience) ? cv.experience.length : 0} experiences</p></div>
              </label>
            ))}
            {cvs.length === 0 && <p className="text-sm text-navy-400 py-2">No CVs available. Build or import a CV first.</p>}
          </div>
        </div>

        <button onClick={handleMatch} disabled={isLoading || !selectedCVId} className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
          {isLoading ? "Matching..." : "Find Matching Jobs"}
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}

      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-navy-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-navy-700 text-sm font-medium">AI is analyzing your profile...</span>
        </div>
      )}

      {suggestions.length > 0 && !isLoading && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-navy-900">Job Suggestions</h3>
              <span className="px-2.5 py-0.5 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">{filteredSuggestions.length} matches</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-xs text-navy-600">Min score:</label>
              <select value={minScore} onChange={(e) => setMinScore(parseInt(e.target.value))} className="px-2 py-1 border border-navy-200 rounded text-xs focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-700">
                <option value={0}>All</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredSuggestions.map((job) => (
              <div key={job.id} className="bg-white rounded-xl shadow-sm border border-navy-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-base font-semibold text-navy-900">{job.job_title}</h4>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${job.match_score >= 90 ? "bg-green-100 text-green-800" : job.match_score >= 75 ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800"}`}>
                        {job.match_score >= 90 ? "Excellent" : job.match_score >= 75 ? "Good" : "Fair"}
                      </span>
                    </div>
                    <p className="text-sm text-navy-600 mt-0.5">{job.company}</p>
                  </div>
                  <div className="text-center flex-shrink-0">
                    <p className="text-2xl font-bold text-navy-900">{job.match_score}%</p>
                    <p className="text-xs text-navy-500">match</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-navy-50">
                  <p className="text-xs text-navy-600">{job.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
