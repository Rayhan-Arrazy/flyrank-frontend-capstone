import { useState, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { supabase, fetchChatSessions, createChatSession, deleteChatSession } from "./lib/supabase";
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
import Chat from "./components/Chat";
import FloatingChat from "./components/FloatingChat";

function App() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ? { id: data.session.user.id } : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ? { id: session.user.id } : null);
      },
    );

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
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" replace /> : <Landing />}
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {user && <AppLayout userId={user.id} />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-builder"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <CVBuilder userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/cv-editor"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <CVEditor userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/social-import"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <SocialImport userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-matcher"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <JobMatcher userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <ApplicationTracker userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <Settings />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              {user && (
                <AppLayout userId={user.id}>
                  <ChatPage userId={user.id} />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingChat />
    </BrowserRouter>
  );
}

function ChatPage({ userId }: { userId: string }) {
  const [sessions, setSessions] = useState<Array<{ id: string; title: string; updated_at: string }>>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const loadSessions = useCallback(async () => {
    try {
      const data = await fetchChatSessions(userId);
      setSessions(data || []);
    } catch {}
  }, [userId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleNewChat = async () => {
    try {
      const session = await createChatSession(userId);
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setShowSidebar(false);
    } catch {}
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await deleteChatSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) setActiveSessionId(null);
    } catch {}
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setShowSidebar(false);
  };

  return (
    <div className="relative flex gap-4 sm:gap-6 h-[calc(100vh-120px)]">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="sm:hidden fixed bottom-20 left-4 z-30 w-10 h-10 bg-navy-800 text-white rounded-full shadow-lg flex items-center justify-center"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile overlay */}
      {showSidebar && (
        <div className="sm:hidden fixed inset-0 z-20 bg-black/30" onClick={() => setShowSidebar(false)} />
      )}

      {/* Sidebar */}
      <div className={`
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}
        sm:translate-x-0
        fixed sm:relative inset-y-0 left-0 z-20
        w-64 flex-shrink-0 bg-white rounded-xl shadow-sm border border-navy-100 flex flex-col overflow-hidden
        transition-transform duration-200
      `}>
        <div className="p-3 border-b border-navy-100">
          <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-navy-800 text-white text-sm rounded-lg hover:bg-navy-700 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {sessions.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No conversations yet</p>}
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center group">
              <button onClick={() => handleSelectSession(s.id)} className={`flex-1 text-left px-3 py-2 rounded-lg text-sm truncate transition-colors ${activeSessionId === s.id ? "bg-navy-100 text-navy-900" : "hover:bg-gray-50 text-gray-700"}`}>
                {s.title}
              </button>
              <button onClick={() => handleDeleteSession(s.id)} className="mr-1 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all" aria-label="Delete">
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-navy-100 overflow-hidden">
        <Chat userId={userId} sessionId={activeSessionId} />
      </div>
    </div>
  );
}

function AppLayout({
  userId,
  children,
}: {
  userId: string;
  children?: React.ReactNode;
}) {
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
