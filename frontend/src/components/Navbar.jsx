import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
      <Link to="/" className="text-xl font-bold tracking-tight">
        ATS<span className="text-accent">lay</span>
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <Link to="/dashboard" className="hover:text-accent transition">
              Dashboard
            </Link>
            <Link to="/history" className="hover:text-accent transition">
              History
            </Link>
            <span className="text-slate-400">Hi, {user.name.split(" ")[0]}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-accent transition">
              Login
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg bg-accent hover:bg-indigo-500 transition"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
