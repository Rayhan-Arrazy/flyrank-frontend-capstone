import { useState } from "react";
import { supabase } from "../lib/supabase";
import { CVData, CVExperience, CVEducation } from "../types";

const emptyCV: CVData = {
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
  importedFrom: {},
  aiSuggestions: [],
};

export default function CVBuilder({ userId }: { userId: string }) {
  const [cv, setCv] = useState<CVData>(emptyCV);
  const [showATS, setShowATS] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const updateField = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    setCv((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
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
    updateField("experience", [...cv.experience, { company: "", role: "", startDate: "", endDate: "", description: "" }]);
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
    updateField("education", [...cv.education, { institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: string) => {
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    updateField("education", updated);
  };

  const removeEducation = (index: number) => {
    updateField("education", cv.education.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { error: insertError } = await supabase.from("cvs").insert({
        user_id: userId,
        full_name: cv.fullName,
        email: cv.email,
        phone: cv.phone,
        location: cv.location,
        linkedin: cv.linkedin,
        github: cv.github,
        portfolio: cv.portfolio,
        skills: cv.skills,
        experience: cv.experience,
        education: cv.education,
        summary: cv.summary,
      });
      if (insertError) throw insertError;
      setSaved(true);
      setCv(emptyCV);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  const completionScore = calculateCompletion(cv);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">CV Builder</h2>
          <p className="text-navy-600 mt-1">Build your professional CV from scratch</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-navy-50 rounded-lg">
            <div className="w-20 h-2 bg-navy-200 rounded-full overflow-hidden">
              <div className="h-full bg-navy-600 rounded-full transition-all" style={{ width: `${completionScore}%` }} />
            </div>
            <span className="text-xs font-medium text-navy-700">{completionScore}%</span>
          </div>
          <button onClick={() => setShowATS(!showATS)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${showATS ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"}`}>
            {showATS ? "Hide ATS" : "ATS View"}
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 transition-colors text-sm">
            {saving ? "Saving..." : saved ? "Saved!" : "Save CV"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}
      {saved && !error && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">CV saved successfully!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <Section title="Personal Info">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input label="Full Name" value={cv.fullName} onChange={(v) => updateField("fullName", v)} placeholder="John Doe" />
              <Input label="Email" value={cv.email} onChange={(v) => updateField("email", v)} placeholder="john@example.com" type="email" />
              <Input label="Phone" value={cv.phone} onChange={(v) => updateField("phone", v)} placeholder="+1 555-0123" type="tel" />
              <Input label="Location" value={cv.location} onChange={(v) => updateField("location", v)} placeholder="New York, NY" />
              <Input label="LinkedIn" value={cv.linkedin} onChange={(v) => updateField("linkedin", v)} placeholder="linkedin.com/in/johndoe" type="url" />
              <Input label="GitHub" value={cv.github} onChange={(v) => updateField("github", v)} placeholder="github.com/johndoe" type="url" />
            </div>
            <Input label="Portfolio" value={cv.portfolio} onChange={(v) => updateField("portfolio", v)} placeholder="https://yourportfolio.com" type="url" />
          </Section>

          <Section title="Professional Summary">
            <textarea value={cv.summary} onChange={(e) => updateField("summary", e.target.value)} placeholder="A brief summary of your professional background and career goals..." rows={3} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300 resize-y" />
          </Section>

          <Section title="Skills" action={<button onClick={addSkill} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add Skill</button>}>
            <div className="flex gap-2 mb-2">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Type a skill and press Enter" className="flex-1 px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
            </div>
            <div className="flex flex-wrap gap-2">
              {cv.skills.map((skill, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">
                  {skill}<button onClick={() => removeSkill(i)} className="text-navy-400 hover:text-navy-700">&times;</button>
                </span>
              ))}
            </div>
          </Section>

          <Section title="Experience" action={<button onClick={addExperience} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add Experience</button>}>
            {cv.experience.map((exp, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between items-center"><span className="text-xs text-navy-500 font-medium">Position {i + 1}</span><button onClick={() => removeExperience(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button></div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Job Title" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} placeholder="Start" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} placeholder="End" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
                <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300 resize-y" />
              </div>
            ))}
          </Section>

          <Section title="Education" action={<button onClick={addEducation} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add Education</button>}>
            {cv.education.map((edu, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between items-center"><span className="text-xs text-navy-500 font-medium">Education {i + 1}</span><button onClick={() => removeEducation(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button></div>
                <input type="text" value={edu.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="Institution" className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={edu.degree} onChange={(e) => updateEducation(i, "degree", e.target.value)} placeholder="Degree" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={edu.field} onChange={(e) => updateEducation(i, "field", e.target.value)} placeholder="Field" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={edu.startDate} onChange={(e) => updateEducation(i, "startDate", e.target.value)} placeholder="Start" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={edu.endDate} onChange={(e) => updateEducation(i, "endDate", e.target.value)} placeholder="End" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
              </div>
            ))}
          </Section>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide mb-4">{showATS ? "ATS-Friendly Preview" : "Live Preview"}</h3>
          {showATS ? (
            <pre className="text-xs text-navy-800 whitespace-pre-wrap font-mono leading-relaxed">{formatATS(cv)}</pre>
          ) : (
            <CVPreview cv={cv} />
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string }) {
  return (
    <div><label className="block text-xs font-medium text-navy-600 mb-1">{label}</label><input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" /></div>
  );
}

function CVPreview({ cv }: { cv: CVData }) {
  return (
    <div className="space-y-4">
      <div className="text-center border-b border-navy-100 pb-4">
        <h1 className="text-xl font-bold text-navy-900">{cv.fullName || "Your Name"}</h1>
        <p className="text-sm text-navy-600 mt-1">{[cv.email, cv.phone, cv.location].filter(Boolean).join(" | ")}</p>
        <p className="text-xs text-navy-500 mt-1">{[cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | ")}</p>
      </div>
      {cv.summary && <div><h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-1">Summary</h4><p className="text-sm text-navy-700">{cv.summary}</p></div>}
      {cv.skills.length > 0 && <div><h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-1">Skills</h4><div className="flex flex-wrap gap-1.5">{cv.skills.map((s, i) => <span key={i} className="px-2 py-0.5 bg-navy-100 text-navy-700 text-xs rounded">{s}</span>)}</div></div>}
      {cv.experience.length > 0 && <div><h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-2">Experience</h4><div className="space-y-3">{cv.experience.map((exp, i) => <div key={i}><p className="text-sm font-semibold text-navy-900">{exp.role || "Role"}</p><p className="text-xs text-navy-600">{exp.company} | {exp.startDate} - {exp.endDate}</p>{exp.description && <p className="text-xs text-navy-600 mt-1">{exp.description}</p>}</div>)}</div></div>}
      {cv.education.length > 0 && <div><h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-2">Education</h4><div className="space-y-2">{cv.education.map((edu, i) => <div key={i}><p className="text-sm font-semibold text-navy-900">{edu.degree} {edu.field && `in ${edu.field}`}</p><p className="text-xs text-navy-600">{edu.institution} | {edu.startDate} - {edu.endDate}</p></div>)}</div></div>}
    </div>
  );
}

function formatATS(cv: CVData): string {
  const lines: string[] = [];
  lines.push(cv.fullName.toUpperCase());
  lines.push([cv.email, cv.phone, cv.location].filter(Boolean).join(" | "));
  lines.push([cv.linkedin, cv.github, cv.portfolio].filter(Boolean).join(" | "));
  lines.push("");
  if (cv.summary) { lines.push("PROFESSIONAL SUMMARY"); lines.push(cv.summary); lines.push(""); }
  if (cv.skills.length > 0) { lines.push("SKILLS"); lines.push(cv.skills.join(", ")); lines.push(""); }
  if (cv.experience.length > 0) { lines.push("EXPERIENCE"); cv.experience.forEach((exp) => { lines.push(`${exp.role} - ${exp.company}`); lines.push(`${exp.startDate} - ${exp.endDate}`); if (exp.description) lines.push(exp.description); lines.push(""); }); }
  if (cv.education.length > 0) { lines.push("EDUCATION"); cv.education.forEach((edu) => { lines.push(`${edu.degree} in ${edu.field} - ${edu.institution}`); lines.push(`${edu.startDate} - ${edu.endDate}`); lines.push(""); }); }
  return lines.join("\n");
}

function calculateCompletion(cv: CVData): number {
  let score = 0;
  if (cv.fullName) score += 15;
  if (cv.email) score += 10;
  if (cv.phone) score += 5;
  if (cv.summary) score += 15;
  if (cv.skills.length > 0) score += 15;
  if (cv.experience.length > 0) score += 20;
  if (cv.education.length > 0) score += 10;
  if (cv.linkedin || cv.github) score += 10;
  return Math.min(score, 100);
}
