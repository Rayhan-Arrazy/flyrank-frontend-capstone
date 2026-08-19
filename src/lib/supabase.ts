import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

// CV operations
export async function fetchCVs(userId: string) {
  const { data, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertCV(userId: string, cv: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("cvs")
    .insert({ ...cv, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCV(cvId: string, updates: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("cvs")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", cvId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCV(cvId: string) {
  const { error } = await supabase.from("cvs").delete().eq("id", cvId);
  if (error) throw error;
}

// Application operations
export async function fetchApplications(userId: string) {
  const { data, error } = await supabase
    .from("applications")
    .select("*, cvs(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function insertApplication(
  userId: string,
  application: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("applications")
    .insert({ ...application, user_id: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateApplication(
  appId: string,
  updates: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("applications")
    .update(updates)
    .eq("id", appId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteApplication(appId: string) {
  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", appId);
  if (error) throw error;
}

// Job Suggestions operations
export async function fetchJobSuggestions(userId: string, cvId?: string) {
  let query = supabase
    .from("job_suggestions")
    .select("*")
    .eq("user_id", userId)
    .order("match_score", { ascending: false });

  if (cvId) {
    query = query.eq("cv_id", cvId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function insertJobSuggestions(
  userId: string,
  cvId: string,
  suggestions: Array<Record<string, unknown>>,
) {
  const rows = suggestions.map((s) => ({
    ...s,
    user_id: userId,
    cv_id: cvId,
  }));
  const { data, error } = await supabase
    .from("job_suggestions")
    .insert(rows)
    .select();
  if (error) throw error;
  return data;
}

export async function deleteJobSuggestions(cvId: string) {
  const { error } = await supabase
    .from("job_suggestions")
    .delete()
    .eq("cv_id", cvId);
  if (error) throw error;
}

// Chat Session operations
export async function fetchChatSessions(userId: string) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createChatSession(userId: string, title?: string) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert({ user_id: userId, title: title || "New Chat" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateChatSessionTitle(sessionId: string, title: string) {
  const { error } = await supabase
    .from("chat_sessions")
    .update({ title, updated_at: new Date().toISOString() })
    .eq("id", sessionId);
  if (error) throw error;
}

export async function deleteChatSession(sessionId: string) {
  const { error } = await supabase
    .from("chat_sessions")
    .delete()
    .eq("id", sessionId);
  if (error) throw error;
}

// Chat Message operations
export async function fetchChatMessages(sessionId: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function insertChatMessage(
  sessionId: string,
  role: "user" | "assistant",
  content: string
) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ session_id: sessionId, role, content })
    .select()
    .single();
  if (error) throw error;
  return data;
}
