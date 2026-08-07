import { useState } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { CVData } from "../types";

export default function CVSpreader() {
  const { savedCVs, applications, deleteSavedCV, updateApplication } = useApplicoStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatATS = (cv: CVData): string => {
    const lines: string[] = [];
    lines.push(cv.fullName.toUpperCase());
    lines.push([cv.email, cv.phone, cv.location].filter(Boolean).join(" | "));
    lines.push([cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | "));
    lines.push("");
    if (cv.summary) { lines.push("PROFESSIONAL SUMMARY"); lines.push(cv.summary); lines.push(""); }
    if (cv.skills.length > 0) { lines.push("SKILLS"); lines.push(cv.skills.join(", ")); lines.push(""); }
    if (cv.experience.length > 0) {
      lines.push("EXPERIENCE");
      cv.experience.forEach((exp) => {
        lines.push(`${exp.role} - ${exp.company}`);
        lines.push(`${exp.startDate} - ${exp.endDate}`);
        if (exp.description) lines.push(exp.description);
        lines.push("");
      });
    }
    if (cv.education.length > 0) {
      lines.push("EDUCATION");
      cv.education.forEach((edu) => {
        lines.push(`${edu.degree} in ${edu.field} - ${edu.institution}`);
        lines.push(`${edu.startDate} - ${edu.endDate}`);
        lines.push("");
      });
    }
    return lines.join("\n");
  };

  const handleCopyText = async (cv: CVData, index: number) => {
    await navigator.clipboard.writeText(formatATS(cv));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportPDF = (cv: CVData) => {
    const printContent = `
      <html><head><title>${cv.fullName} - CV</title>
      <style>body{font-family:Arial,sans-serif;max-width:800px;margin:40px auto;padding:0 20px;color:#1a202c}h1{font-size:24px;margin-bottom:4px}h2{font-size:14px;text-transform:uppercase;border-bottom:2px solid #e2e8f0;padding-bottom:4px;margin-top:24px}p{font-size:14px;line-height:1.5;margin:4px 0}.contact{color:#4a5568;font-size:13px}.summary{margin:8px 0}.entry{margin-bottom:12px}.entry-title{font-weight:bold;font-size:14px}.entry-sub{color:#4a5568;font-size:12px}.skills span{display:inline-block;background:#edf2f7;padding:2px 8px;border-radius:4px;margin:2px;font-size:12px}</style>
      </head><body>
      <h1>${cv.fullName}</h1>
      <p class="contact">${[cv.email, cv.phone, cv.location].filter(Boolean).join(" | ")}</p>
      <p class="contact">${[cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | ")}</p>
      ${cv.summary ? `<h2>Summary</h2><p class="summary">${cv.summary}</p>` : ""}
      ${cv.skills.length > 0 ? `<h2>Skills</h2><p class="skills">${cv.skills.map((s) => `<span>${s}</span>`).join("")}</p>` : ""}
      ${cv.experience.length > 0 ? `<h2>Experience</h2>${cv.experience.map((e) => `<div class="entry"><p class="entry-title">${e.role} - ${e.company}</p><p class="entry-sub">${e.startDate} - ${e.endDate}</p>${e.description ? `<p>${e.description}</p>` : ""}</div>`).join("")}` : ""}
      ${cv.education.length > 0 ? `<h2>Education</h2>${cv.education.map((e) => `<div class="entry"><p class="entry-title">${e.degree} in ${e.field}</p><p class="entry-sub">${e.institution} | ${e.startDate} - ${e.endDate}</p></div>`).join("")}` : ""}
      </body></html>`;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(printContent);
      win.document.close();
      win.print();
    }
  };

  const handleLinkToApplication = (cvIndex: number, appId: string) => {
    const cv = savedCVs[cvIndex];
    if (cv) {
      updateApplication(appId, { cv });
    }
  };

  if (savedCVs.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">CV Spreader</h2>
          <p className="text-navy-600 mt-1">Manage and distribute your saved CVs</p>
        </div>
        <div className="text-center py-12 bg-white rounded-xl border border-navy-100">
          <p className="text-navy-500 text-lg">No saved CVs yet</p>
          <p className="text-navy-400 text-sm mt-1">Upload or create a CV to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">CV Spreader</h2>
        <p className="text-navy-600 mt-1">Manage and distribute your saved CVs</p>
      </div>

      <div className="space-y-4">
        {savedCVs.map((cv, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-navy-100 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-navy-900">{cv.fullName || "Untitled CV"}</h3>
                <p className="text-sm text-navy-500">{cv.email} &middot; {cv.experience.length} experiences &middot; {cv.skills.length} skills</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleCopyText(cv, index)}
                  className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                >
                  {copiedIndex === index ? "Copied!" : "Copy ATS Text"}
                </button>
                <button
                  onClick={() => handleExportPDF(cv)}
                  className="px-3 py-1.5 text-xs font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
                >
                  Export PDF
                </button>
                <button
                  onClick={() => deleteSavedCV(index)}
                  className="px-3 py-1.5 text-xs font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>

            {applications.length > 0 && (
              <div className="flex items-center gap-2 pt-2 border-t border-navy-100">
                <label className="text-xs font-medium text-navy-600">Link to application:</label>
                <select
                  onChange={(e) => { if (e.target.value) handleLinkToApplication(index, e.target.value); }}
                  defaultValue=""
                  className="text-xs px-2 py-1.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-700"
                >
                  <option value="">Select application...</option>
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company} - {app.role}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
