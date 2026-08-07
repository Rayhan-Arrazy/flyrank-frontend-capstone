import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase";
import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";
import CVBuilder from "./components/CVBuilder";
import CVEditor from "./components/CVEditor";
import SocialImport from "./components/SocialImport";
import JobMatcher from "./components/JobMatcher";
import ApplicationTracker from "./components/ApplicationTracker";
import Settings from "./components/Settings";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? { id: data.session.user.id } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id } : null);
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

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-builder"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <CVBuilder userId={user!.id} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-editor"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <CVEditor userId={user!.id} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-import"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <SocialImport userId={user!.id} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-matcher"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <JobMatcher userId={user!.id} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <ApplicationTracker userId={user!.id} />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <AppLayout userId={user!.id}>
                <Settings />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

function AppLayout({ userId, children }: { userId: string; children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy-50">
      <Navigation />
      <main className="max-w-6xl mx-auto px-6 py-8">
        {children || <Dashboard userId={userId} />}
      </main>
    </div>
  );
}

export default App;
