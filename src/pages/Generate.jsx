import { useState, useMemo, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring, useTransform } from "framer-motion";
import {
  Key, Wallet, Plus, Sparkles, Check, Copy, Download, Shield, Zap,
  AlertCircle, Clock, RefreshCw, Star, Crown, Award, Target, Rocket,
  Gift, Package, CreditCard, Activity, TrendingUp, ChevronRight,
  Circle, Hexagon, Triangle, Diamond, Layers, Heart, Moon, Sun,
  CheckCircle, XCircle, Timer, PlayCircle, PauseCircle, Settings,
  Bell, Search, ArrowUpRight, ArrowDownRight, Eye, EyeOff, Hash,
  Lock, Unlock, Database, Cloud, Server, Cpu, Globe, Wifi, Terminal
} from "lucide-react";
import { generateKey } from "../store/slices/keysSlice";

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
    y: -8,
    scale: 1.02,
    boxShadow: "0 25px 50px -10px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 30px -5px rgba(59, 130, 246, 0.4)",
  },
  tap: { scale: 0.98 },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const shimmerVariants = {
  animate: {
    x: ["-100%", "100%"],
    transition: { duration: 1.5, repeat: Infinity, ease: "linear" },
  },
};

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 5, repeat: Infinity, ease: "easeInOut" },
  },
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(147, 51, 234, 0.3)",
      "0 0 50px rgba(147, 51, 234, 0.5)",
      "0 0 20px rgba(147, 51, 234, 0.3)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const spinVariants = {
  animate: {
    rotate: 360,
    transition: { duration: 2, repeat: Infinity, ease: "linear" },
  },
};

const successVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: {
    scale: [0, 1.2, 1],
    opacity: 1,
    transition: { type: "spring", stiffness: 200, damping: 15 },
  },
};

const keyRevealVariants = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 15, delay: 0.3 },
  },
};

const confettiVariants = {
  initial: { y: 0, opacity: 1, scale: 1 },
  animate: (i) => ({
    y: [-20, -100 - Math.random() * 100],
    x: [0, (Math.random() - 0.5) * 200],
    opacity: [1, 0],
    scale: [1, 0.5],
    rotate: [0, Math.random() * 360],
    transition: { duration: 1.5, ease: "easeOut", delay: i * 0.05 },
  }),
};

// ============================================================================
// ANIMATED BACKGROUND
// ============================================================================

const AnimatedBackground = () => {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);
  const springX = useSpring(mouseX, { stiffness: 30, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth) * 100);
      mouseY.set((e.clientY / window.innerHeight) * 100);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const backgroundGradient = useMotionTemplate`
    radial-gradient(800px circle at ${springX}% ${springY}%, rgba(147, 51, 234, 0.1), transparent 50%)
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
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
      color: ["bg-purple-400/20", "bg-pink-400/20", "bg-blue-400/20"][Math.floor(Math.random() * 3)],
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
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            opacity: [0.2, 0.6, 0.2],
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
// GEOMETRIC SHAPES
// ============================================================================

const GeometricShapes = () => {
  const shapes = [
    { Icon: Hexagon, x: 10, y: 20, size: 100, delay: 0, rotation: 15 },
    { Icon: Triangle, x: 85, y: 15, size: 80, delay: 0.5, rotation: -20 },
    { Icon: Circle, x: 75, y: 70, size: 60, delay: 1, rotation: 0 },
    { Icon: Diamond, x: 15, y: 75, size: 90, delay: 1.5, rotation: 45 },
    { Icon: Star, x: 50, y: 10, size: 50, delay: 2, rotation: 10 },
    { Icon: Layers, x: 90, y: 45, size: 70, delay: 2.5, rotation: -15 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {shapes.map((shape, index) => {
        const IconComponent = shape.Icon;
        return (
          <motion.div
            key={index}
            className="absolute text-purple-200/10"
            style={{
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              transform: `rotate(${shape.rotation}deg)`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [shape.rotation, shape.rotation + 10, shape.rotation],
              opacity: [0.05, 0.15, 0.05],
            }}
            transition={{
              duration: 8 + index * 2,
              repeat: Infinity,
              delay: shape.delay,
              ease: "easeInOut",
            }}
          >
            <IconComponent style={{ width: shape.size, height: shape.size }} />
          </motion.div>
        );
      })}
    </div>
  );
};

// ============================================================================
// ANIMATED NUMBER
// ============================================================================

const AnimatedNumber = ({ value, prefix = "", suffix = "", duration = 1 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.floor(eased * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </span>
  );
};

// ============================================================================
// SUCCESS CELEBRATION
// ============================================================================

const SuccessCelebration = ({ onComplete }) => {
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      color: ["#8B5CF6", "#EC4899", "#3B82F6", "#10B981", "#F59E0B"][Math.floor(Math.random() * 5)],
      size: Math.random() * 10 + 5,
      shape: ["circle", "square", "triangle"][Math.floor(Math.random() * 3)],
    }));
  }, []);

  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      {confettiPieces.map((piece, i) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            width: piece.size,
            height: piece.size,
            backgroundColor: piece.color,
            borderRadius: piece.shape === "circle" ? "50%" : piece.shape === "triangle" ? "0" : "2px",
            clipPath: piece.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : "none",
          }}
          variants={confettiVariants}
          initial="initial"
          animate="animate"
          custom={i}
        />
      ))}
      <motion.div
        className="text-6xl"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: [0, 1.5, 1], rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        🎉
      </motion.div>
    </div>
  );
};

// ============================================================================
// BALANCE CARD COMPONENT
// ============================================================================

const BalanceCard = ({ balance }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 rounded-3xl p-8 overflow-hidden shadow-2xl"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        animate={{ x: isHovered ? 10 : 0 }}
      />

      {/* Glowing orbs */}
      <motion.div
        className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-purple-400/30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-pink-400/30 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />

      {/* Content */}
      <div className="relative">
        <motion.div
          className="flex items-center gap-3 mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Wallet className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-white/80 text-sm font-medium">Available Balance</h3>
            <p className="text-white/60 text-xs">Ready to generate keys</p>
          </div>
        </motion.div>

        <motion.div
          className="text-5xl font-bold text-white mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          $<AnimatedNumber value={balance || 0} />
        </motion.div>

        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <motion.div
              className="w-2 h-2 rounded-full bg-emerald-400"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span>Active</span>
          </div>
          <div className="flex items-center gap-2 text-white/70 text-sm">
            <Key className="w-4 h-4" />
            <span>1 Key = $1</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        className="absolute bottom-4 right-4 text-white/10"
        animate={{ rotate: isHovered ? 15 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <CreditCard className="w-24 h-24" />
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// GENERATE BUTTON COMPONENT
// ============================================================================

const GenerateButton = ({ onClick, isLoading, disabled, balance }) => {
  const [particles, setParticles] = useState([]);

  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }));
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 1000);
  }, []);

  const handleClick = () => {
    if (!disabled && !isLoading) {
      createParticles();
      onClick();
    }
  };

  return (
    <div className="relative">
      {/* Particle explosion effect */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-purple-400"
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: particle.x,
              y: particle.y,
              opacity: 0,
              scale: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          relative w-full py-5 px-8 rounded-2xl font-bold text-lg
          transition-all duration-300 overflow-hidden
          ${
            disabled
              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 text-white shadow-xl shadow-purple-500/30"
          }
        `}
        style={{ backgroundSize: "200% 100%" }}
        variants={buttonVariants}
        initial="initial"
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        animate={
          !disabled
            ? {
                backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
              }
            : undefined
        }
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      >
        {/* Shimmer effect */}
        {!disabled && !isLoading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={shimmerVariants}
            animate="animate"
          />
        )}

        {/* Button content */}
        <span className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <motion.div variants={spinVariants} animate="animate">
                <RefreshCw className="w-6 h-6" />
              </motion.div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Key className="w-6 h-6" />
              </motion.div>
              <span>Generate New Key</span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
            </>
          )}
        </span>

        {/* Glow effect */}
        {!disabled && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{
              boxShadow: [
                "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
                "0 0 40px rgba(168, 85, 247, 0.5), inset 0 0 30px rgba(255, 255, 255, 0.2)",
                "0 0 20px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Balance warning */}
      {balance <= 0 && (
        <motion.p
          className="text-center text-red-500 text-sm mt-3 flex items-center justify-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle className="w-4 h-4" />
          Insufficient balance. Please add funds to continue.
        </motion.p>
      )}
    </div>
  );
};

// ============================================================================
// GENERATED KEY DISPLAY
// ============================================================================

const GeneratedKeyDisplay = ({ keyData, onCopy, copied }) => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 p-8 overflow-hidden"
      variants={keyRevealVariants}
      initial="initial"
      animate="animate"
    >
      {/* Success icon */}
      <motion.div
        className="flex justify-center mb-6"
        variants={successVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div
          className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
          variants={glowVariants}
          animate="animate"
        >
          <Check className="w-10 h-10 text-white" />
        </motion.div>
      </motion.div>

      {/* Success message */}
      <motion.h3
        className="text-2xl font-bold text-slate-800 text-center mb-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        Key Generated Successfully!
      </motion.h3>
      <motion.p
        className="text-slate-500 text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Your new license key is ready to use
      </motion.p>

      {/* Key display */}
      <motion.div
        className="relative bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className="w-8 h-8 rounded-lg bg-purple-500 flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Key className="w-4 h-4 text-white" />
          </motion.div>
          <span className="text-slate-400 text-sm font-medium">License Key</span>
        </div>

        <motion.p
          className="font-mono text-lg text-white break-all select-all"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {keyData?.key || "XXXX-XXXX-XXXX-XXXX"}
        </motion.p>

        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-transparent rounded-bl-3xl" />
      </motion.div>

      {/* Action buttons */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <motion.button
          onClick={onCopy}
          className={`
            flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2
            transition-all duration-300
            ${
              copied
                ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                : "bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-200"
            }
          `}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="copied"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="flex items-center gap-2"
              >
                <Copy className="w-5 h-5" />
                <span>Copy Key</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        <motion.button
          className="flex-1 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all duration-300"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Download className="w-5 h-5" />
          <span>Download</span>
        </motion.button>
      </motion.div>

      {/* Key info */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        {[
          { icon: Clock, label: "Created", value: "Just now" },
          { icon: Shield, label: "Status", value: "Active" },
        ].map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
              whileHover={{ x: 5 }}
            >
              <IconComponent className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm font-medium text-slate-700">{item.value}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// FEATURES GRID
// ============================================================================

const FeaturesGrid = () => {
  const features = [
    {
      icon: Shield,
      title: "Secure Generation",
      description: "Military-grade encryption for all keys",
      color: "from-blue-500 to-indigo-500",
    },
    {
      icon: Zap,
      title: "Instant Delivery",
      description: "Keys generated in milliseconds",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: RefreshCw,
      title: "Easy Management",
      description: "View and manage all your keys",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Lock,
      title: "HWID Protection",
      description: "Hardware locked activation",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <motion.div
            key={index}
            className="bg-white/80 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/60 hover:shadow-lg transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg mb-4`}
              whileHover={{ rotate: 10 }}
            >
              <IconComponent className="w-6 h-6 text-white" />
            </motion.div>
            <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
            <p className="text-sm text-slate-500">{feature.description}</p>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// PRICING INFO CARD
// ============================================================================

const PricingInfoCard = () => {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 p-6 overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
        >
          <CreditCard className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Pricing</h3>
          <p className="text-xs text-slate-500">Simple and transparent</p>
        </div>
      </div>

      <div className="space-y-4">
        {[
          { label: "Per Key", value: "$1.00", highlight: true },
          { label: "Bulk (10+)", value: "$0.90" },
          { label: "Enterprise (100+)", value: "$0.75" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`flex items-center justify-between p-3 rounded-xl ${
              item.highlight ? "bg-purple-50 border border-purple-200" : "bg-slate-50"
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ x: 5 }}
          >
            <span className="text-sm text-slate-600">{item.label}</span>
            <span className={`font-bold ${item.highlight ? "text-purple-600" : "text-slate-700"}`}>
              {item.value}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ============================================================================
// RECENT KEYS LIST
// ============================================================================

const RecentKeysList = ({ keys }) => {
  const displayKeys = keys?.slice(0, 3) || [];

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 p-6 overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <History className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Recent Keys</h3>
            <p className="text-xs text-slate-500">Your latest generated keys</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {displayKeys.length > 0 ? (
          displayKeys.map((key, index) => (
            <motion.div
              key={key._id || index}
              className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <motion.div
                className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
                whileHover={{ scale: 1.1 }}
              >
                <Key className="w-4 h-4 text-white" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-slate-700 truncate">
                  {key.key?.slice(0, 20)}...
                </p>
                <p className="text-xs text-slate-400">Generated recently</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>
          ))
        ) : (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="w-12 h-12 mx-auto mb-3 rounded-xl bg-slate-100 flex items-center justify-center"
              variants={floatVariants}
              animate="animate"
            >
              <Key className="w-6 h-6 text-slate-400" />
            </motion.div>
            <p className="text-sm text-slate-500">No keys generated yet</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ============================================================================
// LOADING COMPONENT
// ============================================================================

const History = Key; // Alias for the History icon

// ============================================================================
// MAIN GENERATE COMPONENT
// ============================================================================

const Generate = () => {
  const dispatch = useDispatch();
  const { keys, isLoading, error } = useSelector((state) => state.keys);
  const { user } = useSelector((state) => state.auth);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [copied, setCopied] = useState(false);
  const balance = user?.balance || 0;

  const handleGenerate = async () => {
    try {
      const result = await dispatch(generateKey()).unwrap();
      setGeneratedKey(result.key);
      setShowCelebration(true);
    } catch (err) {
      console.error("Failed to generate key:", err);
    }
  };

  const handleCopy = useCallback(() => {
    if (generatedKey?.key) {
      navigator.clipboard.writeText(generatedKey.key);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [generatedKey]);

  const handleCelebrationComplete = useCallback(() => {
    setShowCelebration(false);
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
      <GeometricShapes />

      {/* Success Celebration */}
      <AnimatePresence>
        {showCelebration && <SuccessCelebration onComplete={handleCelebrationComplete} />}
      </AnimatePresence>

      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-medium mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Key Generator</span>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Generate License Keys
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Create secure, unique license keys instantly. Each key costs $1 from your balance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <BalanceCard balance={balance} />
            <GenerateButton
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={balance <= 0}
              balance={balance}
            />
            <FeaturesGrid />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {generatedKey ? (
                <GeneratedKeyDisplay
                  key="generated"
                  keyData={generatedKey}
                  onCopy={handleCopy}
                  copied={copied}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 p-8 text-center"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center"
                    variants={floatVariants}
                    animate="animate"
                  >
                    <Key className="w-10 h-10 text-purple-400" />
                  </motion.div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Ready to Generate</h3>
                  <p className="text-slate-500 mb-6">
                    Click the button to generate your new license key
                  </p>
                  <motion.div
                    className="flex items-center justify-center gap-2 text-purple-500"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <span className="text-sm font-medium">Your key will appear here</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <PricingInfoCard />
            <RecentKeysList keys={keys} />
          </div>
        </div>

        {/* Error display */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="fixed bottom-6 right-6 bg-red-500 text-white px-6 py-3 rounded-xl shadow-lg"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Generate;
