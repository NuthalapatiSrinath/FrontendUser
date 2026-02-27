import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mountain, UserPlus, Loader2, Gift } from "lucide-react";
import { clearError } from "../store/slices/authSlice";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    referralCode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) navigate("/dashboard");
  }, [dispatch, isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/user/auth/register", formData);
      toast.success(res.data.message || "Registration successful!");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400";

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
          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-200/60 p-7">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Create Account
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Join ELEVEN-PANEL today
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200/60 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm font-medium animate-scaleIn">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Choose a username"
                  autoComplete="username"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Create a password"
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Gift className="w-3.5 h-3.5 text-blue-500" />
                    Referral Code
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </span>
                </label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="Enter referral code"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-4 py-3 rounded-xl transition-all shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6 bg-white rounded-xl shadow-sm border border-slate-200/60 py-4">
            <span className="text-sm text-slate-500">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Sign in here
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

export default Register;
