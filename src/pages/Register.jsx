import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  UserPlus, Loader2, Eye, EyeOff, ArrowRight, User, Lock, Shield, Sparkles,
  Zap, Star, KeyRound, CheckCircle, AlertCircle, X, Mail, Rocket,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, clearError, clearRegistered } from "../store/slices/authSlice";

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
    <div className="absolute -top-32 -right-32 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-purple-400/25 to-pink-500/20 blur-3xl animate-blob" />
    <div className="absolute top-1/3 -left-32 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-blue-400/20 to-indigo-400/15 blur-3xl animate-blob animation-delay-2000" />
    <div className="absolute -bottom-28 right-1/3 h-[380px] w-[380px] rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-400/15 blur-3xl animate-blob animation-delay-4000" />
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
          top: `${12 + i * 15}%`,
          left: `${8 + ((i * 19) % 82)}%`,
          animationDelay: `${i * 0.6}s`,
        }}
      />
    ))}
  </div>
);

/* ─── Animated Logo ─── */
const Logo = () => (
  <motion.div
    className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/30"
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ ...smooth, delay: 0.1 }}
    whileHover={{ scale: 1.08, rotate: 5, transition: { duration: 0.25 } }}
  >
    <Rocket className="h-8 w-8 text-white" />
  </motion.div>
);

/* ─── Input Component ─── */
const Input = ({ icon: Icon, label, error, success, delay = 0, ...props }) => {
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
        {success && (
          <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto" />
        )}
      </label>
      <div
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/50"
            : success
            ? "border-green-400 bg-green-50/30"
            : focused
            ? "border-purple-400 bg-purple-50/30 shadow-sm shadow-purple-200/40"
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
const PasswordInput = ({
  icon: Icon = Lock,
  label,
  error,
  success,
  delay = 0,
  strength,
  ...props
}) => {
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
        <Icon className="h-3.5 w-3.5" />
        {label}
        {success && (
          <CheckCircle className="h-3.5 w-3.5 text-green-500 ml-auto" />
        )}
      </label>
      <div
        className={`relative rounded-xl border-2 transition-all duration-200 ${
          error
            ? "border-red-400 bg-red-50/50"
            : success
            ? "border-green-400 bg-green-50/30"
            : focused
            ? "border-purple-400 bg-purple-50/30 shadow-sm shadow-purple-200/40"
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
          {show ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Password strength bar */}
      {strength !== undefined && strength > 0 && (
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((level) => (
            <motion.div
              key={level}
              className={`h-1 flex-1 rounded-full ${
                strength >= level
                  ? level <= 1
                    ? "bg-red-400"
                    : level <= 2
                    ? "bg-orange-400"
                    : level <= 3
                    ? "bg-yellow-400"
                    : "bg-green-400"
                  : "bg-gray-200"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: strength >= level ? 1 : 0 }}
              transition={{ duration: 0.3, delay: level * 0.05 }}
              style={{ originX: 0 }}
            />
          ))}
        </div>
      )}

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
  { icon: Zap, text: "Quick Setup", color: "text-yellow-500" },
  { icon: Shield, text: "Secure", color: "text-purple-500" },
  { icon: Star, text: "Free to Join", color: "text-pink-500" },
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

/* ─── Password Strength Calc ─── */
const calcStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9!@#$%^&*]/.test(pw)) s++;
  return s;
};

/* ─── Success Screen ─── */
const SuccessScreen = () => (
  <motion.div
    className="text-center space-y-4 py-6"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={smooth}
  >
    <motion.div
      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/30"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ ...smooth, delay: 0.2 }}
    >
      <CheckCircle className="h-10 w-10 text-white" />
    </motion.div>
    <motion.h2
      className="text-2xl font-bold text-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      Account Created!
    </motion.h2>
    <motion.p
      className="text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      Your account has been created successfully.
    </motion.p>
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Link
        to="/login"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-shadow"
      >
        Continue to Login <ArrowRight className="h-4 w-4" />
      </Link>
    </motion.div>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════════════
   REGISTER PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated, isRegistered } = useSelector(
    (s) => s.auth,
  );

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard", { replace: true });
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearRegistered());
    };
  }, [dispatch]);

  /* live validation */
  useEffect(() => {
    const e = {};
    if (touched.username && !formData.username.trim())
      e.username = "Username is required";
    else if (touched.username && formData.username.trim().length < 3)
      e.username = "At least 3 characters";

    if (touched.password && !formData.password)
      e.password = "Password is required";
    else if (touched.password && formData.password.length < 6)
      e.password = "At least 6 characters";

    if (touched.confirmPassword && !formData.confirmPassword)
      e.confirmPassword = "Confirm your password";
    else if (
      touched.confirmPassword &&
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    )
      e.confirmPassword = "Passwords do not match";

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
      setTouched({ username: true, password: true, confirmPassword: true });

      if (
        !formData.username.trim() ||
        formData.username.trim().length < 3 ||
        !formData.password ||
        formData.password.length < 6 ||
        formData.password !== formData.confirmPassword
      )
        return;

      dispatch(
        registerUser({
          username: formData.username.trim(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      );
    },
    [dispatch, formData],
  );

  const isValid =
    formData.username.trim().length >= 3 &&
    formData.password.length >= 6 &&
    formData.password === formData.confirmPassword;

  const pwStrength = calcStrength(formData.password);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-purple-50/40 to-pink-50/30 relative">
      <Blobs />
      <Dots />

      {/* ── Header ── */}
      <motion.header
        className="relative z-30 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 py-4 px-6 flex items-center gap-3 shadow-lg shadow-purple-500/20"
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
          <Sparkles className="h-3 w-3" /> Create Account
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
              boxShadow: "0 25px 60px -12px rgba(168,85,247,0.15)",
            }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {isRegistered ? (
                <SuccessScreen key="success" />
              ) : (
                <motion.div key="form" className="space-y-6">
                  <Logo />

                  <motion.div
                    className="text-center space-y-1"
                    variants={fade}
                    custom={0.5}
                    initial="hidden"
                    animate="show"
                  >
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                      Create Account
                    </h1>
                    <p className="text-sm text-gray-500">
                      Join Panel Red today
                    </p>
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
                        <span className="text-sm text-red-600 flex-1">
                          {error}
                        </span>
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
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={onChange}
                      error={errors.username}
                      success={
                        touched.username &&
                        !errors.username &&
                        formData.username.trim().length >= 3
                      }
                      delay={2}
                      autoComplete="username"
                    />

                    <PasswordInput
                      label="Password"
                      name="password"
                      placeholder="Create a password (min 6 chars)"
                      value={formData.password}
                      onChange={onChange}
                      error={errors.password}
                      success={
                        touched.password &&
                        !errors.password &&
                        formData.password.length >= 6
                      }
                      strength={touched.password ? pwStrength : undefined}
                      delay={3}
                      autoComplete="new-password"
                    />

                    <PasswordInput
                      label="Confirm Password"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={onChange}
                      error={errors.confirmPassword}
                      success={
                        touched.confirmPassword &&
                        !errors.confirmPassword &&
                        formData.confirmPassword &&
                        formData.password === formData.confirmPassword
                      }
                      delay={4}
                      autoComplete="new-password"
                    />

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      disabled={isLoading || !isValid}
                      className={`w-full relative overflow-hidden rounded-xl py-3.5 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                        isValid
                          ? "bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
                          : "bg-gray-300 cursor-not-allowed"
                      }`}
                      custom={5}
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
                          <UserPlus className="h-4 w-4" />
                          Create Account
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

                  {/* Link to login */}
                  <motion.p
                    className="text-center text-sm text-gray-500"
                    variants={fade}
                    custom={6}
                    initial="hidden"
                    animate="show"
                  >
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-semibold text-purple-500 hover:text-purple-600 transition-colors"
                    >
                      Sign In
                    </Link>
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>
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
              Your data is encrypted and secure
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
