import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const handleAuth = async () => {
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Check your email for confirmation!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Applico</h1>
      <p className="text-gray-500 mb-6">AI-Powered CV Builder</p>

      <div className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
        >
          {loading ? "Loading..." : mode === "signin" ? "Sign In" : "Sign Up"}
        </button>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="w-full text-sm text-blue-500 hover:underline"
        >
          {mode === "signin" ? "Create an account" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
}
