import { useState } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { CVData, CVExperience, CVEducation } from "../types";

export default function CVEditor() {
  const { currentCV, setCurrentCV, saveCV } = useApplicoStore();
  const [cv, setCv] = useState<CVData>(
    currentCV || {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      skills: [],
      experience: [],
      education: [],
      summary: "",
      rawText: "",
    }
  );
  const [showATS, setShowATS] = useState(false);
  const [skillInput, setSkillInput] = useState("");

  const updateField = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    setCv((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !cv.skills.includes(skillInput.trim())) {
      updateField("skills", [...cv.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    updateField("skills", cv.skills.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    updateField("experience", [
      ...cv.experience,
      { company: "", role: "", startDate: "", endDate: "", description: "" },
    ]);
  };

  const updateExperience = (index: number, field: keyof CVExperience, value: string) => {
    const updated = [...cv.experience];
    updated[index] = { ...updated[index], [field]: value };
    updateField("experience", updated);
  };

  const removeExperience = (index: number) => {
    updateField("experience", cv.experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    updateField("education", [
      ...cv.education,
      { institution: "", degree: "", field: "", startDate: "", endDate: "" },
    ]);
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: string) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    updateField("education", updated);
  };

  const removeEducation = (index: number) => {
    updateField("education", cv.education.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setCurrentCV(cv);
    saveCV(cv);
  };

  const handleReset = () => {
    setCv({
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      skills: [],
      experience: [],
      education: [],
      summary: "",
      rawText: "",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">CV Editor</h2>
          <p className="text-navy-600 mt-1">Edit your CV with real-time preview</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowATS(!showATS)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              showATS ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            {showATS ? "Hide ATS View" : "Show ATS View"}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-navy-700 bg-navy-50 rounded-lg hover:bg-navy-100 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors text-sm"
          >
            Save CV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={cv.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                placeholder="Full Name"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <input
                type="email"
                value={cv.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="Email"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <input
                type="tel"
                value={cv.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="Phone"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <input
                type="text"
                value={cv.location}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="Location"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <input
                type="url"
                value={cv.linkedin}
                onChange={(e) => updateField("linkedin", e.target.value)}
                placeholder="LinkedIn URL"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <input
                type="url"
                value={cv.github}
                onChange={(e) => updateField("github", e.target.value)}
                placeholder="GitHub URL"
                className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
            </div>
            <input
              type="url"
              value={cv.portfolio}
              onChange={(e) => updateField("portfolio", e.target.value)}
              placeholder="Portfolio URL"
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Summary</h3>
            <textarea
              value={cv.summary}
              onChange={(e) => updateField("summary", e.target.value)}
              placeholder="Professional summary..."
              rows={3}
              className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300 resize-y"
            />
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Skills</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                placeholder="Add a skill and press Enter"
                className="flex-1 px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
              />
              <button
                onClick={addSkill}
                className="px-3 py-2 bg-navy-100 text-navy-700 rounded-lg text-sm font-medium hover:bg-navy-200 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">
                  {skill}
                  <button onClick={() => removeSkill(i)} className="text-navy-400 hover:text-navy-700">&times;</button>
                </span>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Experience</h3>
              <button onClick={addExperience} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add</button>
            </div>
            {cv.experience.map((exp, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-navy-500">Experience {i + 1}</span>
                  <button onClick={() => removeExperience(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                <input
                  type="text"
                  value={exp.company}
                  onChange={(e) => updateExperience(i, "company", e.target.value)}
                  placeholder="Company"
                  className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                />
                <input
                  type="text"
                  value={exp.role}
                  onChange={(e) => updateExperience(i, "role", e.target.value)}
                  placeholder="Role"
                  className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(i, "startDate", e.target.value)}
                    placeholder="Start (e.g. 2020)"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(i, "endDate", e.target.value)}
                    placeholder="End (e.g. Present)"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(i, "description", e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300 resize-y"
                />
              </div>
            ))}
          </section>

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Education</h3>
              <button onClick={addEducation} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add</button>
            </div>
            {cv.education.map((edu, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-navy-500">Education {i + 1}</span>
                  <button onClick={() => removeEducation(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                </div>
                <input
                  type="text"
                  value={edu.institution}
                  onChange={(e) => updateEducation(i, "institution", e.target.value)}
                  placeholder="Institution"
                  className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEducation(i, "degree", e.target.value)}
                    placeholder="Degree"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => updateEducation(i, "field", e.target.value)}
                    placeholder="Field of Study"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(i, "startDate", e.target.value)}
                    placeholder="Start Year"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                  <input
                    type="text"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(i, "endDate", e.target.value)}
                    placeholder="End Year"
                    className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300"
                  />
                </div>
              </div>
            ))}
          </section>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide mb-4">
            {showATS ? "ATS-Friendly Preview" : "CV Preview"}
          </h3>
          {showATS ? (
            <pre className="text-xs text-navy-800 whitespace-pre-wrap font-mono leading-relaxed">
              {formatATS(cv)}
            </pre>
          ) : (
            <div className="space-y-4">
              <div className="text-center border-b border-navy-100 pb-4">
                <h1 className="text-xl font-bold text-navy-900">{cv.fullName || "Your Name"}</h1>
                <p className="text-sm text-navy-600 mt-1">
                  {[cv.email, cv.phone, cv.location].filter(Boolean).join(" | ")}
                </p>
                <p className="text-xs text-navy-500 mt-1">
                  {[cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | ")}
                </p>
              </div>

              {cv.summary && (
                <div>
                  <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-1">Professional Summary</h4>
                  <p className="text-sm text-navy-700">{cv.summary}</p>
                </div>
              )}

              {cv.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-1">Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {cv.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-navy-100 text-navy-700 text-xs rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cv.experience.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-2">Experience</h4>
                  <div className="space-y-3">
                    {cv.experience.map((exp, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold text-navy-900">{exp.role}</p>
                        <p className="text-xs text-navy-600">{exp.company} | {exp.startDate} - {exp.endDate}</p>
                        {exp.description && <p className="text-xs text-navy-600 mt-1">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {cv.education.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-2">Education</h4>
                  <div className="space-y-2">
                    {cv.education.map((edu, i) => (
                      <div key={i}>
                        <p className="text-sm font-semibold text-navy-900">{edu.degree} {edu.field && `in ${edu.field}`}</p>
                        <p className="text-xs text-navy-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatATS(cv: CVData): string {
  const lines: string[] = [];
  lines.push(cv.fullName.toUpperCase());
  lines.push([cv.email, cv.phone, cv.location].filter(Boolean).join(" | "));
  lines.push([cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | "));
  lines.push("");

  if (cv.summary) {
    lines.push("PROFESSIONAL SUMMARY");
    lines.push(cv.summary);
    lines.push("");
  }

  if (cv.skills.length > 0) {
    lines.push("SKILLS");
    lines.push(cv.skills.join(", "));
    lines.push("");
  }

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
}
