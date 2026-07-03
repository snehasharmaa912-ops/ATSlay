import { Link, useNavigate } from "react-router-dom";
import { Target, LayoutDashboard, History, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
        <span className="w-8 h-8 rounded-lg bg-accent/15 flex items-center justify-center">
          <Target size={18} className="text-accent" />
        </span>
        ATS<span className="text-accent">lay</span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-4 text-sm">
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 hover:text-accent transition"
            >
              <LayoutDashboard size={15} />
              <span className="hidden xs:inline">Dashboard</span>
            </Link>
            <Link
              to="/history"
              className="flex items-center gap-1.5 hover:text-accent transition"
            >
              <History size={15} />
              <span className="hidden xs:inline">History</span>
            </Link>
            <span className="hidden md:inline text-slate-400">
              Hi, {user.name.split(" ")[0]}
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition"
            >
              <LogOut size={14} />
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
