import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Navigation from "./components/Navigation";
import Dashboard from "./components/Dashboard";
import CVBuilder from "./components/CVBuilder";
import CVEditor from "./components/CVEditor";
import SocialImport from "./components/SocialImport";
import JobMatcher from "./components/JobMatcher";
import ApplicationTracker from "./components/ApplicationTracker";
import Settings from "./components/Settings";
import Auth from "./components/Auth";

function App() {
  const [user, setUser] = useState<NonNullable<ReturnType<typeof supabase.auth.getUser> extends Promise<{ data: { user: infer U } }> ? U : never> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-navy-800">Applico</h1>
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-navy-50">
        <Navigation />
        <main className="max-w-6xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/" element={<Dashboard userId={user.id} />} />
            <Route path="/cv-builder" element={<CVBuilder userId={user.id} />} />
            <Route path="/cv-editor" element={<CVEditor userId={user.id} />} />
            <Route path="/social-import" element={<SocialImport userId={user.id} />} />
            <Route path="/job-matcher" element={<JobMatcher userId={user.id} />} />
            <Route path="/applications" element={<ApplicationTracker userId={user.id} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
