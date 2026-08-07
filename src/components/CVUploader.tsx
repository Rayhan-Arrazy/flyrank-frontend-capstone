import { useState, useRef } from "react";
import { useApplicoStore } from "../store/applicoStore";
import { CVData } from "../types";

type InputMode = "upload" | "paste" | "url";

export default function CVUploader() {
  const [mode, setMode] = useState<InputMode>("paste");
  const [rawText, setRawText] = useState("");
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [parsedCV, setParsedCV] = useState<CVData | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const saveCV = useApplicoStore((s) => s.saveCV);

  const mockParseCV = (text: string): Promise<CVData> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
        const lowerText = text.toLowerCase();

        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const phoneMatch = text.match(/(\+?\d[\d\s\-()]{7,}\d)/);
        const linkedinMatch = text.match(/linkedin\.com\/in\/[\w-]+/i);
        const githubMatch = text.match(/github\.com\/[\w-]+/i);
        const portfolioMatch = text.match(/(https?:\/\/[\w.-]+\.[a-z]{2,}(\/\S*)?)/i);

        let fullName = "";
        for (const line of lines) {
          const lower = line.toLowerCase();
          if (lower.startsWith("name:") || lower.startsWith("full name:")) {
            fullName = line.split(":").slice(1).join(":").trim();
            break;
          }
        }
        if (!fullName) {
          for (const line of lines.slice(0, 5)) {
            if (line.length > 2 && line.length < 60 && !line.includes("@") && !line.match(/\d{4,}/) && !line.startsWith("http")) {
              fullName = line;
              break;
            }
          }
        }

        let skills: string[] = [];
        const skillsIdx = lowerText.indexOf("skill");
        if (skillsIdx !== -1) {
          const skillsSection = text.substring(skillsIdx, skillsIdx + 500);
          const skillLines = skillsSection.split("\n").slice(1, 10);
          for (const line of skillLines) {
            const cleaned = line.replace(/^[-•*]\s*/, "").trim();
            if (cleaned && !cleaned.toLowerCase().includes("skill")) {
              const items = cleaned.split(/[,;|]/).map((s) => s.trim()).filter(Boolean);
              skills.push(...items);
            }
          }
        }

        const experience: CVData["experience"] = [];
        const expIdx = Math.max(
          lowerText.indexOf("experience"),
          lowerText.indexOf("work"),
          lowerText.indexOf("employment")
        );
        if (expIdx !== -1) {
          const expSection = text.substring(expIdx, expIdx + 1500);
          const expLines = expSection.split("\n").filter((l) => l.trim());
          let currentExp: Partial<CVData["experience"][0]> = {};
          for (const line of expLines.slice(1, 20)) {
            if (line.match(/^[A-Z]/) && line.length < 80 && !line.includes("@")) {
              if (currentExp.company) {
                experience.push(currentExp as CVData["experience"][0]);
                currentExp = {};
              }
              currentExp.company = line.trim();
            } else if (line.match(/\d{4}/) && line.length < 40) {
              const dates = line.match(/\d{4}/g);
              if (dates && dates.length >= 1) {
                currentExp.startDate = dates[0];
                currentExp.endDate = dates[1] || "Present";
              }
            } else if (line.length > 20) {
              currentExp.description = (currentExp.description || "") + " " + line.trim();
            }
          }
          if (currentExp.company) {
            experience.push({
              company: currentExp.company || "",
              role: currentExp.role || "",
              startDate: currentExp.startDate || "",
              endDate: currentExp.endDate || "",
              description: currentExp.description || "",
            });
          }
        }

        const education: CVData["education"] = [];
        const eduIdx = Math.max(
          lowerText.indexOf("education"),
          lowerText.indexOf("university"),
          lowerText.indexOf("college")
        );
        if (eduIdx !== -1) {
          const eduSection = text.substring(eduIdx, eduIdx + 800);
          const eduLines = eduSection.split("\n").filter((l) => l.trim());
          for (const line of eduLines.slice(1, 10)) {
            if (line.match(/[A-Z]/) && line.length > 10 && line.length < 100) {
              education.push({
                institution: line.trim(),
                degree: "",
                field: "",
                startDate: "",
                endDate: "",
              });
            }
          }
        }

        let summary = "";
        const summaryIdx = lowerText.indexOf("summary");
        if (summaryIdx !== -1) {
          const summarySection = text.substring(summaryIdx, summaryIdx + 500);
          const summaryLines = summarySection.split("\n").slice(1, 5);
          summary = summaryLines.join(" ").trim();
        }

        const locationMatch = text.match(/(?:location|address|based in)[:\s]+([^\n,]+)/i);

        resolve({
          fullName,
          email: emailMatch ? emailMatch[0] : "",
          phone: phoneMatch ? phoneMatch[0].trim() : "",
          location: locationMatch ? locationMatch[1].trim() : "",
          linkedin: linkedinMatch ? `https://${linkedinMatch[0]}` : "",
          github: githubMatch ? `https://${githubMatch[0]}` : "",
          portfolio: portfolioMatch ? portfolioMatch[0] : "",
          skills: skills.slice(0, 15),
          experience,
          education,
          summary,
          rawText: text,
        });
      }, 1500);
    });
  };

  const handleFileUpload = async (file: File) => {
    setFileName(file.name);
    const text = await file.text();
    setRawText(text);
    setIsLoading(true);
    try {
      const parsed = await mockParseCV(text);
      setParsedCV(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handlePasteParse = async () => {
    if (!rawText.trim()) return;
    setIsLoading(true);
    try {
      const parsed = await mockParseCV(rawText);
      setParsedCV(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlImport = async () => {
    if (!url.trim()) return;
    setIsLoading(true);
    try {
      const mockText = `Imported from ${url}
Name: Imported User
Email: user@example.com
Phone: +1-555-0123
LinkedIn: linkedin.com/in/user
GitHub: github.com/user
Skills: JavaScript, TypeScript, React, Node.js, Python, SQL, Git, AWS, Docker, Communication, Leadership
Summary: Experienced professional with a strong background in technology and team collaboration.
Experience:
Tech Company Inc.
Senior Developer
2020 - Present
Led development of scalable web applications and mentored junior developers.
Previous Corp
Software Developer
2017 - 2020
Developed and maintained enterprise software solutions.
Education:
State University
Bachelor of Science in Computer Science
2013 - 2017`;
      const parsed = await mockParseCV(mockText);
      setParsedCV(parsed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCV = () => {
    if (parsedCV) {
      saveCV(parsedCV);
      setParsedCV(null);
      setRawText("");
      setUrl("");
      setFileName("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy-900">CV Uploader</h2>
        <p className="text-navy-600 mt-1">Upload, paste, or import your CV to get started</p>
      </div>

      <div className="flex gap-2">
        {(["paste", "upload", "url"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              mode === m ? "bg-navy-800 text-white" : "bg-navy-50 text-navy-700 hover:bg-navy-100"
            }`}
          >
            {m === "paste" ? "Paste Text" : m === "upload" ? "Upload File" : "Import URL"}
          </button>
        ))}
      </div>

      {mode === "paste" && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-4">
          <label className="block text-sm font-medium text-navy-700">Paste your CV text below</label>
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste your full CV text here..."
            rows={12}
            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300 resize-y font-mono text-sm"
          />
          <button
            onClick={handlePasteParse}
            disabled={isLoading || !rawText.trim()}
            className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? "Parsing..." : "Parse CV"}
          </button>
        </div>
      )}

      {mode === "upload" && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              dragOver ? "border-navy-500 bg-navy-50" : "border-navy-200 hover:border-navy-400"
            }`}
          >
            <svg className="w-12 h-12 mx-auto text-navy-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-navy-700 font-medium">Drop your CV file here or click to browse</p>
            <p className="text-navy-400 text-sm mt-1">Supports PDF, DOCX, TXT</p>
            {fileName && <p className="text-navy-600 text-sm mt-2">Selected: {fileName}</p>}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload(file);
            }}
          />
        </div>
      )}

      {mode === "url" && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-4">
          <label className="block text-sm font-medium text-navy-700">LinkedIn, GitHub, or Portfolio URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="w-full px-4 py-2.5 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent text-navy-900 placeholder-navy-300"
          />
          <button
            onClick={handleUrlImport}
            disabled={isLoading || !url.trim()}
            className="px-5 py-2.5 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            {isLoading ? "Importing..." : "Import & Parse"}
          </button>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center gap-3 p-4 bg-navy-50 rounded-lg">
          <svg className="animate-spin h-5 w-5 text-navy-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-navy-700 text-sm font-medium">Parsing your CV with AI...</span>
        </div>
      )}

      {parsedCV && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-navy-100 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-navy-900">Parsed CV Preview</h3>
            <button
              onClick={handleSaveCV}
              className="px-5 py-2 bg-navy-800 text-white font-medium rounded-lg hover:bg-navy-700 transition-colors text-sm"
            >
              Save CV
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">Full Name</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.fullName || "Not detected"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">Email</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.email || "Not detected"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">Phone</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.phone || "Not detected"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">Location</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.location || "Not detected"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">LinkedIn</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.linkedin || "Not detected"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide">GitHub</p>
              <p className="text-sm text-navy-900 mt-0.5">{parsedCV.github || "Not detected"}</p>
            </div>
          </div>

          {parsedCV.summary && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-1">Summary</p>
              <p className="text-sm text-navy-800">{parsedCV.summary}</p>
            </div>
          )}

          {parsedCV.skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {parsedCV.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-navy-100 text-navy-700 text-xs font-medium rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {parsedCV.experience.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Experience</p>
              <div className="space-y-3">
                {parsedCV.experience.map((exp, i) => (
                  <div key={i} className="pl-3 border-l-2 border-navy-200">
                    <p className="text-sm font-medium text-navy-900">{exp.company}</p>
                    <p className="text-xs text-navy-600">{exp.role} | {exp.startDate} - {exp.endDate}</p>
                    {exp.description && <p className="text-xs text-navy-500 mt-1">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {parsedCV.education.length > 0 && (
            <div>
              <p className="text-xs font-medium text-navy-500 uppercase tracking-wide mb-2">Education</p>
              <div className="space-y-2">
                {parsedCV.education.map((edu, i) => (
                  <div key={i} className="pl-3 border-l-2 border-navy-200">
                    <p className="text-sm font-medium text-navy-900">{edu.institution}</p>
                    <p className="text-xs text-navy-600">{edu.degree} {edu.field && `in ${edu.field}`}</p>
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
