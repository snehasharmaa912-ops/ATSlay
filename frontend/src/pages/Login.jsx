import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 px-6">
      <div className="w-12 h-12 rounded-xl bg-accent/15 flex items-center justify-center mb-5">
        <LogIn size={22} className="text-accent" />
      </div>
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent"
            required
          />
        </div>
        <div className="relative">
          <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-accent"
            required
          />
        </div>
        {error && (
          <p className="text-bad text-sm flex items-center gap-1.5">
            <AlertCircle size={14} />
            {error}
          </p>
        )}
        <button className="w-full py-3 rounded-xl bg-accent hover:bg-indigo-500 font-semibold transition">
          Login
        </button>
      </form>
      <p className="text-sm text-slate-500 mt-4">
        No account?{" "}
        <Link to="/register" className="text-accent">
          Register
        </Link>
      </p>
    </div>
  );
}
