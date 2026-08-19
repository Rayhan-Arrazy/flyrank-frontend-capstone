import { useState, useRef, useEffect, useCallback } from "react";
import { fetchCVs, insertChatMessage, fetchChatMessages, updateChatSessionTitle } from "../lib/supabase";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatProps {
  userId: string;
  sessionId: string | null;
}

export default function Chat({ userId, sessionId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [stopRequested, setStopRequested] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cvDataRef = useRef<unknown>(null);
  const hasLoadedRef = useRef<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load CV data once
  useEffect(() => {
    if (!userId) return;
    fetchCVs(userId).then((cvs) => {
      cvDataRef.current = cvs?.[0] || null;
    }).catch(() => {});
  }, [userId]);

  // Load messages when session changes
  useEffect(() => {
    if (!sessionId) {
      setMessages([]);
      hasLoadedRef.current = null;
      return;
    }
    if (hasLoadedRef.current === sessionId) return;
    hasLoadedRef.current = sessionId;

    setLoadingMessages(true);
    fetchChatMessages(sessionId)
      .then((rows) => {
        setMessages(
          rows.map((r) => ({ id: r.id, role: r.role as "user" | "assistant", content: r.content }))
        );
      })
      .catch(() => setMessages([]))
      .finally(() => setLoadingMessages(false));
  }, [sessionId]);

  useEffect(() => {
    if (!isStreaming) scrollToBottom();
  }, [messages, isStreaming]);

  const saveMessage = useCallback(
    async (sessionId: string, role: "user" | "assistant", content: string) => {
      try {
        return await insertChatMessage(sessionId, role, content);
      } catch {
        return null;
      }
    },
    []
  );

  const generateTitle = useCallback(
    async (sessionId: string, firstMessage: string) => {
      const title = firstMessage.length > 40 ? firstMessage.slice(0, 40) + "..." : firstMessage;
      try {
        await updateChatSessionTitle(sessionId, title);
      } catch {
        // ignore
      }
    },
    []
  );

  const handleSend = async () => {
    if (!input.trim() || isLoading || !sessionId) return;

    const userContent = input.trim();
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userContent,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setIsStreaming(true);
    setStopRequested(false);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
    };
    setMessages((prev) => [...prev, assistantMessage]);

    // Save user message to DB
    const isFirstMessage = messages.length === 0;
    saveMessage(sessionId, "user", userContent);
    if (isFirstMessage) {
      generateTitle(sessionId, userContent);
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userContent,
          history: messages.map((m) => ({ role: m.role, content: m.content })),
          cvData: cvDataRef.current,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      let fullContent = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done || stopRequested) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim());

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            fullContent += data;
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              if (last.role === "assistant") {
                last.content = fullContent;
              }
              return updated;
            });
          }
        }
      }

      // Save assistant message to DB
      if (fullContent) {
        saveMessage(sessionId, "assistant", fullContent);
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Stream stopped by user");
      } else {
        console.error("Chat error:", error);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last.role === "assistant") {
            last.content = `Error: ${error.message || "Something went wrong. Please try again."}`;
          }
          return updated;
        });
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const handleStop = () => {
    setStopRequested(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  if (!sessionId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Select a chat or start a new one
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingMessages && (
          <div className="text-center text-gray-400 text-sm py-8">Loading messages...</div>
        )}
        {!loadingMessages && messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <p className="text-lg font-medium text-gray-500">Talk to Applico AI</p>
            <p className="text-sm mt-2">
              Your personal career coach — get advice on CV, interviews, job search, and more
            </p>
            <div className="mt-6 space-y-2 max-w-sm mx-auto text-left">
              <p className="text-xs text-gray-400">Try asking:</p>
              <button onClick={() => setInput("Review my CV and suggest improvements")} className="block w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">"Review my CV and suggest improvements"</button>
              <button onClick={() => setInput("How should I prepare for a Google interview?")} className="block w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">"How should I prepare for a Google interview?"</button>
              <button onClick={() => setInput("Help me write a cover letter for a software engineer role at Netflix")} className="block w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">"Help me write a cover letter for Netflix"</button>
              <button onClick={() => setInput("How do I negotiate my salary offer?")} className="block w-full text-left text-xs text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors">"How do I negotiate my salary offer?"</button>
            </div>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 whitespace-pre-wrap text-sm ${
                msg.role === "user"
                  ? "bg-navy-800 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {msg.content ||
                (isLoading && msg.role === "assistant" && (
                  <span className="inline-flex gap-1">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce delay-100">●</span>
                    <span className="animate-bounce delay-200">●</span>
                  </span>
                ))}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-3 flex gap-2 bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
          disabled={isLoading}
        />
        {isStreaming ? (
          <button
            onClick={handleStop}
            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
          >
            Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-3 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-700 disabled:opacity-50 text-sm"
          >
            Send
          </button>
        )}
      </div>
    </div>
  );
}
