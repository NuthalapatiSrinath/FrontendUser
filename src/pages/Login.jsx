import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, X, Mountain, Loader2, Shield } from "lucide-react";
import { loginUser, clearError } from "../store/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth,
  );

  const [showWelcome, setShowWelcome] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) navigate("/dashboard");
  }, [dispatch, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) return;
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 w-full py-3.5 px-6 flex items-center gap-3 shadow-lg shadow-blue-500/20">
        <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
          <Mountain className="w-5 h-5 text-white" />
        </div>
        <span className="text-white text-xl font-bold tracking-wide">
          ELEVEN-PANEL
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Welcome Banner */}
          {showWelcome && (
            <div className="bg-blue-50 border border-blue-200/60 rounded-xl px-4 py-3 mb-5 flex items-center justify-between animate-slideDown shadow-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700 font-semibold text-sm">
                  Welcome Stranger
                </span>
              </div>
              <button
                onClick={() => setShowWelcome(false)}
                className="text-blue-400 hover:text-blue-600 transition-colors cursor-pointer p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-7">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
              <p className="text-sm text-slate-500 mt-1">Access your account</p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium animate-scaleIn">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>

              <div className="mb-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  id="stayLoggedIn"
                  checked={stayLoggedIn}
                  onChange={(e) => setStayLoggedIn(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <label
                  htmlFor="stayLoggedIn"
                  className="text-sm text-slate-600 cursor-pointer select-none"
                >
                  Stay logged in
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
                {isLoading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </div>

          {/* Register Link */}
          <div className="text-center mt-6 bg-white rounded-xl shadow-sm border border-slate-200/60 py-4">
            <span className="text-sm text-slate-500">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Register here
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-slate-400">
        &copy; {new Date().getFullYear()} ELEVEN-PANEL
      </footer>
    </div>
  );
};

export default Login;
