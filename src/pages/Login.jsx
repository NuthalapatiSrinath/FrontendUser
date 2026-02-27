import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  LogIn, Loader2, Eye, EyeOff, ArrowRight, User, Lock, Shield, Sparkles,
  Zap, Star, KeyRound, CheckCircle, AlertCircle, X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { loginUser, clearError } from "../store/slices/authSlice";

/* ─── lightweight spring presets ─── */
const smooth = { type: "spring", stiffness: 250, damping: 28 };

/* ─── reusable variants ─── */
const fade = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { ...smooth, delay: i * 0.07 },
  }),
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const scaleFade = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: smooth },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.18 } },
};

/* ─── Floating blobs (CSS-driven, zero JS re-renders) ─── */
const Blobs = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/25 to-indigo-500/20 blur-3xl animate-blob" />
    <div className="absolute top-1/3 -right-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/15 blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-28 left-1/3 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-cyan-400/20 to-teal-400/15 blur-3xl animate-blob animation-delay-4000" />
  </div>
);

/* ─── Tiny sparkle dots (pure CSS) ─── */
const Dots = () => (
  <div className="pointer-events-none fixed inset-0 -z-10">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute h-1.5 w-1.5 rounded-full bg-white/40 animate-pulse-slow"
        style={{
          top: `${15 + i * 14}%`,
          left: `${10 + ((i * 17) % 80)}%`,
          animationDelay: `${i * 0.7}s`,
        }}
      />
    ))}
  </div>
);

/* ─── Animated Logo ─── */
const Logo = () => (
  <motion.div
    className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ ...smooth, delay: 0.1 }}
    whileHover={{ scale: 1.08, rotate: 5, transition: { duration: 0.25 } }}
  >
    <Shield className="h-8 w-8 text-white" />
  </motion.div>
);

/* ─── Input Component ─── */
const Input = ({ icon: Icon, label, error, delay = 0, ...props }) => {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      custom={delay}
      variants={fade}
      initial="hidden"
      animate="show"
      className="space-y-1.5"
    >
      <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      <div
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/50"
            : focused
            ? "border-blue-400 bg-blue-50/30 shadow-sm shadow-blue-200/40"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <input
          className="w-full rounded-xl bg-transparent px-4 py-3 text-gray-800 outline-none placeholder:text-gray-400"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-xs text-red-500 flex items-center gap-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="h-3 w-3" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Password Input ─── */
const PasswordInput = ({ label, error, delay = 0, ...props }) => {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      custom={delay}
      variants={fade}
      initial="hidden"
      animate="show"
      className="space-y-1.5"
    >
      <label className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
        <Lock className="h-3.5 w-3.5" />
        {label}
      </label>
      <div
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/50"
            : focused
            ? "border-blue-400 bg-blue-50/30 shadow-sm shadow-blue-200/40"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <input
          type={show ? "text" : "password"}
          className="w-full rounded-xl bg-transparent px-4 py-3 pr-12 text-gray-800 outline-none placeholder:text-gray-400"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-xs text-red-500 flex items-center gap-1"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="h-3 w-3" /> {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Feature pills ─── */
const features = [
  { icon: Zap, text: "Instant Access", color: "text-yellow-500" },
  { icon: Shield, text: "Secure Login", color: "text-blue-500" },
  { icon: Star, text: "Premium Keys", color: "text-purple-500" },
];

const FeaturePills = () => (
  <motion.div
    className="flex flex-wrap justify-center gap-2 mb-2"
    variants={fade}
    custom={1}
    initial="hidden"
    animate="show"
  >
    {features.map((f, i) => (
      <motion.div
        key={i}
        className="flex items-center gap-1.5 rounded-full bg-white/70 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-gray-600 shadow-sm border border-gray-100"
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <f.icon className={`h-3.5 w-3.5 ${f.color}`} />
        {f.text}
      </motion.div>
    ))}
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════
   LOGIN PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((s) => s.auth);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => dispatch(clearError());
  }, [dispatch]);

  /* live validation */
  useEffect(() => {
    const e = {};
    if (touched.username && !formData.username.trim())
      e.username = "Username is required";
    if (touched.password && !formData.password)
      e.password = "Password is required";
    setErrors(e);
  }, [formData, touched]);

  const onChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setTouched((p) => ({ ...p, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setTouched({ username: true, password: true });
      if (!formData.username.trim() || !formData.password) return;
      dispatch(loginUser(formData));
    },
    [dispatch, formData],
  );

  const isValid = formData.username.trim() && formData.password;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50/40 to-indigo-50/30 relative">
      <Blobs />
      <Dots />

      {/* ── Header ── */}
      <motion.header
        className="relative z-30 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 py-4 px-6 flex items-center gap-3 shadow-lg shadow-blue-500/20"
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={smooth}
      >
        <motion.div
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm"
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ duration: 0.25 }}
        >
          <KeyRound className="h-5 w-5 text-white" />
        </motion.div>
        <span className="text-white text-lg font-bold tracking-wide">
          PANEL RED
        </span>
        <motion.div
          className="ml-auto flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Sparkles className="h-3 w-3" /> User Portal
        </motion.div>
      </motion.header>

      {/* ── Main ── */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          className="w-full max-w-md"
          variants={scaleFade}
          initial="hidden"
          animate="show"
        >
          {/* Card */}
          <motion.div
            className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-xl shadow-gray-200/40 p-8 space-y-6"
            whileHover={{
              boxShadow: "0 25px 60px -12px rgba(59,130,246,0.15)",
            }}
            transition={{ duration: 0.3 }}
          >
            <Logo />

            <motion.div
              className="text-center space-y-1"
              variants={fade}
              custom={0.5}
              initial="hidden"
              animate="show"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                Welcome Back
              </h1>
              <p className="text-sm text-gray-500">Sign in to your account</p>
            </motion.div>

            <FeaturePills />

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-3"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 8 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  <span className="text-sm text-red-600 flex-1">{error}</span>
                  <button onClick={() => dispatch(clearError())}>
                    <X className="h-4 w-4 text-red-400 hover:text-red-600" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                icon={User}
                label="Username"
                name="username"
                placeholder="Enter your username"
                value={formData.username}
                onChange={onChange}
                error={errors.username}
                delay={2}
                autoComplete="username"
              />

              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={onChange}
                error={errors.password}
                delay={3}
                autoComplete="current-password"
              />

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading || !isValid}
                className={`w-full relative overflow-hidden rounded-xl py-3.5 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  isValid
                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                custom={4}
                variants={fade}
                initial="hidden"
                animate="show"
                whileHover={isValid ? { scale: 1.02, y: -1 } : {}}
                whileTap={isValid ? { scale: 0.98 } : {}}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}

                {/* shimmer */}
                {isValid && !isLoading && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                )}
              </motion.button>
            </form>

            {/* Link to register */}
            <motion.p
              className="text-center text-sm text-gray-500"
              variants={fade}
              custom={5}
              initial="hidden"
              animate="show"
            >
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
              >
                Create Account
              </Link>
            </motion.p>
          </motion.div>

          {/* Bottom badge */}
          <motion.div
            className="mt-6 flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <CheckCircle className="h-3 w-3 text-green-400" />
              Secured with end-to-end encryption
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <motion.footer
        className="py-4 text-center text-xs text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        © {new Date().getFullYear()} Panel Red. All rights reserved.
      </motion.footer>

      {/* ── Global CSS for blob animation ── */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.08); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-blob { animation: blob 8s ease-in-out infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.5); }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
