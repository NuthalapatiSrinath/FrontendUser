import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import {
  UserPlus, X, Mountain, Loader2, Shield, Sparkles, Star, Zap, Lock, User,
  Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Fingerprint, KeyRound,
  Globe, Hexagon, Triangle, Circle, Square, Diamond, Heart, Moon, Mail,
  Layers, Cpu, Activity, Wifi, Cloud, Database, Server, Terminal, Code,
  Box, Compass, Target, Award, TrendingUp, Gift, Users, Ticket, Crown,
  Rocket, PartyPopper, Wand2, BadgeCheck, ShieldCheck, LockKeyhole
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { registerUser, clearError } from "../store/slices/authSlice";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 30, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    filter: "blur(10px)",
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

const headerVariants = {
  initial: { y: -100, opacity: 0, rotateX: -45 },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
  },
};

const logoVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15, delay: 0.4 },
  },
  hover: { scale: 1.15, rotate: 10, transition: { type: "spring", stiffness: 400, damping: 10 } },
  tap: { scale: 0.9, rotate: -10 },
};

const cardVariants = {
  initial: { opacity: 0, y: 80, scale: 0.85, rotateX: -20 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: { type: "spring", stiffness: 100, damping: 20, delay: 0.3 },
  },
  hover: {
    y: -8,
    boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const inputVariants = {
  initial: { opacity: 0, x: -50, scale: 0.95 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const buttonVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 20, delay: 0.5 },
  },
  hover: {
    scale: 1.05,
    y: -3,
    boxShadow: "0 25px 50px -12px rgba(139, 92, 246, 0.6)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95, y: 0 },
  loading: { scale: [1, 1.02, 1], transition: { duration: 1, repeat: Infinity, ease: "easeInOut" } },
};

const alertVariants = {
  initial: { opacity: 0, y: -30, scale: 0.9, height: 0 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    height: "auto",
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, y: -30, scale: 0.9, height: 0, transition: { duration: 0.3 } },
};

const shimmerVariants = {
  animate: { x: ["-100%", "100%"], transition: { duration: 2, repeat: Infinity, ease: "linear" } },
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(139, 92, 246, 0.3)",
      "0 0 60px rgba(139, 92, 246, 0.6)",
      "0 0 20px rgba(139, 92, 246, 0.3)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const orbitVariants = {
  animate: { rotate: 360, transition: { duration: 20, repeat: Infinity, ease: "linear" } },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 20 },
  },
};

const celebrationVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: [0, 1.2, 1],
    rotate: [0, 20, -20, 0],
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const confettiVariants = {
  animate: (i) => ({
    y: [0, -100, 300],
    x: [0, Math.random() * 200 - 100],
    rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
    opacity: [1, 1, 0],
    transition: {
      duration: 2,
      delay: i * 0.05,
      ease: "easeOut",
    },
  }),
};

// ============================================================================
// FLOATING PARTICLES COMPONENT
// ============================================================================

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.1,
      color: [
        "rgba(139, 92, 246, 0.4)",
        "rgba(168, 85, 247, 0.4)",
        "rgba(192, 132, 252, 0.4)",
        "rgba(99, 102, 241, 0.4)",
        "rgba(236, 72, 153, 0.4)",
      ][Math.floor(Math.random() * 5)],
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
            background: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            y: [0, -150, 0],
            x: [0, Math.random() * 80 - 40, 0],
            opacity: [particle.opacity, particle.opacity * 2, particle.opacity],
            scale: [1, 1.8, 1],
            rotate: [0, 360, 0],
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
// ANIMATED BACKGROUND GRADIENT
// ============================================================================

const AnimatedBackground = () => {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX / innerWidth) * 100);
      mouseY.set((clientY / innerHeight) * 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundGradient = useMotionTemplate`
    radial-gradient(
      800px circle at ${springX}% ${springY}%,
      rgba(139, 92, 246, 0.2),
      rgba(168, 85, 247, 0.1) 40%,
      transparent 60%
    )
  `;

  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: backgroundGradient }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-purple-50/50 to-pink-50/30 -z-10" />

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-400/25 to-pink-400/25 blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-indigo-400/25 to-blue-400/25 blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, -80, 0],
          scale: [1, 1.4, 1],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-violet-400/15 to-fuchsia-400/15 blur-3xl"
        animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="fixed top-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-rose-400/20 to-orange-400/20 blur-3xl"
        animate={{ x: [0, 80, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
};

// ============================================================================
// GEOMETRIC SHAPES DECORATION
// ============================================================================

const GeometricShapes = () => {
  const shapes = useMemo(
    () => [
      { Icon: Hexagon, x: "8%", y: "15%", size: 45, rotate: 0, duration: 18, color: "text-purple-300/25" },
      { Icon: Triangle, x: "88%", y: "12%", size: 38, rotate: 45, duration: 22, color: "text-pink-300/25" },
      { Icon: Circle, x: "4%", y: "65%", size: 32, rotate: 0, duration: 15, color: "text-indigo-300/25" },
      { Icon: Square, x: "92%", y: "55%", size: 28, rotate: 30, duration: 25, color: "text-violet-300/25" },
      { Icon: Star, x: "12%", y: "82%", size: 30, rotate: 15, duration: 17, color: "text-fuchsia-300/25" },
      { Icon: Diamond, x: "82%", y: "78%", size: 35, rotate: 60, duration: 20, color: "text-rose-300/25" },
      { Icon: Sparkles, x: "45%", y: "8%", size: 26, rotate: 0, duration: 12, color: "text-amber-300/30" },
      { Icon: Zap, x: "72%", y: "25%", size: 28, rotate: -15, duration: 16, color: "text-orange-300/25" },
      { Icon: Heart, x: "25%", y: "92%", size: 24, rotate: 10, duration: 14, color: "text-red-300/25" },
      { Icon: Moon, x: "65%", y: "88%", size: 26, rotate: -20, duration: 19, color: "text-blue-300/25" },
      { Icon: Crown, x: "35%", y: "18%", size: 22, rotate: 25, duration: 21, color: "text-yellow-300/25" },
      { Icon: Gift, x: "78%", y: "42%", size: 24, rotate: 0, duration: 23, color: "text-emerald-300/25" },
    ],
    []
  );

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map((shape, index) => {
        const IconComponent = shape.Icon;
        return (
          <motion.div
            key={index}
            className={`absolute ${shape.color}`}
            style={{ left: shape.x, top: shape.y }}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, -15, 0],
              rotate: [shape.rotate, shape.rotate + 360],
              opacity: [0.25, 0.5, 0.25],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: shape.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            <IconComponent size={shape.size} strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ORBITING ICONS COMPONENT
// ============================================================================

const OrbitingIcons = ({ size = 120 }) => {
  const icons = [Users, Gift, Crown, Award, Rocket, Star];

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      variants={orbitVariants}
      animate="animate"
    >
      {icons.map((Icon, index) => {
        const angle = (index * 360) / icons.length;
        const radius = size / 2 + 20;
        return (
          <motion.div
            key={index}
            className="absolute text-purple-400/40"
            style={{
              left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * radius}px)`,
              top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * radius}px)`,
              transform: "translate(-50%, -50%)",
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Icon size={16} />
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// ANIMATED LOGO COMPONENT
// ============================================================================

const AnimatedLogo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);

  return (
    <motion.div
      className="relative"
      variants={logoVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => setClicks((c) => c + 1)}
    >
      <motion.div
        className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md relative overflow-hidden cursor-pointer border border-white/30"
        animate={isHovered ? glowVariants.animate : {}}
      >
        <motion.div
          animate={{ rotate: clicks * 360 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
        >
          <Mountain className="w-7 h-7 text-white relative z-10" />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          variants={shimmerVariants}
          animate="animate"
        />

        {isHovered && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-xl border-2 border-white/30"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
              />
            ))}
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  background: `hsl(${280 + i * 20}, 80%, 60%)`,
                  boxShadow: `0 0 10px hsl(${280 + i * 20}, 80%, 60%)`,
                }}
                initial={{ scale: 0, x: "-50%", y: "-50%" }}
                animate={{
                  scale: 1,
                  x: `${Math.cos((i * Math.PI * 2) / 6) * 35 - 50}%`,
                  y: `${Math.sin((i * Math.PI * 2) / 6) * 35 - 50}%`,
                  rotate: 360,
                }}
                exit={{ scale: 0, x: "-50%", y: "-50%" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.05,
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// ANIMATED INPUT COMPONENT
// ============================================================================

const AnimatedInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon: Icon,
  autoComplete,
  delay = 0,
  showPasswordToggle = false,
  error = null,
  success = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  const actualType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  const getBorderColor = () => {
    if (error) return "#ef4444";
    if (isFocused) return "#8b5cf6";
    if (hasValue && success) return "#10b981";
    if (hasValue) return "#a78bfa";
    return "#e2e8f0";
  };

  return (
    <motion.div
      className="mb-5 relative"
      variants={inputVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
    >
      <motion.label
        className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
        animate={{
          color: error ? "#ef4444" : isFocused ? "#8b5cf6" : "#334155",
          x: isFocused ? 5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {Icon && (
          <motion.span
            animate={{
              scale: isFocused ? 1.2 : 1,
              rotate: isFocused ? 10 : 0,
              color: error ? "#ef4444" : isFocused ? "#8b5cf6" : "#64748b",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Icon className="w-4 h-4" />
          </motion.span>
        )}
        <span>{label}</span>
        {hasValue && !error && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-emerald-500"
          >
            <CheckCircle className="w-3 h-3" />
          </motion.span>
        )}
        {error && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-red-500"
          >
            <AlertCircle className="w-3 h-3" />
          </motion.span>
        )}
      </motion.label>

      <div className="relative">
        <motion.div
          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 opacity-0 -z-10"
          animate={{
            opacity: isFocused ? 0.7 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          style={{ filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        />

        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
          animate={{ opacity: isFocused ? 0.1 : 0, scale: isFocused ? 1.02 : 1 }}
          transition={{ duration: 0.2 }}
        />

        <motion.input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="w-full px-4 py-3.5 rounded-xl border-2 bg-white/90 backdrop-blur-sm text-slate-800 text-sm focus:outline-none transition-all placeholder-slate-400 relative z-10"
          animate={{
            borderColor: getBorderColor(),
            boxShadow: isFocused
              ? "0 0 0 4px rgba(139, 92, 246, 0.15), 0 10px 30px -5px rgba(139, 92, 246, 0.25)"
              : error
              ? "0 0 0 4px rgba(239, 68, 68, 0.1)"
              : hasValue
              ? "0 0 0 4px rgba(167, 139, 250, 0.1), 0 4px 15px -3px rgba(139, 92, 246, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
          whileHover={{ borderColor: isFocused ? "#8b5cf6" : "#c4b5fd" }}
          transition={{ duration: 0.2 }}
        />

        {showPasswordToggle && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 z-20 p-1.5 rounded-lg hover:bg-slate-100"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={showPassword ? "visible" : "hidden"}
                initial={{ opacity: 0, rotate: -180, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 180, scale: 0.5 }}
                transition={{ duration: 0.3 }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle className="w-3 h-3" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Animated focus indicator */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="flex gap-1 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="h-1 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
                initial={{ width: 0 }}
                animate={{ width: 20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Password strength indicator */}
      {showPasswordToggle && hasValue && (
        <motion.div
          className="flex gap-1 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={`h-1 flex-1 rounded-full ${
                value.length > i * 2 + 1
                  ? i < 2
                    ? "bg-red-400"
                    : i < 3
                    ? "bg-amber-400"
                    : "bg-emerald-400"
                  : "bg-slate-200"
              }`}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: value.length > i * 2 + 1 ? 1 : 0.3 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// REFERRAL CODE INPUT COMPONENT
// ============================================================================

const ReferralCodeInput = ({ value, onChange, isValid, disabled }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="mb-6 relative"
      variants={inputVariants}
      initial="initial"
      animate="animate"
      transition={{ delay: 0.4 }}
    >
      <motion.label
        className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
        animate={{
          color: isFocused ? "#8b5cf6" : "#334155",
          x: isFocused ? 5 : 0,
        }}
      >
        <motion.span
          animate={{
            scale: isFocused ? 1.2 : 1,
            rotate: isFocused ? 10 : 0,
          }}
        >
          <Ticket className="w-4 h-4" />
        </motion.span>
        <span>Referral Code</span>
        {isValid && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-emerald-500"
          >
            <BadgeCheck className="w-4 h-4" />
          </motion.span>
        )}
        <motion.span
          className="ml-auto text-xs text-purple-500 bg-purple-100 px-2 py-0.5 rounded-full"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Required
        </motion.span>
      </motion.label>

      <div className="relative">
        {/* Glowing border */}
        <motion.div
          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 opacity-0 -z-10"
          animate={{
            opacity: isFocused ? 0.8 : isValid ? 0.5 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          style={{ filter: "blur(6px)" }}
        />

        <motion.input
          type="text"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter referral code"
          disabled={disabled}
          className="w-full px-4 py-3.5 rounded-xl border-2 bg-white/90 backdrop-blur-sm text-slate-800 text-sm focus:outline-none transition-all placeholder-slate-400 relative z-10 disabled:bg-slate-100 disabled:cursor-not-allowed font-mono tracking-wider uppercase"
          animate={{
            borderColor: isValid ? "#10b981" : isFocused ? "#8b5cf6" : "#e2e8f0",
            boxShadow: isValid
              ? "0 0 0 4px rgba(16, 185, 129, 0.15), 0 10px 30px -5px rgba(16, 185, 129, 0.2)"
              : isFocused
              ? "0 0 0 4px rgba(139, 92, 246, 0.15), 0 10px 30px -5px rgba(139, 92, 246, 0.25)"
              : "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
        />

        {/* Verified badge */}
        <AnimatePresence>
          {isValid && (
            <motion.div
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <motion.div
                className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gift icon animation */}
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 z-20"
          animate={{ rotate: [0, 10, -10, 0], y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Gift className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Hint text */}
      <motion.p
        className="text-slate-400 text-xs mt-2 flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Sparkles className="w-3 h-3" />
        Get a referral code from an existing user to register
      </motion.p>
    </motion.div>
  );
};

// ============================================================================
// ANIMATED BUTTON COMPONENT
// ============================================================================

const AnimatedButton = ({ onClick, disabled, isLoading, type = "submit" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    if (!disabled && onClick) {
      const newParticles = Array.from({ length: 25 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 360) / 25,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 1000);
      onClick(e);
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className="w-full relative overflow-hidden rounded-xl text-white text-sm font-bold px-6 py-4 cursor-pointer disabled:cursor-not-allowed"
      variants={buttonVariants}
      initial="initial"
      animate={isLoading ? "loading" : "animate"}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600"
        animate={{
          backgroundPosition: isHovered ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
        }}
        style={{ backgroundSize: "200% 200%" }}
        transition={{ duration: 3, repeat: isHovered ? Infinity : 0 }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "100%" : "-100%" }}
        transition={{ duration: 0.8 }}
      />

      {/* Particle explosion */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{ left: "50%", top: "50%" }}
            initial={{ scale: 0, x: "-50%", y: "-50%", opacity: 1 }}
            animate={{
              scale: 1.5,
              x: `${Math.cos((particle.angle * Math.PI) / 180) * 120 - 50}%`,
              y: `${Math.sin((particle.angle * Math.PI) / 180) * 120 - 50}%`,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <motion.div
        className="relative z-10 flex items-center justify-center gap-3"
        animate={{ x: isLoading ? [0, 3, -3, 0] : 0 }}
        transition={{ duration: 0.5, repeat: isLoading ? Infinity : 0 }}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, rotate: -180, scale: 0 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 180, scale: 0 }}
              className="flex items-center gap-2"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5" />
              </motion.div>
              <span>Creating account...</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              <span>Create Account</span>
              <motion.div
                animate={{ x: isHovered ? 8 : 0, scale: isHovered ? 1.2 : 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hover particles */}
      <AnimatePresence>
        {isHovered && !disabled && (
          <>
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full"
                initial={{ x: "50%", y: "100%", opacity: 0.8 }}
                animate={{
                  y: ["100%", "-50%"],
                  x: `${50 + (Math.random() * 80 - 40)}%`,
                  opacity: [0.8, 0],
                  scale: [1, 0],
                }}
                transition={{ duration: 1, delay: i * 0.06, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Disabled overlay */}
      {disabled && !isLoading && (
        <motion.div
          className="absolute inset-0 bg-slate-500/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.button>
  );
};

// ============================================================================
// SUCCESS CELEBRATION COMPONENT
// ============================================================================

const SuccessCelebration = ({ show }) => {
  const confettiColors = [
    "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444",
  ];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-sm"
              style={{
                background: confettiColors[i % confettiColors.length],
                left: `${Math.random() * 100}%`,
                top: "50%",
              }}
              custom={i}
              variants={confettiVariants}
              initial="initial"
              animate="animate"
            />
          ))}

          {/* Success icon */}
          <motion.div
            className="bg-white rounded-3xl shadow-2xl p-8"
            variants={celebrationVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <CheckCircle className="w-10 h-10 text-white" />
            </motion.div>
            <motion.h3
              className="text-2xl font-bold text-slate-800 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Account Created!
            </motion.h3>
            <motion.p
              className="text-slate-500 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Redirecting to login...
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============================================================================
// WELCOME BANNER COMPONENT
// ============================================================================

const WelcomeBanner = ({ onClose }) => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [PartyPopper, Gift, Crown, Rocket, Star];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((i) => (i + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[iconIndex];

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-purple-50 via-pink-50 to-violet-50 border border-purple-200/60 rounded-2xl px-5 py-4 mb-6"
      variants={alertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #8b5cf6 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
        animate={{ backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-500 flex items-center justify-center shadow-lg shadow-purple-500/30 relative overflow-hidden"
            animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={iconIndex}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ duration: 0.3 }}
              >
                <CurrentIcon className="w-6 h-6 text-white" />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <div>
            <motion.span
              className="text-purple-800 font-bold text-base block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Join Our Community!
            </motion.span>
            <motion.span
              className="text-purple-600/70 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Create your account with a referral code
            </motion.span>
          </div>
        </motion.div>

        <motion.button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center text-purple-500 hover:text-purple-700 hover:bg-white transition-all cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-purple-400/40"
          style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.15 }}
        >
          <Sparkles className="w-3 h-3" />
        </motion.div>
      ))}
    </motion.div>
  );
};

// ============================================================================
// ERROR ALERT COMPONENT
// ============================================================================

const ErrorAlert = ({ error }) => {
  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-red-50 to-rose-50 border border-red-200/60 rounded-2xl px-5 py-4 mb-6"
      variants={alertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <motion.div
          className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30"
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 0.6, repeat: 3 }}
        >
          <AlertCircle className="w-5 h-5 text-white" />
        </motion.div>

        <span className="text-red-700 font-semibold text-sm flex-1">{error}</span>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"
        animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
        style={{ backgroundSize: "200% 100%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

// ============================================================================
// FEATURES LIST COMPONENT
// ============================================================================

const FeaturesList = () => {
  const features = [
    { icon: ShieldCheck, text: "Secure", color: "from-purple-500 to-violet-500" },
    { icon: Rocket, text: "Fast", color: "from-pink-500 to-rose-500" },
    { icon: Award, text: "Premium", color: "from-amber-500 to-orange-500" },
    { icon: Globe, text: "Global", color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <motion.div
      className="flex justify-center gap-5 mt-6"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <motion.div
            key={index}
            className="flex flex-col items-center gap-2"
            variants={staggerItemVariants}
          >
            <motion.div
              className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
              whileHover={{
                scale: 1.2,
                rotate: 10,
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.25)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span
              className="text-xs text-slate-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              {feature.text}
            </motion.span>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// ANIMATED LINK COMPONENT
// ============================================================================

const AnimatedLink = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="relative inline-block text-sm text-purple-600 font-bold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="relative z-10"
        animate={{ color: isHovered ? "#7c3aed" : "#9333ea", scale: isHovered ? 1.05 : 1 }}
      >
        {children}
      </motion.span>

      <motion.div
        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : 0 }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="absolute inset-0 bg-purple-500/10 rounded-lg -z-10"
        initial={{ opacity: 0, scale: 0.8, y: 5 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.2 : 0.8, y: isHovered ? 0 : 5 }}
        transition={{ duration: 0.2 }}
      />

      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <Sparkles className="w-3 h-3 text-purple-400" />
          </motion.div>
        )}
      </AnimatePresence>
    </Link>
  );
};

// ============================================================================
// FOOTER COMPONENT
// ============================================================================

const AnimatedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="text-center py-8 relative"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.6 }}
    >
      <motion.div
        className="flex items-center justify-center gap-2 text-slate-400"
        whileHover={{ scale: 1.02 }}
      >
        <motion.span
          animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          ©
        </motion.span>
        <span className="text-sm">{currentYear}</span>
        <motion.span
          className="font-bold bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 text-transparent bg-clip-text"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          style={{ backgroundSize: "200% 200%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          ELEVEN-PANEL
        </motion.span>
      </motion.div>

      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.5, 1, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="flex justify-center gap-2 mt-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-slate-300"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </motion.div>
    </motion.footer>
  );
};

// ============================================================================
// MAIN REGISTER COMPONENT
// ============================================================================

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [showWelcome, setShowWelcome] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    referralCode: searchParams.get("ref") || "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.username || formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.referralCode) {
      newErrors.referralCode = "Referral code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  }, []);

  const handleRegister = useCallback(
    async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      try {
        await dispatch(
          registerUser({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            referralCode: formData.referralCode,
          })
        ).unwrap();
        setShowSuccess(true);
        setTimeout(() => navigate("/login"), 2500);
      } catch (err) {
        // Error handled by Redux
      }
    },
    [dispatch, formData, navigate, validateForm]
  );

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatedBackground />
      <FloatingParticles />
      <GeometricShapes />
      <SuccessCelebration show={showSuccess} />

      {/* Header */}
      <motion.header
        className="relative z-50 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 w-full py-4 px-6 flex items-center gap-4 shadow-2xl shadow-purple-500/30"
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-pink-400/20"
          animate={{ backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"] }}
          style={{ backgroundSize: "200% 100%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        />

        <AnimatedLogo />

        <motion.span
          className="text-white text-xl font-bold tracking-wide relative"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
        >
          ELEVEN-PANEL
          <motion.div
            className="absolute -bottom-1 left-0 h-0.5 bg-white/60"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ delay: 0.9, duration: 0.6 }}
          />
        </motion.span>

        <motion.div
          className="ml-auto flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[Sparkles, Crown, Gift].map((Icon, i) => (
            <motion.div
              key={i}
              className="text-white/50"
              animate={{ y: [0, -6, 0], opacity: [0.4, 0.9, 0.4], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
          ))}
        </motion.div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 relative z-10">
        <motion.div
          className="w-full max-w-md"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}
          </AnimatePresence>

          {/* Register Card */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 p-8 overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 rounded-3xl opacity-0 blur-xl"
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative">
              {/* Title */}
              <motion.div className="text-center mb-6" variants={staggerItemVariants}>
                <motion.div
                  className="w-18 h-18 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-violet-600 flex items-center justify-center shadow-xl shadow-purple-500/30 relative"
                  style={{ width: 72, height: 72 }}
                  animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <UserPlus className="w-9 h-9 text-white" />
                  <OrbitingIcons size={72} />
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-purple-700 to-slate-800 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Create Account
                </motion.h2>

                <motion.p
                  className="text-slate-500 mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  Join us and unlock exclusive features
                </motion.p>
              </motion.div>

              <AnimatePresence>{error && <ErrorAlert error={error} />}</AnimatePresence>

              {/* Register Form */}
              <motion.form onSubmit={handleRegister} variants={staggerContainerVariants}>
                <AnimatedInput
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  icon={User}
                  autoComplete="username"
                  delay={0.1}
                  error={errors.username}
                />

                <AnimatedInput
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  icon={Mail}
                  autoComplete="email"
                  delay={0.15}
                  error={errors.email}
                />

                <AnimatedInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  icon={Lock}
                  autoComplete="new-password"
                  delay={0.2}
                  showPasswordToggle={true}
                  error={errors.password}
                />

                <AnimatedInput
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  icon={LockKeyhole}
                  autoComplete="new-password"
                  delay={0.25}
                  showPasswordToggle={true}
                  error={errors.confirmPassword}
                />

                <ReferralCodeInput
                  value={formData.referralCode}
                  onChange={(e) =>
                    handleChange({ target: { name: "referralCode", value: e.target.value.toUpperCase() } })
                  }
                  isValid={formData.referralCode.length >= 6}
                  disabled={false}
                />

                <AnimatedButton type="submit" disabled={isLoading} isLoading={isLoading} />
              </motion.form>

              <FeaturesList />
            </div>
          </motion.div>

          {/* Login Link */}
          <motion.div
            className="mt-6 text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-200/60 py-5 px-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}
          >
            <motion.span
              className="text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Already have an account?{" "}
            </motion.span>
            <AnimatedLink to="/login">Sign in here</AnimatedLink>
          </motion.div>
        </motion.div>
      </main>

      <AnimatedFooter />
    </motion.div>
  );
};

export default Register;
