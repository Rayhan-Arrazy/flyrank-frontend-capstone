import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import CVBuilder from "./components/CVBuilder";
import CVEditor from "./components/CVEditor";
import SocialImport from "./components/SocialImport";
import JobMatcher from "./components/JobMatcher";
import ApplicationTracker from "./components/ApplicationTracker";
import Settings from "./components/Settings";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-50">
        <Navigation />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cv-builder" element={<CVBuilder />} />
            <Route path="/cv-editor" element={<CVEditor />} />
            <Route path="/social-import" element={<SocialImport />} />
            <Route path="/job-matcher" element={<JobMatcher />} />
            <Route path="/applications" element={<ApplicationTracker />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
