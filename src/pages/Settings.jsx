import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import {
  Settings as SettingsIcon, User, Mail, Lock, Eye, EyeOff, Shield,
  Bell, Moon, Sun, Globe, Palette, Key, RefreshCw, Check, X,
  CheckCircle, AlertCircle, AlertTriangle, ChevronRight, ChevronDown,
  Camera, Upload, Edit, Save, Trash2, LogOut, Smartphone, Monitor,
  Laptop, Fingerprint, Clock, Calendar, Hash, Star, Sparkles,
  Zap, Award, Crown, Target, Heart, Activity, BarChart2, PieChart,
  TrendingUp, ArrowUpRight, ArrowDownRight, Link, Bookmark, Tag,
  Package, Gift, Rocket, Database, Cloud, Server, Cpu, Wifi, Terminal,
  Code, Circle, Hexagon, Triangle, Diamond, Layers, CreditCard
} from "lucide-react";
import { logout } from "../store/slices/authSlice";
import axiosInstance from "../api/axiosInstance";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
};

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  hover: {
    y: -5,
    scale: 1.01,
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.12)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const inputVariants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
  focus: { scale: 1.02, boxShadow: "0 4px 20px -5px rgba(59, 130, 246, 0.2)" },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.02, boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.4)" },
  tap: { scale: 0.98 },
};

const sectionVariants = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

const switchVariants = {
  on: { x: 20, backgroundColor: "#ffffff" },
  off: { x: 2, backgroundColor: "#ffffff" },
};

const alertVariants = {
  initial: { opacity: 0, y: -20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 200, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatVariants = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 3, -3, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const spinVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: "linear" },
  },
};

// ============================================================================
// ANIMATED BACKGROUND
// ============================================================================

const AnimatedBackground = () => {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 25, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 25, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 100);
      mouseY.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundGradient = useMotionTemplate`
    radial-gradient(700px circle at ${springX}% ${springY}%, rgba(59, 130, 246, 0.06), transparent 50%)
  `;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ background: backgroundGradient }}
    />
  );
};

// ============================================================================
// FLOATING PARTICLES
// ============================================================================

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
      color: ["bg-blue-400/15", "bg-indigo-400/15", "bg-purple-400/15"][Math.floor(Math.random() * 3)],
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full ${particle.color}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 30 - 15, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// ANIMATED INPUT COMPONENT
// ============================================================================

const AnimatedInput = ({ icon: Icon, label, type = "text", value, onChange, error, disabled, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div className="space-y-2" variants={inputVariants}>
      <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-slate-400" />}
        {label}
      </label>
      <div className="relative">
        <motion.input
          type={type === "password" && showPassword ? "text" : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3 rounded-xl bg-white/90 backdrop-blur-xl border transition-all duration-300
            ${error ? "border-red-400 focus:ring-red-400/20" : "border-slate-200/60 focus:border-blue-400 focus:ring-blue-400/20"}
            focus:ring-2 outline-none text-slate-700 placeholder:text-slate-400
            disabled:bg-slate-100 disabled:cursor-not-allowed
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={isFocused ? "focus" : "initial"}
        />
        {type === "password" && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </motion.button>
        )}
        {!error && isFocused && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-blue-400/30 pointer-events-none"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-sm text-red-500 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// ANIMATED TOGGLE SWITCH
// ============================================================================

const AnimatedToggle = ({ isOn, onToggle, label, description }) => {
  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl bg-white/80 border border-slate-200/60 hover:bg-white transition-colors"
      whileHover={{ x: 5 }}
    >
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <motion.button
        onClick={onToggle}
        className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${
          isOn ? "bg-gradient-to-r from-blue-500 to-indigo-500" : "bg-slate-300"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-0.5 w-6 h-6 rounded-full shadow-md"
          variants={switchVariants}
          animate={isOn ? "on" : "off"}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// PROFILE AVATAR COMPONENT
// ============================================================================

const ProfileAvatar = ({ user, size = "large" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-20 h-20 text-2xl",
    large: "w-32 h-32 text-4xl",
  };

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-xl`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        animate={{
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(99, 102, 241, 0.4)"
            : "0 10px 20px -5px rgba(99, 102, 241, 0.2)",
        }}
      >
        {user?.username?.charAt(0).toUpperCase() || "U"}
      </motion.div>
      <motion.button
        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white shadow-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-500 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Camera className="w-5 h-5" />
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// SETTINGS SECTION COMPONENT
// ============================================================================

const SettingsSection = ({ icon: Icon, title, description, children, delay = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
      variants={sectionVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
      whileHover="hover"
    >
      {/* Header */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 flex items-center justify-between bg-gradient-to-r from-slate-50/80 to-white border-b border-slate-200/60 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 10 }}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            {description && <p className="text-sm text-slate-500">{description}</p>}
          </div>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-slate-400" />
        </motion.div>
      </motion.button>

      {/* Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================================

const PasswordStrengthIndicator = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "Enter password", color: "bg-slate-200" };
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const colors = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-emerald-500"];
    return { score, label: labels[Math.min(score, 4)], color: colors[Math.min(score, 4)] };
  }, [password]);

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <motion.div
            key={level}
            className={`h-1.5 flex-1 rounded-full ${level <= strength.score ? strength.color : "bg-slate-200"}`}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: level * 0.1 }}
          />
        ))}
      </div>
      <p className={`text-xs ${strength.score >= 3 ? "text-emerald-600" : "text-slate-500"}`}>
        {strength.label}
      </p>
    </div>
  );
};

// ============================================================================
// SUCCESS ALERT
// ============================================================================

const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
      variants={alertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <CheckCircle className="w-6 h-6" />
      </motion.div>
      <span className="font-medium">{message}</span>
      <motion.button
        onClick={onClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// ERROR ALERT
// ============================================================================

const ErrorAlert = ({ message, onClose }) => {
  return (
    <motion.div
      className="fixed top-6 right-6 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-lg flex items-center gap-3"
      variants={alertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AlertCircle className="w-6 h-6" />
      <span className="font-medium">{message}</span>
      <motion.button
        onClick={onClose}
        className="ml-2 p-1 rounded-lg hover:bg-white/20"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// LOGOUT CONFIRMATION MODAL
// ============================================================================

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md overflow-hidden"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="p-8 text-center">
            <motion.div
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <LogOut className="w-10 h-10 text-red-500" />
            </motion.div>

            <h3 className="text-2xl font-bold text-slate-800 mb-2">Sign Out?</h3>
            <p className="text-slate-500 mb-8">
              Are you sure you want to sign out of your account?
            </p>

            <div className="flex gap-4">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={onConfirm}
                className="flex-1 py-3 rounded-xl font-semibold bg-gradient-to-r from-red-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Out
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// ACCOUNT INFO DISPLAY
// ============================================================================

const AccountInfoDisplay = ({ user }) => {
  const accountInfo = [
    { icon: User, label: "Username", value: user?.username || "N/A" },
    { icon: Mail, label: "Email", value: user?.email || "N/A" },
    { icon: Shield, label: "Role", value: user?.role || "user" },
    { icon: CreditCard, label: "Balance", value: `$${user?.balance || 0}` },
    { icon: Calendar, label: "Member Since", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A" },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      {accountInfo.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/80 hover:bg-slate-100 transition-colors"
            variants={staggerItemVariants}
            whileHover={{ x: 5 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className="text-sm font-medium text-slate-700">{item.value}</p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// CHANGE PASSWORD FORM
// ============================================================================

const ChangePasswordForm = ({ onSuccess, onError }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!currentPassword) newErrors.currentPassword = "Current password is required";
    if (!newPassword) newErrors.newPassword = "New password is required";
    if (newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await axiosInstance.post("/user/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onSuccess("Password changed successfully!");
    } catch (err) {
      onError(err.response?.data?.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <AnimatedInput
        icon={Lock}
        label="Current Password"
        type="password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        error={errors.currentPassword}
        placeholder="Enter your current password"
      />

      <AnimatedInput
        icon={Key}
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        error={errors.newPassword}
        placeholder="Enter your new password"
      />

      {newPassword && <PasswordStrengthIndicator password={newPassword} />}

      <AnimatedInput
        icon={Shield}
        label="Confirm New Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        placeholder="Confirm your new password"
      />

      <motion.button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        {isLoading ? (
          <motion.div className="flex items-center justify-center gap-2" variants={spinVariants} animate="animate">
            <RefreshCw className="w-5 h-5" />
            <span>Changing Password...</span>
          </motion.div>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <Save className="w-5 h-5" />
            <span>Update Password</span>
          </span>
        )}
      </motion.button>
    </form>
  );
};

// ============================================================================
// NOTIFICATION SETTINGS
// ============================================================================

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    email: true,
    push: false,
    sms: false,
    keyGenerated: true,
    keyUsed: true,
    security: true,
  });

  const toggleSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationOptions = [
    { key: "email", label: "Email Notifications", description: "Receive updates via email" },
    { key: "push", label: "Push Notifications", description: "Browser push notifications" },
    { key: "keyGenerated", label: "Key Generated", description: "When a new key is created" },
    { key: "keyUsed", label: "Key Activated", description: "When a key is registered" },
    { key: "security", label: "Security Alerts", description: "Important security updates" },
  ];

  return (
    <motion.div
      className="space-y-3"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      {notificationOptions.map((option) => (
        <motion.div key={option.key} variants={staggerItemVariants}>
          <AnimatedToggle
            isOn={settings[option.key]}
            onToggle={() => toggleSetting(option.key)}
            label={option.label}
            description={option.description}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// APPEARANCE SETTINGS
// ============================================================================

const AppearanceSettings = () => {
  const [theme, setTheme] = useState("light");

  const themes = [
    { value: "light", label: "Light", icon: Sun, color: "from-amber-400 to-orange-400" },
    { value: "dark", label: "Dark", icon: Moon, color: "from-slate-700 to-slate-900" },
    { value: "system", label: "System", icon: Monitor, color: "from-blue-400 to-indigo-400" },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500 mb-4">Choose your preferred theme</p>
      <div className="grid grid-cols-3 gap-4">
        {themes.map((t, index) => {
          const IconComponent = t.icon;
          return (
            <motion.button
              key={t.value}
              onClick={() => setTheme(t.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                theme === t.value
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-md`}
                whileHover={{ rotate: 10 }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>
              <p className="text-sm font-medium text-slate-700">{t.label}</p>
              {theme === t.value && (
                <motion.div
                  className="absolute top-2 right-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// SECURITY SETTINGS
// ============================================================================

const SecuritySettings = () => {
  const [twoFactor, setTwoFactor] = useState(false);

  const securityOptions = [
    { key: "twoFactor", label: "Two-Factor Authentication", description: "Add an extra layer of security", enabled: twoFactor },
    { key: "sessions", label: "Active Sessions", description: "Manage logged in devices", action: true },
    { key: "activity", label: "Login Activity", description: "View recent login history", action: true },
  ];

  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      <AnimatedToggle
        isOn={twoFactor}
        onToggle={() => setTwoFactor(!twoFactor)}
        label="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      />

      {[
        { icon: Smartphone, label: "Active Sessions", description: "1 active session" },
        { icon: Activity, label: "Login Activity", description: "View recent logins" },
      ].map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.button
            key={index}
            className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/80 border border-slate-200/60 hover:bg-white transition-colors text-left"
            variants={staggerItemVariants}
            whileHover={{ x: 5 }}
          >
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.1 }}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-700">{item.label}</p>
              <p className="text-xs text-slate-400">{item.description}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// DANGER ZONE
// ============================================================================

const DangerZone = ({ onLogout }) => {
  return (
    <motion.div
      className="space-y-4"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      <motion.div
        className="p-4 rounded-xl bg-red-50 border border-red-200"
        variants={staggerItemVariants}
      >
        <div className="flex items-center gap-3 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h4 className="font-semibold text-red-700">Danger Zone</h4>
        </div>
        <p className="text-sm text-red-600 mb-4">
          These actions are irreversible. Please proceed with caution.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <motion.button
            onClick={onLogout}
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-white border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </motion.button>

          <motion.button
            className="flex-1 py-3 px-4 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Trash2 className="w-5 h-5" />
            <span>Delete Account</span>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// MAIN SETTINGS COMPONENT
// ============================================================================

const Settings = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const handleSuccess = useCallback((message) => {
    setSuccessMessage(message);
  }, []);

  const handleError = useCallback((message) => {
    setErrorMessage(message);
  }, []);

  return (
    <motion.div
      className="min-h-screen relative"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatedBackground />
      <FloatingParticles />

      {/* Alerts */}
      <AnimatePresence>
        {successMessage && (
          <SuccessAlert message={successMessage} onClose={() => setSuccessMessage("")} />
        )}
        {errorMessage && (
          <ErrorAlert message={errorMessage} onClose={() => setErrorMessage("")} />
        )}
      </AnimatePresence>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />

      <div className="relative z-10 p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Account Settings</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">Settings</h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Manage your account settings, preferences, and security options
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 overflow-hidden shadow-2xl relative"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {/* Background effects */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20"
            animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
            style={{ backgroundSize: "200% 100%" }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          {/* Floating shapes */}
          {[Sparkles, Star, Crown, Rocket].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10"
              style={{
                left: `${20 + i * 20}%`,
                top: `${20 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -15, 0],
                rotate: [0, 180, 360],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{ duration: 5 + i, repeat: Infinity }}
            >
              <Icon className="w-10 h-10" />
            </motion.div>
          ))}

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <ProfileAvatar user={user} size="large" />
            <div className="text-center md:text-left">
              <motion.h2
                className="text-3xl font-bold text-white mb-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {user?.username || "User"}
              </motion.h2>
              <motion.p
                className="text-white/70 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {user?.email || "user@example.com"}
              </motion.p>
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-xl text-white text-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user?.role || "user"} Account</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Settings Sections */}
        <SettingsSection
          icon={User}
          title="Account Information"
          description="View your account details"
          delay={0.1}
        >
          <AccountInfoDisplay user={user} />
        </SettingsSection>

        <SettingsSection
          icon={Lock}
          title="Change Password"
          description="Update your password regularly for better security"
          delay={0.2}
        >
          <ChangePasswordForm onSuccess={handleSuccess} onError={handleError} />
        </SettingsSection>

        <SettingsSection
          icon={Bell}
          title="Notifications"
          description="Manage how you receive notifications"
          delay={0.3}
        >
          <NotificationSettings />
        </SettingsSection>

        <SettingsSection
          icon={Palette}
          title="Appearance"
          description="Customize your visual experience"
          delay={0.4}
        >
          <AppearanceSettings />
        </SettingsSection>

        <SettingsSection
          icon={Shield}
          title="Security"
          description="Protect your account with additional security measures"
          delay={0.5}
        >
          <SecuritySettings />
        </SettingsSection>

        <SettingsSection
          icon={AlertTriangle}
          title="Account Actions"
          description="Manage critical account actions"
          delay={0.6}
        >
          <DangerZone onLogout={() => setShowLogoutModal(true)} />
        </SettingsSection>
      </div>
    </motion.div>
  );
};

export default Settings;
