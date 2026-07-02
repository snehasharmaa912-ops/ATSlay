import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <h1 className="text-2xl font-bold mb-6">Welcome back</h1>
      <form onSubmit={submit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm"
          required
        />
        {error && <p className="text-bad text-sm">{error}</p>}
        <button className="w-full py-3 rounded-xl bg-accent hover:bg-indigo-500 font-semibold">
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
