import { useState, useRef, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Mountain,
  Key,
  Zap,
  ChevronDown,
  Settings,
  LogOut,
  LayoutDashboard,
  Wallet,
} from "lucide-react";
import { logout } from "../store/slices/authSlice";
import { clearDashboard } from "../store/slices/dashboardSlice";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const DashboardLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/user/auth/logout");
    } catch {
      // ignore
    }
    dispatch(logout());
    dispatch(clearDashboard());
    toast.success("Logged out");
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/keys", icon: Key, label: "Keys" },
    { to: "/generate", icon: Zap, label: "Generate" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50/20 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 w-full shadow-lg shadow-blue-500/15 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo + Nav Links */}
            <div className="flex items-center gap-5">
              <Link
                to="/dashboard"
                className="flex items-center gap-2.5 text-white group"
              >
                <div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center backdrop-blur-sm group-hover:bg-white/25 transition-colors">
                  <Mountain className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold tracking-wide hidden sm:block">
                  ELEVEN
                </span>
              </Link>

              <div className="h-5 w-px bg-white/20 hidden sm:block" />

              <div className="flex items-center gap-0.5">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.to)
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <link.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{link.label}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Balance + User Dropdown */}
            <div className="flex items-center gap-3">
              {/* Balance Badge */}
              <div className="hidden sm:flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5 text-white/90">
                <Wallet className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">
                  Rp {(user?.balance || 0).toLocaleString()}
                </span>
              </div>

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-white hover:bg-white/10 px-2.5 py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center text-sm font-bold ring-2 ring-white/20">
                    {user?.username?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {user?.username || "User"}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200/60 py-1 z-50 animate-slideDown">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-800">
                        {user?.username}
                      </p>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">
                        {user?.role} &middot; Rp{" "}
                        {(user?.balance || 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-400" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400 border-t border-slate-200/60">
        <div className="flex items-center justify-center gap-2">
          <Mountain className="w-3.5 h-3.5" />
          <span>&copy; {new Date().getFullYear()} ELEVEN-PANEL</span>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
