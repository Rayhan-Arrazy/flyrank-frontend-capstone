import { useState } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { CVData } from "../types";

export default function SocialImport() {
  const { saveCV } = useApplicoStore();
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [socialUrls, setSocialUrls] = useState<string[]>([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [importedData, setImportedData] = useState<CVData | null>(null);

  const addSocialField = () => setSocialUrls([...socialUrls, ""]);
  const updateSocial = (index: number, value: string) => {
    const updated = [...socialUrls];
    updated[index] = value;
    setSocialUrls(updated);
  };
  const removeSocial = (index: number) => setSocialUrls(socialUrls.filter((_, i) => i !== index));

  const mockImportFromLinks = (linkedin: string, github: string, socials: string[]): Promise<CVData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const skills: string[] = [];
        const experience: CVData["experience"] = [];
        const education: CVData["education"] = [];
        let fullName = "";
        let summary = "";
        let location = "";

        if (linkedin) {
          const username = linkedin.split("/").pop()?.replace(/-/g, " ") || "";
          fullName = username.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
          summary = "Experienced professional with a proven track record of delivering results. Strong background in technology, leadership, and cross-functional collaboration. Passionate about driving innovation and building scalable solutions.";
          location = "San Francisco, CA";
          skills.push("Leadership", "Strategic Planning", "Communication", "Project Management", "Team Building", "Stakeholder Management");
          experience.push(
            { company: "Tech Corp", role: "Senior Manager", startDate: "2021", endDate: "Present", description: "Led a team of 12 engineers, delivering 3 major product launches that increased revenue by 40%." },
            { company: "StartupXYZ", role: "Product Lead", startDate: "2018", endDate: "2021", description: "Built and scaled the product team from 2 to 15 members. Launched flagship product with 100K+ users." }
          );
          education.push({ institution: "Stanford University", degree: "Master of Science", field: "Computer Science", startDate: "2014", endDate: "2016" });
        }

        if (github) {
          const githubUser = github.split("/").pop() || "developer";
          if (!fullName) fullName = githubUser.charAt(0).toUpperCase() + githubUser.slice(1);
          skills.push("JavaScript", "TypeScript", "React", "Node.js", "Python", "Git", "Docker", "AWS", "REST APIs", "SQL");
          if (experience.length === 0) {
            experience.push(
              { company: "Open Source Contributor", role: "Full Stack Developer", startDate: "2020", endDate: "Present", description: "Active contributor to 15+ open source projects with 200+ GitHub stars. Built tools used by thousands of developers." }
            );
          }
          if (education.length === 0) {
            education.push({ institution: "University of Technology", degree: "Bachelor of Science", field: "Software Engineering", startDate: "2016", endDate: "2020" });
          }
        }

        socials.forEach((url) => {
          if (url.includes("instagram")) skills.push("Content Creation", "Social Media", "Brand Management", "Photography");
          if (url.includes("twitter") || url.includes("x.com")) skills.push("Public Speaking", "Thought Leadership", "Community Building");
          if (url.includes("behance") || url.includes("dribbble")) skills.push("UI/UX Design", "Figma", "Adobe Creative Suite", "Visual Design");
          if (url.includes("medium") || url.includes("dev.to")) skills.push("Technical Writing", "Documentation", "Knowledge Sharing");
        });

        const uniqueSkills = [...new Set(skills)];

        resolve({
          fullName: fullName || "Imported User",
          email: `${(fullName || "user").toLowerCase().replace(/\s/g, ".")}@example.com`,
          phone: "+1 555-0100",
          location: location || "Remote",
          linkedin: linkedin || "",
          github: github || "",
          portfolio: socials.find((s) => s.includes("portfolio") || s.includes("behance")) || "",
          skills: uniqueSkills.slice(0, 15),
          experience,
          education,
          summary,
          rawText: `Imported from LinkedIn: ${linkedin}\nGitHub: ${github}\nSocial: ${socials.join(", ")}`,
          importedFrom: { linkedin: linkedin || undefined, github: github || undefined, social: socials.filter(Boolean) },
          aiSuggestions: [],
        });
      }, 2000);
    });
  };

  const handleImport = async () => {
    if (!linkedinUrl && !githubUrl && socialUrls.every((s) => !s.trim())) return;
    setIsLoading(true);
    setImportedData(null);
    try {
      const data = await mockImportFromLinks(linkedinUrl, githubUrl, socialUrls.filter(Boolean));
      setImportedData(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    if (importedData) {
      saveCV(importedData);
      setImportedData(null);
      setLinkedinUrl("");
      setGithubUrl("");
      setSocialUrls([""]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">Import from Social</h2>
        <p className="text-navy-600 mt-1">Import your professional data from LinkedIn, GitHub, and social profiles</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">LinkedIn Profile URL</label>
          <input type="url" value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/yourprofile" className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300" />
        </div>

        <div>
          <label className="block text-sm font-medium text-navy-700 mb-1">GitHub Profile URL</label>
          <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/yourusername" className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-navy-700">Other Social / Portfolio Links</label>
            <button onClick={addSocialField} className="text-xs font-medium text-navy-600 hover:text-navy-800">+ Add Link</button>
          </div>
          {socialUrls.map((url, i) => (
            <div key={i} className="flex gap-2">
              <input type="url" value={url} onChange={(e) => updateSocial(i, e.target.value)} placeholder="https://instagram.com/yourprofile or https://behance.net/yourportfolio" className="flex-1 px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300" />
              {socialUrls.length > 1 && (
                <button onClick={() => removeSocial(i)} className="px-3 text-red-500 hover:text-red-700 text-sm">&times;</button>
              )}
            </div>
          ))}
          <p className="text-xs text-navy-400">Supports: Instagram, Twitter/X, Behance, Dribbble, Medium, Dev.to, personal websites</p>
        </div>

        <button onClick={handleImport} disabled={isLoading || (!linkedinUrl && !githubUrl && socialUrls.every((s) => !s.trim()))} className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm">
          {isLoading ? "Importing..." : "Import Profiles"}
        </button>
      </div>

      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-navy-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-navy-700 text-sm font-medium">Parsing your social profiles...</span>
        </div>
      )}

      {importedData && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-navy-900">Imported Data Preview</h3>
            <button onClick={handleSave} className="px-5 py-2 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors text-sm">
              Save to CV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PreviewField label="Name" value={importedData.fullName} />
            <PreviewField label="Email" value={importedData.email} />
            <PreviewField label="Location" value={importedData.location} />
            <PreviewField label="LinkedIn" value={importedData.linkedin} />
            <PreviewField label="GitHub" value={importedData.github} />
            <PreviewField label="Portfolio" value={importedData.portfolio} />
          </div>

          {importedData.summary && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">Summary</p>
              <p className="text-sm text-navy-800">{importedData.summary}</p>
            </div>
          )}

          {importedData.skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {importedData.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {importedData.experience.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Experience</p>
              <div className="space-y-2">
                {importedData.experience.map((exp, i) => (
                  <div key={i} className="pl-3 border-l-2 border-navy-200">
                    <p className="text-sm font-medium text-navy-900">{exp.role} at {exp.company}</p>
                    <p className="text-xs text-navy-600">{exp.startDate} - {exp.endDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {importedData.education.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Education</p>
              <div className="space-y-2">
                {importedData.education.map((edu, i) => (
                  <div key={i} className="pl-3 border-l-2 border-navy-200">
                    <p className="text-sm font-medium text-navy-900">{edu.degree} in {edu.field}</p>
                    <p className="text-xs text-navy-600">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">{label}</p>
      <p className="text-sm text-navy-900 mt-0.5">{value || "Not detected"}</p>
    </div>
  );
}
