import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import ApplicationTracker from "./components/ApplicationTracker";
import CVUploader from "./components/CVUploader";
import CVEditor from "./components/CVEditor";
import CVSpreader from "./components/CVSpreader";
import Settings from "./components/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-50">
        <Navigation />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/cv-manager" element={<CVManager />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function CVManager() {
  const [tab, setTab] = useState<"upload" | "editor" | "spread">("upload");
  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["upload", "editor", "spread"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${tab === t ? "bg-navy-800 text-white" : "bg-white text-navy-700 hover:bg-navy-100 border border-navy-200"}`}>
            {t === "upload" ? "Upload" : t === "editor" ? "Editor" : "Manage"}
          </button>
        ))}
      </div>
      {tab === "upload" && <CVUploader />}
      {tab === "editor" && <CVEditor />}
      {tab === "spread" && <CVSpreader />}
    </div>
  );
}

export default App;
