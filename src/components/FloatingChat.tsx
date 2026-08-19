import { useState, useEffect, useCallback } from "react";
import { supabase, fetchChatSessions, createChatSession, deleteChatSession } from "../lib/supabase";
import Chat from "./Chat";

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user?.id || null);
    });
  }, []);

  const loadSessions = useCallback(async () => {
    if (!userId) return;
    try {
      const data = await fetchChatSessions(userId);
      setSessions(data || []);
    } catch {
      // ignore
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      loadSessions();
    }
  }, [isOpen, userId, loadSessions]);

  const handleNewChat = async () => {
    if (!userId || creating) return;
    setCreating(true);
    try {
      const session = await createChatSession(userId);
      setSessions((prev) => [session, ...prev]);
      setActiveSessionId(session.id);
      setShowSidebar(false);
    } catch (err) {
      console.error("Failed to create chat:", err);
    } finally {
      setCreating(false);
    }
  };

  const handleSelectSession = (id: string) => {
    setActiveSessionId(id);
    setShowSidebar(false);
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await deleteChatSession(id);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      if (activeSessionId === id) {
        setActiveSessionId(null);
      }
    } catch {
      // ignore
    }
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  if (!userId) return null;

  return (
    <>
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-navy-800 text-white rounded-full shadow-lg hover:bg-navy-700 transition-all flex items-center justify-center"
        aria-label="Open chat"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Popout Chat Window */}
      {isOpen && (
        <>
          {/* Mobile: full screen overlay */}
          <div
            className="fixed inset-0 z-50 bg-black/30 sm:hidden"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed z-50 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden
            inset-0 sm:inset-auto sm:bottom-24 sm:right-4 sm:w-[380px] sm:h-[520px] sm:max-h-[80vh]
          ">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 bg-navy-800 text-white flex-shrink-0">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className="p-1.5 hover:bg-navy-700 rounded transition-colors"
                  aria-label="Toggle chat history"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showSidebar ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
                <span className="font-semibold text-sm">
                  {showSidebar ? "Chat History" : "Career Coach"}
                </span>
              </div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={handleNewChat}
                  disabled={creating}
                  className="p-1.5 hover:bg-navy-700 rounded transition-colors disabled:opacity-50"
                  aria-label="New chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-navy-700 rounded transition-colors"
                  aria-label="Close chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar: Session List */}
            {showSidebar && (
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <button
                    onClick={handleNewChat}
                    disabled={creating}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-navy-700 hover:bg-navy-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {creating ? "Creating..." : "New Chat"}
                  </button>
                </div>
                <div className="px-2 pb-2 space-y-0.5">
                  {sessions.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No conversations yet</p>
                  )}
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => handleSelectSession(session.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors group ${
                        activeSessionId === session.id
                          ? "bg-navy-100 text-navy-900"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-sm truncate">{session.title}</p>
                        <p className="text-xs text-gray-400">{formatTime(session.updated_at)}</p>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(session.id, e)}
                        className="ml-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-50 rounded transition-all"
                        aria-label="Delete chat"
                      >
                        <svg className="w-3.5 h-3.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Body */}
            {!showSidebar && (
              <div className="flex-1 overflow-hidden">
                <Chat userId={userId} sessionId={activeSessionId} />
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
