import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useSpring } from "framer-motion";
import {
  User, Mail, Calendar, Clock, Key, Shield, Activity, TrendingUp,
  Wallet, CreditCard, History, ChevronRight, ChevronLeft, Sparkles,
  Star, Zap, Award, Crown, Target, BarChart2, PieChart, ArrowUpRight,
  ArrowDownRight, RefreshCw, Eye, EyeOff, Copy, CheckCircle, AlertCircle,
  Circle, Hexagon, Triangle, Diamond, Layers, Cpu, Globe, Server,
  Database, Cloud, Wifi, Gift, Rocket, Heart, Moon, Sun, Package,
  Hash, Timer, PlayCircle, PauseCircle, Settings, Bell, Search
} from "lucide-react";
import { getDashboard } from "../store/slices/dashboardSlice";
import { formatTimeFromNow, formatDateTime } from "../utils/timeUtils";

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
    scale: 1.02,
    boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const statCardVariants = {
  initial: { opacity: 0, scale: 0.8, rotateY: -30 },
  animate: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
  hover: {
    scale: 1.05,
    y: -8,
    rotateY: 5,
    transition: { type: "spring", stiffness: 300, damping: 15 },
  },
};

const tableRowVariants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
  hover: { 
    backgroundColor: "rgba(59, 130, 246, 0.05)", 
    x: 5,
    transition: { duration: 0.2 } 
  },
  exit: { opacity: 0, x: 30 },
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
    y: [0, -10, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } },
};

const glowVariants = {
  animate: {
    boxShadow: [
      "0 0 20px rgba(59, 130, 246, 0.2)",
      "0 0 40px rgba(59, 130, 246, 0.4)",
      "0 0 20px rgba(59, 130, 246, 0.2)",
    ],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  },
};

const counterVariants = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
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
    radial-gradient(600px circle at ${springX}% ${springY}%, rgba(59, 130, 246, 0.08), transparent 50%)
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
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-blue-400/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.2, 0.5, 0.2],
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
// ANIMATED NUMBER COUNTER
// ============================================================================

const AnimatedCounter = ({ value, prefix = "", suffix = "", duration = 1.5 }) => {
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
    <motion.span variants={counterVariants} initial="initial" animate="animate">
      {prefix}
      {displayValue.toLocaleString()}
      {suffix}
    </motion.span>
  );
};

// ============================================================================
// STAT CARD COMPONENT
// ============================================================================

const StatCard = ({ icon: Icon, label, value, trend, trendValue, color, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);

  const colorClasses = {
    blue: "from-blue-500 to-indigo-500",
    purple: "from-purple-500 to-pink-500",
    emerald: "from-emerald-500 to-teal-500",
    amber: "from-amber-500 to-orange-500",
    rose: "from-rose-500 to-red-500",
    cyan: "from-cyan-500 to-blue-500",
  };

  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/60 p-5 overflow-hidden"
      variants={statCardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Background glow */}
      <motion.div
        className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${colorClasses[color]} opacity-20 blur-2xl`}
        animate={{
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.3 : 0.2,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <motion.div
            className="flex items-center gap-2 mb-2"
            animate={{ x: isHovered ? 5 : 0 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center shadow-lg`}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <Icon className="w-5 h-5 text-white" />
            </motion.div>
            <span className="text-slate-500 text-sm font-medium">{label}</span>
          </motion.div>

          <motion.h3
            className="text-2xl font-bold text-slate-800 mb-2"
            animate={{ scale: isHovered ? 1.05 : 1 }}
          >
            {typeof value === "number" ? <AnimatedCounter value={value} /> : value}
          </motion.h3>

          {trend && (
            <motion.div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend === "up" ? "text-emerald-500" : "text-red-500"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: delay + 0.3 }}
            >
              {trend === "up" ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span>{trendValue}</span>
            </motion.div>
          )}
        </div>

        {/* Decorative element */}
        <motion.div
          className="absolute bottom-3 right-3 opacity-10"
          animate={{ rotate: isHovered ? 360 : 0 }}
          transition={{ duration: 1 }}
        >
          <Icon className="w-16 h-16 text-slate-400" />
        </motion.div>
      </div>

      {/* Shimmer effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            variants={shimmerVariants}
            initial={{ x: "-100%" }}
            animate="animate"
            exit={{ x: "100%", opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// USER INFO CARD COMPONENT
// ============================================================================

const UserInfoCard = ({ user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const infoItems = [
    { icon: User, label: "Username", value: user?.username || "N/A", color: "text-blue-500" },
    { icon: Mail, label: "Email", value: user?.email || "N/A", color: "text-indigo-500" },
    { icon: Shield, label: "Role", value: user?.role || "user", color: "text-purple-500" },
    { icon: Calendar, label: "Joined", value: user?.createdAt ? formatDateTime(user.createdAt) : "N/A", color: "text-emerald-500" },
  ];

  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Header gradient */}
      <motion.div
        className="h-24 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative overflow-hidden"
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        style={{ backgroundSize: "200% 200%" }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        {/* Floating shapes */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            style={{
              left: `${20 + i * 15}%`,
              top: "50%",
            }}
            animate={{
              y: [0, -20, 0],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 5 + i,
              repeat: Infinity,
              delay: i * 0.5,
            }}
          >
            <Sparkles className="w-6 h-6" />
          </motion.div>
        ))}
      </motion.div>

      {/* Avatar */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2"
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
      >
        <motion.div
          className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white"
          whileHover={{ scale: 1.1, rotate: 5 }}
          animate={glowVariants.animate}
        >
          {user?.username?.charAt(0).toUpperCase() || "U"}
        </motion.div>
      </motion.div>

      {/* Content */}
      <div className="pt-16 pb-6 px-6">
        <motion.h2
          className="text-2xl font-bold text-slate-800 text-center mb-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user?.username || "User"}
        </motion.h2>

        <motion.p
          className="text-slate-500 text-center text-sm mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {user?.email || "user@example.com"}
        </motion.p>

        <motion.button
          className="w-full py-2 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2"
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {showDetails ? "Hide Details" : "Show Details"}
          <motion.div animate={{ rotate: showDetails ? 180 : 0 }}>
            <ChevronRight className="w-4 h-4 rotate-90" />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="mt-4 space-y-3"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {infoItems.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <IconComponent className={`w-5 h-5 ${item.color}`} />
                    <div className="flex-1">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-medium text-slate-700">{item.value}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// ============================================================================
// QUICK STATS GRID
// ============================================================================

const QuickStatsGrid = ({ stats }) => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      <StatCard
        icon={Key}
        label="Total Keys"
        value={stats?.totalKeys || 0}
        trend="up"
        trendValue="+12%"
        color="blue"
        delay={0.1}
      />
      <StatCard
        icon={Activity}
        label="Active Keys"
        value={stats?.activeKeys || 0}
        trend="up"
        trendValue="+5%"
        color="emerald"
        delay={0.2}
      />
      <StatCard
        icon={Wallet}
        label="Balance"
        value={`$${stats?.balance || 0}`}
        color="purple"
        delay={0.3}
      />
      <StatCard
        icon={CreditCard}
        label="Registrations"
        value={stats?.registrations || 0}
        trend="up"
        trendValue="+8%"
        color="amber"
        delay={0.4}
      />
    </motion.div>
  );
};

// ============================================================================
// REGISTRATION TABLE COMPONENT
// ============================================================================

const RegistrationTable = ({ registrations, currentPage, totalPages, onPageChange }) => {
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusBadge = (hwid) => {
    if (hwid) {
      return (
        <motion.span
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700"
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-emerald-500"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          Active
        </motion.span>
      );
    }
    return (
      <motion.span
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="w-2 h-2 rounded-full bg-amber-500"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        Pending
      </motion.span>
    );
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-slate-50 to-white">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <History className="w-5 h-5 text-white" />
            </motion.div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Registration History</h3>
              <p className="text-xs text-slate-500">Your recent key registrations</p>
            </div>
          </div>

          <motion.button
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
        </motion.div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80">
              {["Key", "HWID", "Status", "Created"].map((header, i) => (
                <motion.th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {header}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <AnimatePresence mode="popLayout">
              {registrations?.map((reg, index) => (
                <motion.tr
                  key={reg._id || index}
                  variants={tableRowVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredRow(index)}
                  onHoverEnd={() => setHoveredRow(null)}
                  className="cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <motion.div
                      className="flex items-center gap-2"
                      animate={{ x: hoveredRow === index ? 5 : 0 }}
                    >
                      <motion.div
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Key className="w-4 h-4 text-white" />
                      </motion.div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 font-mono">
                          {reg.key?.key?.slice(0, 15) || "N/A"}...
                        </p>
                        <p className="text-xs text-slate-400">License Key</p>
                      </div>
                    </motion.div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-mono">
                      {reg.hwid ? `${reg.hwid.slice(0, 12)}...` : "Not registered"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(reg.hwid)}</td>
                  <td className="px-6 py-4">
                    <motion.div
                      className="flex items-center gap-2 text-sm text-slate-500"
                      whileHover={{ color: "#3b82f6" }}
                    >
                      <Clock className="w-4 h-4" />
                      {formatTimeFromNow(reg.createdAt)}
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Empty state */}
      {(!registrations || registrations.length === 0) && (
        <motion.div
          className="p-12 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center"
            variants={floatVariants}
            animate="animate"
          >
            <History className="w-8 h-8 text-slate-400" />
          </motion.div>
          <h4 className="text-lg font-semibold text-slate-700 mb-1">No registrations yet</h4>
          <p className="text-sm text-slate-500">Start by generating your first key</p>
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-slate-200/60 bg-slate-50/50">
          <motion.div
            className="flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-sm text-slate-500">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <motion.button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>
              {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <motion.button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${
                      currentPage === pageNum
                        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {pageNum}
                  </motion.button>
                );
              })}
              <motion.button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// ACTIVITY FEED COMPONENT
// ============================================================================

const ActivityFeed = ({ activities }) => {
  const defaultActivities = [
    { icon: Key, text: "Key generated", time: "2 min ago", color: "bg-blue-500" },
    { icon: CheckCircle, text: "HWID registered", time: "1 hour ago", color: "bg-emerald-500" },
    { icon: Award, text: "Account created", time: "2 days ago", color: "bg-purple-500" },
  ];

  const displayActivities = activities || defaultActivities;

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 p-6"
      variants={cardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
          whileHover={{ rotate: 10 }}
        >
          <Activity className="w-5 h-5 text-white" />
        </motion.div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
          <p className="text-xs text-slate-500">Your latest actions</p>
        </div>
      </motion.div>

      <motion.div
        className="space-y-4"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {displayActivities.map((activity, index) => {
          const IconComponent = activity.icon;
          return (
            <motion.div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
              variants={staggerItemVariants}
              whileHover={{ x: 5 }}
            >
              <motion.div
                className={`w-9 h-9 rounded-lg ${activity.color} flex items-center justify-center shadow-md`}
                whileHover={{ scale: 1.1 }}
              >
                <IconComponent className="w-4 h-4 text-white" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{activity.text}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

// ============================================================================
// LOADING SKELETON
// ============================================================================

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-white/90 rounded-2xl p-5 h-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          >
            <div className="w-10 h-10 bg-slate-200 rounded-xl mb-3" />
            <div className="h-6 bg-slate-200 rounded w-1/2 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-1/3" />
          </motion.div>
        ))}
      </div>

      {/* Table skeleton */}
      <motion.div
        className="bg-white/90 rounded-3xl p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="h-8 bg-slate-200 rounded w-1/4 mb-6" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="h-16 bg-slate-100 rounded-xl mb-3"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </motion.div>
    </div>
  );
};

// ============================================================================
// WELCOME HEADER COMPONENT
// ============================================================================

const WelcomeHeader = ({ user }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <motion.div
      className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-8 overflow-hidden shadow-2xl shadow-blue-500/20"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6 }}
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
            y: [0, -20, 0],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 5 + i, repeat: Infinity }}
        >
          <Icon className="w-12 h-12" />
        </motion.div>
      ))}

      <div className="relative flex flex-wrap items-center justify-between gap-6">
        <div>
          <motion.div
            className="flex items-center gap-2 text-white/80 text-sm mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Sun className="w-4 h-4" />
            <span>{getGreeting()}</span>
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-white mb-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            Welcome back, {user?.username || "User"}!
          </motion.h1>

          <motion.p
            className="text-white/70 text-sm md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Here's what's happening with your account today
          </motion.p>
        </div>

        <motion.div
          className="text-right"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-white/60 text-xs mb-1">Current Time</div>
          <div className="text-2xl font-mono font-bold text-white">
            {currentTime.toLocaleTimeString()}
          </div>
          <div className="text-white/60 text-xs mt-1">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              month: "short",
              day: "numeric",
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, isLoading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getDashboard());
  }, [dispatch]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  if (isLoading && !dashboard) {
    return (
      <motion.div
        className="p-6 space-y-6"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <LoadingSkeleton />
      </motion.div>
    );
  }

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

      <div className="relative z-10 p-6 space-y-6 max-w-7xl mx-auto">
        {/* Welcome Header */}
        <WelcomeHeader user={user} />

        {/* Quick Stats */}
        <QuickStatsGrid
          stats={{
            totalKeys: dashboard?.keys?.length || 0,
            activeKeys: dashboard?.registrations?.filter((r) => r.hwid)?.length || 0,
            balance: dashboard?.user?.balance || 0,
            registrations: dashboard?.registrations?.length || 0,
          }}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Activity */}
          <div className="space-y-6">
            <UserInfoCard user={dashboard?.user || user} />
            <ActivityFeed />
          </div>

          {/* Right Column - Registration Table */}
          <div className="lg:col-span-2">
            <RegistrationTable
              registrations={dashboard?.registrations}
              currentPage={currentPage}
              totalPages={Math.ceil((dashboard?.registrations?.length || 0) / 10)}
              onPageChange={handlePageChange}
            />
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

export default Dashboard;
