import { useState } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { CVData, JobSuggestion } from "../types";

export default function JobMatcher() {
  const { savedCVs, currentCV, setJobSuggestions } = useApplicoStore();
  const [selectedCVIndex, setSelectedCVIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<JobSuggestion[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [saved, setSaved] = useState(false);

  const mockMatchJobs = (cv: CVData): Promise<JobSuggestion[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const jobPool: JobSuggestion[] = [
          { jobTitle: "Senior Software Engineer", company: "TechCorp Inc.", matchScore: 95, reason: "Strong match with your React, TypeScript, and Node.js experience. Your leadership background aligns with senior role requirements.", location: "San Francisco, CA", salary: "$150,000 - $190,000" },
          { jobTitle: "Full Stack Developer", company: "StartupXYZ", matchScore: 88, reason: "Your full-stack experience with modern frameworks matches perfectly. Startup culture fits your agile background.", location: "Remote", salary: "$120,000 - $160,000" },
          { jobTitle: "Frontend Engineer", company: "DesignCo", matchScore: 85, reason: "Excellent match for UI/UX skills and React expertise. Your portfolio demonstrates strong frontend capabilities.", location: "New York, NY", salary: "$130,000 - $170,000" },
          { jobTitle: "Technical Lead", company: "Enterprise Solutions", matchScore: 82, reason: "Your management experience and technical depth make you ideal for this lead role. Team scaling experience is a plus.", location: "Austin, TX", salary: "$160,000 - $200,000" },
          { jobTitle: "DevOps Engineer", company: "CloudFirst", matchScore: 78, reason: "Your Docker, AWS, and CI/CD experience matches well. Some additional Kubernetes experience would be beneficial.", location: "Seattle, WA", salary: "$140,000 - $180,000" },
          { jobTitle: "Product Manager", company: "InnovateTech", matchScore: 75, reason: "Your technical background and leadership experience translate well to PM role. Strategic planning skills are a strong match.", location: "Remote", salary: "$135,000 - $175,000" },
          { jobTitle: "Data Engineer", company: "DataDriven Co.", matchScore: 72, reason: "Your SQL and Python skills are relevant. Additional experience with Spark or Airflow would strengthen your profile.", location: "Chicago, IL", salary: "$125,000 - $165,000" },
          { jobTitle: "Engineering Manager", company: "ScaleUp Inc.", matchScore: 70, reason: "Your team leadership and project management experience align well. Technical credibility from hands-on background is valued.", location: "Denver, CO", salary: "$170,000 - $220,000" },
          { jobTitle: "Solutions Architect", company: "ConsultPro", matchScore: 68, reason: "Your broad technical knowledge and client-facing experience are relevant. Cloud architecture certifications would help.", location: "Remote", salary: "$155,000 - $195,000" },
          { jobTitle: "Mobile Developer", company: "AppWorks", matchScore: 65, reason: "Your JavaScript background provides foundation for React Native. Mobile-specific experience would be a growth area.", location: "Los Angeles, CA", salary: "$115,000 - $155,000" },
        ];

        const cvSkills = cv.skills.map((s) => s.toLowerCase());
        const scored = jobPool.map((job) => {
          let score = job.matchScore;
          const jobDesc = job.reason.toLowerCase();
          const matchingSkills = cvSkills.filter((s) => jobDesc.includes(s) || job.jobTitle.toLowerCase().includes(s));
          score += matchingSkills.length * 2;
          return { ...job, matchScore: Math.min(score, 99) };
        });

        scored.sort((a, b) => b.matchScore - a.matchScore);
        resolve(scored);
      }, 2500);
    });
  };

  const handleMatch = async () => {
    const cv = selectedCVIndex === -1 ? currentCV : savedCVs[selectedCVIndex];
    if (!cv) return;

    setIsLoading(true);
    setSuggestions([]);
    setSaved(false);
    try {
      const results = await mockMatchJobs(cv);
      setSuggestions(results);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSuggestions = () => {
    if (selectedCVIndex >= 0 && suggestions.length > 0) {
      setJobSuggestions(selectedCVIndex, suggestions);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const filteredSuggestions = suggestions.filter((s) => s.matchScore >= minScore);

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
            {currentCV && (
              <label className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCVIndex === -1 ? "border-navy-500 bg-navy-50" : "border-navy-200 hover:bg-navy-50"}`}>
                <input type="radio" name="cv" checked={selectedCVIndex === -1} onChange={() => setSelectedCVIndex(-1)} className="text-navy-600" />
                <div><p className="text-sm font-medium text-navy-900">{currentCV.fullName || "Current CV"}</p><p className="text-xs text-navy-500">{currentCV.skills.length} skills &middot; {currentCV.experience.length} experiences</p></div>
              </label>
            )}
            {savedCVs.map((cv, i) => (
              <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selectedCVIndex === i ? "border-navy-500 bg-navy-50" : "border-navy-200 hover:bg-navy-50"}`}>
                <input type="radio" name="cv" checked={selectedCVIndex === i} onChange={() => setSelectedCVIndex(i)} className="text-navy-600" />
                <div><p className="text-sm font-medium text-navy-900">{cv.fullName || `CV ${i + 1}`}</p><p className="text-xs text-navy-500">{cv.skills.length} skills &middot; {cv.experience.length} experiences</p></div>
              </label>
            ))}
            {savedCVs.length === 0 && !currentCV && (
              <p className="text-sm text-navy-400 py-2">No CVs available. Build or import a CV first.</p>
            )}
          </div>
        </div>

        <button onClick={handleMatch} disabled={isLoading || (selectedCVIndex === -1 && !currentCV)} className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
          {isLoading ? "Matching..." : "Find Matching Jobs"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-navy-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-navy-700 text-sm font-medium">AI is analyzing your profile and matching with opportunities...</span>
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
              {selectedCVIndex >= 0 && (
                <button onClick={handleSaveSuggestions} className="px-4 py-1.5 bg-navy-800 text-white text-xs font-medium rounded-lg hover:bg-navy-700 transition-colors">
                  {saved ? "Saved!" : "Save to CV"}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {filteredSuggestions.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: JobSuggestion }) {
  const scoreColor = job.matchScore >= 90 ? "bg-green-100 text-green-800" : job.matchScore >= 75 ? "bg-yellow-100 text-yellow-800" : "bg-orange-100 text-orange-800";
  const scoreLabel = job.matchScore >= 90 ? "Excellent" : job.matchScore >= 75 ? "Good" : "Fair";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-5 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-base font-semibold text-navy-900">{job.jobTitle}</h4>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${scoreColor}`}>{scoreLabel}</span>
          </div>
          <p className="text-sm text-navy-600 mt-0.5">{job.company}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-navy-500">
            <span>{job.location}</span>
            <span>&middot;</span>
            <span>{job.salary}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="text-center">
            <p className="text-2xl font-bold text-navy-900">{job.matchScore}%</p>
            <p className="text-xs text-navy-500">match</p>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-navy-50">
        <p className="text-xs text-navy-600">{job.reason}</p>
      </div>
    </div>
  );
}
