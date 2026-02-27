import { useState, useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { 
  LogIn, X, Mountain, Loader2, Shield, Sparkles, Star, Zap, Lock, User, 
  Eye, EyeOff, ArrowRight, CheckCircle, AlertCircle, Fingerprint, KeyRound, 
  Globe, Hexagon, Triangle, Circle, Square, Diamond, Heart, Moon, Sun,
  Layers, Cpu, Activity, Wifi, Cloud, Database, Server, Terminal, Code,
  Box, Compass, Target, Award, TrendingUp, BarChart2, PieChart
} from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import { loginUser, clearError } from "../store/slices/authSlice";

// ============================================================================
// ANIMATION VARIANTS - Comprehensive animation configurations
// ============================================================================

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.95,
    y: 30,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -30,
    filter: "blur(10px)",
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const headerVariants = {
  initial: { y: -100, opacity: 0, rotateX: -45 },
  animate: {
    y: 0,
    opacity: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.2,
    },
  },
};

const logoVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 15,
      delay: 0.4,
    },
  },
  hover: {
    scale: 1.15,
    rotate: 10,
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.9, rotate: -10 },
};

const cardVariants = {
  initial: { opacity: 0, y: 80, scale: 0.85, rotateX: -20 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
      delay: 0.3,
    },
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
  focus: {
    scale: 1.02,
    transition: { type: "spring", stiffness: 300, damping: 20 },
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
    boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.6)",
    transition: { type: "spring", stiffness: 400, damping: 10 },
  },
  tap: { scale: 0.95, y: 0 },
  loading: {
    scale: [1, 1.02, 1],
    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
  },
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
  exit: {
    opacity: 0,
    y: -30,
    scale: 0.9,
    height: 0,
    transition: { duration: 0.3 },
  },
};

const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 1, 0.5],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.3)",
      "0 0 60px rgba(59, 130, 246, 0.6)",
      "0 0 20px rgba(59, 130, 246, 0.3)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 6, repeat: Infinity, ease: "easeInOut" },
  },
};

const orbitVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 20, repeat: Infinity, ease: "linear" },
  },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
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

const morphVariants = {
  circle: { borderRadius: "50%", rotate: 0 },
  square: { borderRadius: "10%", rotate: 45 },
  rounded: { borderRadius: "30%", rotate: 90 },
};

const waveVariants = {
  animate: {
    d: [
      "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
      "M0,50 Q25,70 50,50 T100,50 L100,100 L0,100 Z",
      "M0,50 Q25,30 50,50 T100,50 L100,100 L0,100 Z",
    ],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

// ============================================================================
// FLOATING PARTICLES COMPONENT - Creates magical particle effects
// ============================================================================

const FloatingParticles = () => {
  const particles = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.6 + 0.1,
      color: [
        "rgba(59, 130, 246, 0.4)",
        "rgba(99, 102, 241, 0.4)",
        "rgba(139, 92, 246, 0.4)",
        "rgba(168, 85, 247, 0.4)",
        "rgba(6, 182, 212, 0.4)",
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
// ANIMATED BACKGROUND GRADIENT - Mouse-following gradients
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
      rgba(59, 130, 246, 0.2),
      rgba(99, 102, 241, 0.1) 40%,
      transparent 60%
    )
  `;

  return (
    <>
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: backgroundGradient }}
      />
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/50 to-slate-100 -z-10" />

      {/* Animated gradient orbs */}
      <motion.div
        className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-400/25 to-cyan-400/25 blur-3xl"
        animate={{
          x: [0, 150, 0],
          y: [0, 100, 0],
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-[-200px] right-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-r from-purple-400/25 to-pink-400/25 blur-3xl"
        animate={{
          x: [0, -120, 0],
          y: [0, -80, 0],
          scale: [1, 1.4, 1],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-indigo-400/15 to-violet-400/15 blur-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="fixed top-[20%] right-[20%] w-[400px] h-[400px] rounded-full bg-gradient-to-r from-emerald-400/20 to-teal-400/20 blur-3xl"
        animate={{
          x: [0, 80, 0],
          y: [0, 60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
    </>
  );
};

// ============================================================================
// GEOMETRIC SHAPES DECORATION - Floating geometric elements
// ============================================================================

const GeometricShapes = () => {
  const shapes = useMemo(
    () => [
      { Icon: Hexagon, x: "8%", y: "15%", size: 45, rotate: 0, duration: 18, color: "text-blue-300/25" },
      { Icon: Triangle, x: "88%", y: "12%", size: 38, rotate: 45, duration: 22, color: "text-indigo-300/25" },
      { Icon: Circle, x: "4%", y: "65%", size: 32, rotate: 0, duration: 15, color: "text-purple-300/25" },
      { Icon: Square, x: "92%", y: "55%", size: 28, rotate: 30, duration: 25, color: "text-cyan-300/25" },
      { Icon: Star, x: "12%", y: "82%", size: 30, rotate: 15, duration: 17, color: "text-pink-300/25" },
      { Icon: Diamond, x: "82%", y: "78%", size: 35, rotate: 60, duration: 20, color: "text-emerald-300/25" },
      { Icon: Sparkles, x: "45%", y: "8%", size: 26, rotate: 0, duration: 12, color: "text-yellow-300/30" },
      { Icon: Zap, x: "72%", y: "25%", size: 28, rotate: -15, duration: 16, color: "text-orange-300/25" },
      { Icon: Heart, x: "25%", y: "92%", size: 24, rotate: 10, duration: 14, color: "text-rose-300/25" },
      { Icon: Moon, x: "65%", y: "88%", size: 26, rotate: -20, duration: 19, color: "text-violet-300/25" },
      { Icon: Layers, x: "35%", y: "18%", size: 22, rotate: 25, duration: 21, color: "text-teal-300/25" },
      { Icon: Cpu, x: "78%", y: "42%", size: 24, rotate: 0, duration: 23, color: "text-slate-300/25" },
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
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <IconComponent size={shape.size} strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ORBITING ICONS COMPONENT - Icons orbiting around a center
// ============================================================================

const OrbitingIcons = ({ size = 120 }) => {
  const icons = [Server, Database, Cloud, Wifi, Activity, Terminal];

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
            className="absolute text-blue-400/40"
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
// ANIMATED LOGO COMPONENT - Interactive logo with effects
// ============================================================================

const AnimatedLogo = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [clicks, setClicks] = useState(0);

  const handleClick = () => {
    setClicks((c) => c + 1);
  };

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
      onClick={handleClick}
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

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          variants={shimmerVariants}
          animate="animate"
        />

        {/* Pulse rings */}
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

      {/* Orbiting particles */}
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
                  background: `hsl(${220 + i * 20}, 80%, 60%)`,
                  boxShadow: `0 0 10px hsl(${220 + i * 20}, 80%, 60%)`,
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
// ANIMATED INPUT COMPONENT - Feature-rich input field
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
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value && value.length > 0);
  }, [value]);

  const actualType = showPasswordToggle ? (showPassword ? "text" : "password") : type;

  return (
    <motion.div
      className="mb-6 relative"
      variants={inputVariants}
      initial="initial"
      animate="animate"
      transition={{ delay }}
    >
      <motion.label
        className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"
        animate={{
          color: isFocused ? "#3b82f6" : "#334155",
          x: isFocused ? 5 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        {Icon && (
          <motion.span
            animate={{
              scale: isFocused ? 1.2 : 1,
              rotate: isFocused ? 10 : 0,
              color: isFocused ? "#3b82f6" : "#64748b",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
          >
            <Icon className="w-4 h-4" />
          </motion.span>
        )}
        <span>{label}</span>
        {hasValue && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-emerald-500"
          >
            <CheckCircle className="w-3 h-3" />
          </motion.span>
        )}
      </motion.label>

      <div className="relative">
        {/* Animated border gradient */}
        <motion.div
          className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 -z-10"
          animate={{
            opacity: isFocused ? 0.7 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          style={{ filter: "blur(4px)" }}
          transition={{ duration: 0.3 }}
        />

        {/* Focus glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0"
          animate={{
            opacity: isFocused ? 0.1 : 0,
            scale: isFocused ? 1.02 : 1,
          }}
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
            borderColor: isFocused ? "#3b82f6" : hasValue ? "#10b981" : "#e2e8f0",
            boxShadow: isFocused
              ? "0 0 0 4px rgba(59, 130, 246, 0.15), 0 10px 30px -5px rgba(59, 130, 246, 0.25)"
              : hasValue
              ? "0 0 0 4px rgba(16, 185, 129, 0.1), 0 4px 15px -3px rgba(16, 185, 129, 0.1)"
              : "0 2px 8px rgba(0, 0, 0, 0.05)",
          }}
          whileHover={{ borderColor: isFocused ? "#3b82f6" : "#93c5fd" }}
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
                className="h-1 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400"
                initial={{ width: 0 }}
                animate={{ width: 20 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character count indicator for password */}
      {showPasswordToggle && hasValue && (
        <motion.div
          className="absolute -right-2 top-9 flex flex-col gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {[...Array(Math.min(value.length, 8))].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.03 }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

// ============================================================================
// ANIMATED CHECKBOX COMPONENT
// ============================================================================

const AnimatedCheckbox = ({ checked, onChange, label }) => {
  return (
    <motion.label
      className="flex items-center gap-3 cursor-pointer select-none group"
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div className="relative w-6 h-6" whileTap={{ scale: 0.85 }}>
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
        <motion.div
          className="w-6 h-6 rounded-lg border-2 flex items-center justify-center overflow-hidden"
          animate={{
            borderColor: checked ? "#3b82f6" : "#cbd5e1",
            backgroundColor: checked ? "#3b82f6" : "transparent",
            scale: checked ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence>
            {checked && (
              <motion.div
                initial={{ scale: 0, opacity: 0, rotate: -180 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0, opacity: 0, rotate: 180 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <CheckCircle className="w-4 h-4 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Ripple effect */}
        <AnimatePresence>
          {checked && (
            <>
              {[...Array(2)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-lg border-2 border-blue-500"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2 + i * 0.5, opacity: 0 }}
                  exit={{ scale: 1, opacity: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.span
        className="text-sm font-medium"
        animate={{
          color: checked ? "#3b82f6" : "#475569",
          fontWeight: checked ? 600 : 500,
        }}
      >
        {label}
      </motion.span>
    </motion.label>
  );
};

// ============================================================================
// ANIMATED BUTTON COMPONENT - Feature-rich submit button
// ============================================================================

const AnimatedButton = ({ onClick, disabled, isLoading, children, type = "submit" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    if (!disabled && onClick) {
      // Create explosion particles
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        angle: (i * 360) / 20,
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
        className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
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

      {/* Ripple effect */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: "50%",
              top: "50%",
            }}
            initial={{ scale: 0, x: "-50%", y: "-50%", opacity: 1 }}
            animate={{
              scale: 1.5,
              x: `${Math.cos((particle.angle * Math.PI) / 180) * 100 - 50}%`,
              y: `${Math.sin((particle.angle * Math.PI) / 180) * 100 - 50}%`,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>

      {/* Button content */}
      <motion.div
        className="relative z-10 flex items-center justify-center gap-3"
        animate={{
          x: isLoading ? [0, 3, -3, 0] : 0,
        }}
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
              <span>Signing in...</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
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

      {/* Hover particle effects */}
      <AnimatePresence>
        {isHovered && !disabled && (
          <>
            {[...Array(12)].map((_, i) => (
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
                transition={{
                  duration: 1,
                  delay: i * 0.08,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
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
// WELCOME BANNER COMPONENT
// ============================================================================

const WelcomeBanner = ({ onClose }) => {
  const [iconIndex, setIconIndex] = useState(0);
  const icons = [Shield, Sparkles, Star, Zap, Award];

  useEffect(() => {
    const interval = setInterval(() => {
      setIconIndex((i) => (i + 1) % icons.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = icons[iconIndex];

  return (
    <motion.div
      className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/60 rounded-2xl px-5 py-4 mb-6"
      variants={alertVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)`,
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
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-blue-500/30 relative overflow-hidden"
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
              className="text-blue-800 font-bold text-base block"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome, Stranger!
            </motion.span>
            <motion.span
              className="text-blue-600/70 text-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Sign in to access your dashboard
            </motion.span>
          </div>
        </motion.div>

        <motion.button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/50 backdrop-blur-sm flex items-center justify-center text-blue-500 hover:text-blue-700 hover:bg-white transition-all cursor-pointer"
          whileHover={{ scale: 1.15, rotate: 90 }}
          whileTap={{ scale: 0.85 }}
        >
          <X className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Floating sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-blue-400/40"
          style={{ left: `${10 + i * 10}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.7, 0.3],
            rotate: [0, 180, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + i * 0.3,
            repeat: Infinity,
            delay: i * 0.15,
          }}
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

      {/* Animated warning indicator */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-rose-500 to-red-500"
        animate={{ backgroundPosition: ["0% 0%", "100% 0%"] }}
        style={{ backgroundSize: "200% 100%" }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      {/* Shake effect on mount */}
      <motion.div
        className="absolute inset-0 border-2 border-red-300 rounded-2xl"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: [0.5, 0, 0.5, 0] }}
        transition={{ duration: 0.5 }}
      />
    </motion.div>
  );
};

// ============================================================================
// FEATURES LIST COMPONENT
// ============================================================================

const FeaturesList = () => {
  const features = [
    { icon: Shield, text: "Secure", color: "from-blue-500 to-indigo-500" },
    { icon: Fingerprint, text: "Biometric", color: "from-indigo-500 to-purple-500" },
    { icon: KeyRound, text: "Encrypted", color: "from-purple-500 to-pink-500" },
    { icon: Globe, text: "Global", color: "from-cyan-500 to-blue-500" },
  ];

  return (
    <motion.div
      className="flex justify-center gap-5 mt-8"
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
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
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
      className="relative inline-block text-sm text-blue-600 font-bold"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="relative z-10"
        animate={{
          color: isHovered ? "#1d4ed8" : "#2563eb",
          scale: isHovered ? 1.05 : 1,
        }}
      >
        {children}
      </motion.span>

      {/* Animated underline */}
      <motion.div
        className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
        initial={{ width: 0 }}
        animate={{ width: isHovered ? "100%" : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 bg-blue-500/10 rounded-lg -z-10"
        initial={{ opacity: 0, scale: 0.8, y: 5 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1.2 : 0.8,
          y: isHovered ? 0 : 5,
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Sparkle effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute -top-2 -right-2"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
          >
            <Sparkles className="w-3 h-3 text-blue-400" />
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
          className="font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-transparent bg-clip-text"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          style={{ backgroundSize: "200% 200%" }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          ELEVEN-PANEL
        </motion.span>
      </motion.div>

      {/* Animated border */}
      <motion.div
        className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scaleX: [0.5, 1, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Decorative dots */}
      <motion.div className="flex justify-center gap-2 mt-3">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full bg-slate-300"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </motion.div>
    </motion.footer>
  );
};

// ============================================================================
// MAIN LOGIN COMPONENT
// ============================================================================

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [showWelcome, setShowWelcome] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    dispatch(clearError());
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleChange = useCallback((e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault();
      if (!formData.username || !formData.password) return;
      dispatch(loginUser(formData));
    },
    [dispatch, formData]
  );

  return (
    <motion.div
      className="min-h-screen flex flex-col relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Animated background elements */}
      <AnimatedBackground />
      <FloatingParticles />
      <GeometricShapes />

      {/* Header */}
      <motion.header
        className="relative z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full py-4 px-6 flex items-center gap-4 shadow-2xl shadow-blue-500/30"
        variants={headerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Animated header background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-transparent to-purple-400/20"
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

        {/* Header decorations */}
        <motion.div
          className="ml-auto flex gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[Sparkles, Star, Zap].map((Icon, i) => (
            <motion.div
              key={i}
              className="text-white/50"
              animate={{
                y: [0, -6, 0],
                opacity: [0.4, 0.9, 0.4],
                rotate: [0, 10, -10, 0],
              }}
              transition={{ duration: 2, delay: i * 0.25, repeat: Infinity }}
            >
              <Icon className="w-4 h-4" />
            </motion.div>
          ))}
        </motion.div>
      </motion.header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <motion.div
          className="w-full max-w-md"
          variants={staggerContainerVariants}
          initial="initial"
          animate="animate"
        >
          {/* Welcome Banner */}
          <AnimatePresence>
            {showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}
          </AnimatePresence>

          {/* Login Card */}
          <motion.div
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 p-8 overflow-hidden"
            variants={cardVariants}
            whileHover="hover"
          >
            {/* Card glow effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-0 blur-xl"
              animate={{ opacity: [0, 0.15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Card content */}
            <div className="relative">
              {/* Title section */}
              <motion.div className="text-center mb-8" variants={staggerItemVariants}>
                <motion.div
                  className="w-18 h-18 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-blue-500/30 relative"
                  style={{ width: 72, height: 72 }}
                  animate={{
                    rotate: [0, 5, -5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Fingerprint className="w-9 h-9 text-white" />
                  <OrbitingIcons size={72} />
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-transparent bg-clip-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Welcome Back
                </motion.h2>

                <motion.p
                  className="text-slate-500 mt-2 text-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                >
                  Sign in to access your account
                </motion.p>
              </motion.div>

              {/* Error Alert */}
              <AnimatePresence>{error && <ErrorAlert error={error} />}</AnimatePresence>

              {/* Login Form */}
              <motion.form onSubmit={handleLogin} variants={staggerContainerVariants}>
                <AnimatedInput
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  icon={User}
                  autoComplete="username"
                  delay={0.1}
                />

                <AnimatedInput
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  icon={Lock}
                  autoComplete="current-password"
                  delay={0.2}
                  showPasswordToggle={true}
                />

                <motion.div
                  className="mb-6"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 }}
                >
                  <AnimatedCheckbox
                    checked={stayLoggedIn}
                    onChange={(e) => setStayLoggedIn(e.target.checked)}
                    label="Stay logged in"
                  />
                </motion.div>

                <AnimatedButton
                  type="submit"
                  disabled={isLoading || !formData.username || !formData.password}
                  isLoading={isLoading}
                />
              </motion.form>

              {/* Features */}
              <FeaturesList />
            </div>
          </motion.div>

          {/* Register Link Card */}
          <motion.div
            className="mt-6 text-center bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg shadow-slate-200/30 border border-slate-200/60 py-5 px-6"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{
              scale: 1.02,
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            }}
          >
            <motion.span
              className="text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Don't have an account?{" "}
            </motion.span>
            <AnimatedLink to="/register">Register here</AnimatedLink>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <AnimatedFooter />
    </motion.div>
  );
};

export default Login;
