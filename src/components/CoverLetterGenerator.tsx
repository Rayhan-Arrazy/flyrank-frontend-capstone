import { useState } from "react";
import { generateCoverLetter } from "../api/mockApi";
import { useApplicoStore } from "../store/applicoStore";
import { ApplicationStatus } from "../types";

export default function CoverLetterGenerator() {
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveRole, setSaveRole] = useState("");
  const [saveCompany, setSaveCompany] = useState("");
  const [saveStatus, setSaveStatus] = useState<ApplicationStatus>("Applied");
  const [saveDate, setSaveDate] = useState(new Date().toISOString().split("T")[0]);

  const addApplication = useApplicoStore((s) => s.addApplication);

  const handleGenerate = async () => {
    if (!companyName || !role || !jobDescription || !resume) return;
    setIsLoading(true);
    setCoverLetter("");
    try {
      const letter = await generateCoverLetter({ companyName, role, jobDescription, resume });
      setCoverLetter(letter);
      setSaveCompany(companyName);
      setSaveRole(role);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveApplication = () => {
    if (!coverLetter || !saveCompany || !saveRole) return;
    addApplication({
      company: saveCompany,
      role: saveRole,
      status: saveStatus,
      date: saveDate,
      notes: "",
      coverLetter,
      cv: null,
    });
    setCoverLetter("");
    setCompanyName("");
    setRole("");
    setJobDescription("");
    setResume("");
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Cover Letter Generator</h2>
        <p className="text-navy-600 mt-1">Generate a tailored cover letter using AI</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-navy-700 mb-1">Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Software Engineer"
              className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={5}
            className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300 resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">Your Resume</label>
          <textarea
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            placeholder="Paste your resume or key skills here..."
            rows={5}
            className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300 resize-y"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !companyName || !role || !jobDescription || !resume}
          className="w-full md:w-auto px-6 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </span>
          ) : (
            "Generate Cover Letter"
          )}
        </button>
      </div>

      {coverLetter && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-navy-900">Generated Cover Letter</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
              >
                {isEditing ? "Preview" : "Edit"}
              </button>
              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 font-mono text-sm resize-y"
            />
          ) : (
            <div className="whitespace-pre-wrap text-navy-800 leading-relaxed bg-navy-50 rounded-lg p-5">
              {coverLetter}
            </div>
          )}

          <div className="border-t border-navy-100 pt-4 space-y-4">
            <h4 className="text-sm font-semibold text-navy-700">Save as Application</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <input
                type="text"
                value={saveCompany}
                onChange={(e) => setSaveCompany(e.target.value)}
                placeholder="Company"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900"
              />
              <input
                type="text"
                value={saveRole}
                onChange={(e) => setSaveRole(e.target.value)}
                placeholder="Role"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900"
              />
              <select
                value={saveStatus}
                onChange={(e) => setSaveStatus(e.target.value as ApplicationStatus)}
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900"
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
              <input
                type="date"
                value={saveDate}
                onChange={(e) => setSaveDate(e.target.value)}
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900"
              />
            </div>
            <button
              onClick={handleSaveApplication}
              className="px-5 py-2 bg-navy-800 text-white text-sm font-medium rounded-lg hover:bg-navy-700 transition-colors"
            >
              Save Application
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
