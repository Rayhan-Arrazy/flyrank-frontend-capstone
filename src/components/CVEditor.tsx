import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { CVData, CVExperience, CVEducation } from "../types";

interface CVRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  skills: string[];
  experience: CVExperience[];
  education: CVEducation[];
  summary: string;
}

export default function CVEditor({ userId }: { userId: string }) {
  const [cvs, setCvs] = useState<CVRow[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cv, setCv] = useState<CVData | null>(null);
  const [showATS, setShowATS] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) return;
    loadCVs();
  }, [userId]);

  const loadCVs = async () => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("cvs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (fetchError) throw fetchError;
      setCvs(data || []);
      if (data && data.length > 0) {
        setSelectedId(data[0].id);
        mapRowToCV(data[0]);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  const mapRowToCV = (row: CVRow) => {
    setCv({
      fullName: row.full_name || "",
      email: row.email || "",
      phone: row.phone || "",
      location: row.location || "",
      linkedin: row.linkedin || "",
      github: row.github || "",
      portfolio: row.portfolio || "",
      skills: row.skills || [],
      experience: row.experience || [],
      education: row.education || [],
      summary: row.summary || "",
      rawText: "",
      importedFrom: {},
      aiSuggestions: [],
    });
    setSaved(false);
  };

  const handleSelectCV = (id: string) => {
    setSelectedId(id);
    const row = cvs.find((c) => c.id === id);
    if (row) mapRowToCV(row);
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

  if (!cv) {
    return (
      <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-navy-900">CV Editor</h2><p className="text-navy-600 mt-1">Edit your existing CV</p></div>
        <div className="text-center py-12 bg-white rounded-xl border border-navy-100">
          <p className="text-navy-500 text-lg">No CV to edit</p>
          <p className="text-navy-400 text-sm mt-1">Build a CV first or import from social links</p>
        </div>
      </div>
    );
  }

  const updateField = <K extends keyof CVData>(field: K, value: CVData[K]) => {
    setCv((prev) => prev ? { ...prev, [field]: value } : null);
    setSaved(false);
  };

  const addSkill = () => {
    if (skillInput.trim() && cv && !cv.skills.includes(skillInput.trim())) {
      updateField("skills", [...cv.skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (index: number) => {
    if (cv) updateField("skills", cv.skills.filter((_, i) => i !== index));
  };

  const addExperience = () => {
    if (cv) updateField("experience", [...cv.experience, { company: "", role: "", startDate: "", endDate: "", description: "" }]);
  };

  const updateExperience = (index: number, field: keyof CVExperience, value: string) => {
    if (!cv) return;
    const updated = [...cv.experience];
    updated[index] = { ...updated[index], [field]: value };
    updateField("experience", updated);
  };

  const removeExperience = (index: number) => {
    if (cv) updateField("experience", cv.experience.filter((_, i) => i !== index));
  };

  const addEducation = () => {
    if (cv) updateField("education", [...cv.education, { institution: "", degree: "", field: "", startDate: "", endDate: "" }]);
  };

  const updateEducation = (index: number, field: keyof CVEducation, value: string) => {
    if (!cv) return;
    const updated = [...cv.education];
    updated[index] = { ...updated[index], [field]: value };
    updateField("education", updated);
  };

  const removeEducation = (index: number) => {
    if (cv) updateField("education", cv.education.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!selectedId || !cv) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const { error: updateError } = await supabase
        .from("cvs")
        .update({
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
          updated_at: new Date().toISOString(),
        })
        .eq("id", selectedId);
      if (updateError) throw updateError;
      setSaved(true);
      loadCVs();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-navy-900">CV Editor</h2>
          <p className="text-navy-600 mt-1">Edit your existing CV</p>
        </div>
        <div className="flex items-center gap-3">
          {cvs.length > 1 && (
            <select value={selectedId || ""} onChange={(e) => handleSelectCV(e.target.value)} className="px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900">
              {cvs.map((c) => <option key={c.id} value={c.id}>{c.full_name || "Untitled CV"}</option>)}
            </select>
          )}
          <button onClick={() => setShowATS(!showATS)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${showATS ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"}`}>
            {showATS ? "Hide ATS" : "ATS View"}
          </button>
          <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 transition-colors text-sm">
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>}
      {saved && !error && <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm">Changes saved successfully!</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Personal Info</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block text-xs font-medium text-navy-600 mb-1">Full Name</label><input type="text" value={cv.fullName} onChange={(e) => updateField("fullName", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
              <div><label className="block text-xs font-medium text-navy-600 mb-1">Email</label><input type="email" value={cv.email} onChange={(e) => updateField("email", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
              <div><label className="block text-xs font-medium text-navy-600 mb-1">Phone</label><input type="tel" value={cv.phone} onChange={(e) => updateField("phone", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
              <div><label className="block text-xs font-medium text-navy-600 mb-1">Location</label><input type="text" value={cv.location} onChange={(e) => updateField("location", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
              <div><label className="block text-xs font-medium text-navy-600 mb-1">LinkedIn</label><input type="url" value={cv.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
              <div><label className="block text-xs font-medium text-navy-600 mb-1">GitHub</label><input type="url" value={cv.github} onChange={(e) => updateField("github", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
            </div>
            <div><label className="block text-xs font-medium text-navy-600 mb-1">Portfolio</label><input type="url" value={cv.portfolio} onChange={(e) => updateField("portfolio", e.target.value)} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900" /></div>
          </section>
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Summary</h3>
            <textarea value={cv.summary} onChange={(e) => updateField("summary", e.target.value)} rows={3} className="w-full px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 resize-y" />
          </section>
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Skills</h3><button onClick={addSkill} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add</button></div>
            <div className="flex gap-2"><input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add skill" className="flex-1 px-3 py-2 border border-navy-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" /></div>
            <div className="flex flex-wrap gap-2">{cv.skills.map((skill, i) => <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">{skill}<button onClick={() => removeSkill(i)} className="text-navy-400 hover:text-navy-700">&times;</button></span>)}</div>
          </section>
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Experience</h3><button onClick={addExperience} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add</button></div>
            {cv.experience.map((exp, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-xs text-navy-500">Position {i + 1}</span><button onClick={() => removeExperience(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button></div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Role" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" value={exp.startDate} onChange={(e) => updateExperience(i, "startDate", e.target.value)} placeholder="Start" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                  <input type="text" value={exp.endDate} onChange={(e) => updateExperience(i, "endDate", e.target.value)} placeholder="End" className="px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300" />
                </div>
                <textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Description" rows={2} className="w-full px-3 py-1.5 border border-navy-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 text-navy-900 placeholder-navy-300 resize-y" />
              </div>
            ))}
          </section>
          <section className="space-y-3">
            <div className="flex items-center justify-between"><h3 className="text-sm font-semibold text-navy-800 uppercase tracking-wide">Education</h3><button onClick={addEducation} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add</button></div>
            {cv.education.map((edu, i) => (
              <div key={i} className="p-3 border border-navy-100 rounded-lg space-y-2">
                <div className="flex justify-between"><span className="text-xs text-navy-500">Education {i + 1}</span><button onClick={() => removeEducation(i)} className="text-xs text-red-500 hover:text-red-700">Remove</button></div>
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
          </section>
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
      {cv.experience.length > 0 && <div><h4 className="text-xs font-bold text-navy-800 uppercase tracking-wide mb-2">Experience</h4><div className="space-y-3">{cv.experience.map((exp, i) => <div key={i}><p className="text-sm font-semibold text-navy-900">{exp.role}</p><p className="text-xs text-navy-600">{exp.company} | {exp.startDate} - {exp.endDate}</p>{exp.description && <p className="text-xs text-navy-600 mt-1">{exp.description}</p>}</div>)}</div></div>}
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
