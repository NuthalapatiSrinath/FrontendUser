import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
} from "framer-motion";
import {
  Key,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  EyeOff,
  Check,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Star,
  Zap,
  Award,
  Crown,
  Target,
  BarChart2,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Hash,
  Lock,
  Unlock,
  Trash2,
  Edit,
  MoreVertical,
  Download,
  Upload,
  Server,
  Database,
  Cloud,
  Globe,
  Wifi,
  Cpu,
  Layers,
  Package,
  Gift,
  Timer,
  PlayCircle,
  PauseCircle,
  Settings,
  Bell,
  Circle,
  Hexagon,
  Triangle,
  Diamond,
  Heart,
  Moon,
  Sun,
  Terminal,
  Code,
  Bookmark,
  Tag,
  Link,
} from "lucide-react";
import { getKeys, deleteKey } from "../store/slices/keysSlice";
import { formatTimeFromNow, formatDateTime } from "../utils/timeUtils";

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.1,
    },
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

const tableRowVariants = {
  initial: { opacity: 0, x: -30, scale: 0.98 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
  hover: {
    backgroundColor: "rgba(99, 102, 241, 0.05)",
    x: 5,
    scale: 1.005,
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, x: 30, scale: 0.98 },
};

const buttonVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const searchVariants = {
  initial: { width: "200px" },
  focused: {
    width: "300px",
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

const filterDropdownVariants = {
  initial: { opacity: 0, y: -10, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } },
};

const pulseVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
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
    rotate: [0, 3, -3, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  },
};

const staggerContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.05, delayChildren: 0.2 } },
};

const staggerItemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const modalVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
};

const overlayVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
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
    radial-gradient(700px circle at ${springX}% ${springY}%, rgba(99, 102, 241, 0.08), transparent 50%)
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
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      duration: Math.random() * 18 + 12,
      delay: Math.random() * 5,
      color: ["bg-indigo-400/20", "bg-purple-400/20", "bg-blue-400/20"][
        Math.floor(Math.random() * 3)
      ],
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
            y: [0, -80, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [0.15, 0.4, 0.15],
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
// ANIMATED SEARCH INPUT
// ============================================================================

const AnimatedSearchInput = ({ value, onChange, placeholder }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className="relative"
      variants={searchVariants}
      initial="initial"
      animate={isFocused ? "focused" : "initial"}
    >
      <motion.div
        className={`absolute left-3 top-1/2 -translate-y-1/2 ${
          isFocused ? "text-indigo-500" : "text-slate-400"
        }`}
        animate={{ scale: isFocused ? 1.1 : 1 }}
      >
        <Search className="w-5 h-5" />
      </motion.div>
      <motion.input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/60 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all duration-300 text-slate-700 placeholder:text-slate-400"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        whileFocus={{ boxShadow: "0 4px 20px -5px rgba(99, 102, 241, 0.2)" }}
      />
      <AnimatePresence>
        {value && (
          <motion.button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            onClick={() => onChange({ target: { value: "" } })}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <XCircle className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// FILTER DROPDOWN
// ============================================================================

const FilterDropdown = ({
  isOpen,
  onToggle,
  selectedFilter,
  onSelectFilter,
}) => {
  const filters = [
    { value: "all", label: "All Keys", icon: Key },
    { value: "active", label: "Active", icon: CheckCircle },
    { value: "inactive", label: "Inactive", icon: XCircle },
    { value: "expired", label: "Expired", icon: Clock },
  ];

  return (
    <div className="relative">
      <motion.button
        onClick={onToggle}
        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/60 text-slate-700 hover:border-indigo-400 transition-all duration-300"
        variants={buttonVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <Filter className="w-5 h-5 text-slate-400" />
        <span className="font-medium">
          {filters.find((f) => f.value === selectedFilter)?.label || "Filter"}
        </span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
          <ChevronRight className="w-4 h-4 rotate-90" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full mt-2 right-0 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-slate-200/60 py-2 z-50"
            variants={filterDropdownVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {filters.map((filter, index) => {
              const IconComponent = filter.icon;
              return (
                <motion.button
                  key={filter.value}
                  onClick={() => onSelectFilter(filter.value)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all duration-200 ${
                    selectedFilter === filter.value
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 5 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{filter.label}</span>
                  {selectedFilter === filter.value && (
                    <motion.div
                      className="ml-auto"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// STATS OVERVIEW
// ============================================================================

const StatsOverview = ({ keys }) => {
  const stats = useMemo(() => {
    const total = keys?.length || 0;
    const active = keys?.filter((k) => k.registration?.hwid)?.length || 0;
    const inactive = total - active;
    return { total, active, inactive };
  }, [keys]);

  const statItems = [
    {
      label: "Total Keys",
      value: stats.total,
      icon: Key,
      color: "from-indigo-500 to-blue-500",
    },
    {
      label: "Active",
      value: stats.active,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-500",
    },
    {
      label: "Inactive",
      value: stats.inactive,
      icon: Clock,
      color: "from-amber-500 to-orange-500",
    },
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
      variants={staggerContainerVariants}
      initial="initial"
      animate="animate"
    >
      {statItems.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.label}
            className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-5 border border-slate-200/60 overflow-hidden"
            variants={staggerItemVariants}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <motion.div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${item.color} opacity-10 blur-2xl`}
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
            />
            <div className="relative flex items-center gap-4">
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
                whileHover={{ rotate: 10 }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <p className="text-slate-500 text-sm">{item.label}</p>
                <motion.h3
                  className="text-2xl font-bold text-slate-800"
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {item.value}
                </motion.h3>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// KEY ROW COMPONENT
// ============================================================================

const KeyRow = ({ keyData, index, onView, onCopy, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(keyData.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.(keyData.key);
  }, [keyData.key, onCopy]);

  const isActive = keyData.registration?.hwid;

  return (
    <motion.tr
      variants={tableRowVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      transition={{ delay: index * 0.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="cursor-pointer border-b border-slate-100/80 last:border-0"
    >
      {/* Index */}
      <td className="px-5 py-4">
        <motion.div
          className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-medium text-slate-600"
          animate={{ rotate: isHovered ? 5 : 0 }}
        >
          {index + 1}
        </motion.div>
      </td>

      {/* Key */}
      <td className="px-5 py-4">
        <motion.div
          className="flex items-center gap-3"
          animate={{ x: isHovered ? 5 : 0 }}
        >
          <motion.div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${
              isActive
                ? "bg-gradient-to-br from-emerald-500 to-teal-500"
                : "bg-gradient-to-br from-slate-400 to-slate-500"
            }`}
            whileHover={{ scale: 1.1 }}
          >
            <Key className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <motion.p
                className="font-mono text-sm text-slate-800 truncate max-w-[200px]"
                animate={{ opacity: showKey ? 1 : 0.8 }}
              >
                {showKey
                  ? keyData.key
                  : `${keyData.key?.slice(0, 12)}${"•".repeat(8)}`}
              </motion.p>
              <motion.button
                onClick={() => setShowKey(!showKey)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </motion.button>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Created {formatTimeFromNow(keyData.createdAt)}
            </p>
          </div>
        </motion.div>
      </td>

      {/* Status */}
      <td className="px-5 py-4">
        <motion.span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
            isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500" : "bg-amber-500"}`}
            variants={pulseVariants}
            animate="animate"
          />
          {isActive ? "Active" : "Inactive"}
        </motion.span>
      </td>

      {/* HWID */}
      <td className="px-5 py-4">
        <span className="font-mono text-sm text-slate-500">
          {keyData.registration?.hwid
            ? `${keyData.registration.hwid.slice(0, 12)}...`
            : "Not registered"}
        </span>
      </td>

      {/* Actions */}
      <td className="px-5 py-4">
        <div className="flex items-center gap-2">
          <motion.button
            onClick={handleCopy}
            className={`p-2 rounded-lg transition-colors ${
              copied
                ? "bg-emerald-100 text-emerald-600"
                : "hover:bg-slate-100 text-slate-400"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <Check className="w-4 h-4" />
              </motion.div>
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>

          <motion.button
            onClick={() => onView(keyData)}
            className="p-2 rounded-lg hover:bg-indigo-100 text-slate-400 hover:text-indigo-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Eye className="w-4 h-4" />
          </motion.button>

          <motion.button
            onClick={() => onDelete(keyData)}
            className="p-2 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </td>
    </motion.tr>
  );
};

// ============================================================================
// KEY DETAILS MODAL
// ============================================================================

const KeyDetailsModal = ({ keyData, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(keyData?.key || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [keyData]);

  if (!isOpen || !keyData) return null;

  const isActive = keyData.registration?.hwid;

  const details = [
    { icon: Key, label: "License Key", value: keyData.key, mono: true },
    {
      icon: isActive ? CheckCircle : Clock,
      label: "Status",
      value: isActive ? "Active" : "Inactive",
    },
    {
      icon: Shield,
      label: "HWID",
      value: keyData.registration?.hwid || "Not registered",
      mono: true,
    },
    {
      icon: Calendar,
      label: "Created",
      value: formatDateTime(keyData.createdAt),
    },
    { icon: Hash, label: "Key ID", value: keyData._id, mono: true },
  ];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-lg overflow-hidden"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-200/60 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Key className="w-6 h-6 text-white" />
                </motion.div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Key Details
                  </h3>
                  <p className="text-xs text-slate-500">
                    View license key information
                  </p>
                </div>
              </div>
              <motion.button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-400"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {details.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <IconComponent className="w-5 h-5 text-indigo-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400 mb-0.5">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm text-slate-700 break-all ${item.mono ? "font-mono" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-slate-200/60 bg-slate-50/50 flex gap-3">
            <motion.button
              onClick={handleCopy}
              className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                copied
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                  : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border border-indigo-200"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  <span>Copy Key</span>
                </>
              )}
            </motion.button>
            <motion.button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <XCircle className="w-5 h-5" />
              <span>Close</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// DELETE CONFIRMATION MODAL
// ============================================================================

const DeleteConfirmModal = ({
  keyData,
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}) => {
  if (!isOpen || !keyData) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/60 w-full max-w-md overflow-hidden"
          variants={modalVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="p-6 text-center">
            <motion.div
              className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <Trash2 className="w-8 h-8 text-red-500" />
            </motion.div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              Delete Key?
            </h3>
            <p className="text-slate-500 mb-6">
              Are you sure you want to delete this key? This action cannot be
              undone.
            </p>

            <motion.div
              className="p-3 bg-slate-50 rounded-xl mb-6 font-mono text-sm text-slate-600"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {keyData.key?.slice(0, 20)}...
            </motion.div>

            <div className="flex gap-3">
              <motion.button
                onClick={onClose}
                className="flex-1 py-3 rounded-xl font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={() => onConfirm(keyData._id)}
                disabled={isLoading}
                className="flex-1 py-3 rounded-xl font-semibold bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </motion.div>
                ) : (
                  "Delete"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================================
// PAGINATION COMPONENT
// ============================================================================

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = useMemo(() => {
    const range = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  return (
    <motion.div
      className="flex items-center justify-between px-6 py-4 border-t border-slate-200/60 bg-slate-50/50"
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
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {pages.map((page) => (
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {page}
          </motion.button>
        ))}

        <motion.button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>
    </motion.div>
  );
};

// ============================================================================
// EMPTY STATE
// ============================================================================

const EmptyState = () => {
  return (
    <motion.div
      className="p-16 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <motion.div
        className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"
        variants={floatVariants}
        animate="animate"
      >
        <Key className="w-10 h-10 text-indigo-400" />
      </motion.div>
      <h3 className="text-xl font-bold text-slate-700 mb-2">No Keys Found</h3>
      <p className="text-slate-500 mb-6 max-w-md mx-auto">
        You haven't generated any license keys yet. Start by generating your
        first key!
      </p>
      <motion.button
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Sparkles className="w-5 h-5" />
        <span>Generate Key</span>
      </motion.button>
    </motion.div>
  );
};

// ============================================================================
// LOADING SKELETON
// ============================================================================

const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="h-20 bg-slate-100 rounded-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// MAIN KEYS COMPONENT
// ============================================================================

const Keys = () => {
  const dispatch = useDispatch();
  const { keys, isLoading, error } = useSelector((state) => state.keys);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedKey, setSelectedKey] = useState(null);
  const [keyToDelete, setKeyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getKeys());
  }, [dispatch]);

  const filteredKeys = useMemo(() => {
    let result = keys || [];

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (key) =>
          key.key?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          key.registration?.hwid
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply status filter
    if (selectedFilter !== "all") {
      result = result.filter((key) => {
        const isActive = !!key.registration?.hwid;
        if (selectedFilter === "active") return isActive;
        if (selectedFilter === "inactive") return !isActive;
        return true;
      });
    }

    return result;
  }, [keys, searchQuery, selectedFilter]);

  const paginatedKeys = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredKeys.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredKeys, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage);

  const handleDeleteConfirm = async (keyId) => {
    setIsDeleting(true);
    try {
      await dispatch(deleteKey(keyId)).unwrap();
      setKeyToDelete(null);
    } catch (err) {
      console.error("Failed to delete key:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(getKeys());
  }, [dispatch]);

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

      <div className="relative z-10 p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          className="flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-2"
              whileHover={{ scale: 1.05 }}
            >
              <Key className="w-4 h-4" />
              <span>Key Management</span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Your License Keys
            </h1>
            <p className="text-slate-500 mt-1">
              Manage and monitor all your generated keys
            </p>
          </div>

          <motion.button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/90 backdrop-blur-xl border border-slate-200/60 text-slate-700 hover:border-indigo-400 transition-all duration-300 shadow-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              animate={isLoading ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <RefreshCw className="w-5 h-5" />
            </motion.div>
            <span className="font-medium">Refresh</span>
          </motion.button>
        </motion.div>

        {/* Stats */}
        <StatsOverview keys={keys} />

        {/* Tools bar */}
        <motion.div
          className="flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatedSearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keys..."
          />

          <FilterDropdown
            isOpen={isFilterOpen}
            onToggle={() => setIsFilterOpen(!isFilterOpen)}
            selectedFilter={selectedFilter}
            onSelectFilter={(filter) => {
              setSelectedFilter(filter);
              setIsFilterOpen(false);
              setCurrentPage(1);
            }}
          />

          <div className="ml-auto text-sm text-slate-500">
            {filteredKeys.length} key{filteredKeys.length !== 1 ? "s" : ""}{" "}
            found
          </div>
        </motion.div>

        {/* Table */}
        <motion.div
          className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden"
          variants={cardVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          {isLoading && !keys?.length ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : paginatedKeys.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60">
                      {["#", "License Key", "Status", "HWID", "Actions"].map(
                        (header, i) => (
                          <motion.th
                            key={header}
                            className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {header}
                          </motion.th>
                        ),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {paginatedKeys.map((key, index) => (
                        <KeyRow
                          key={key._id}
                          keyData={key}
                          index={index}
                          onView={setSelectedKey}
                          onDelete={setKeyToDelete}
                        />
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
          ) : (
            <EmptyState />
          )}
        </motion.div>

        {/* Modals */}
        <KeyDetailsModal
          keyData={selectedKey}
          isOpen={!!selectedKey}
          onClose={() => setSelectedKey(null)}
        />

        <DeleteConfirmModal
          keyData={keyToDelete}
          isOpen={!!keyToDelete}
          onClose={() => setKeyToDelete(null)}
          onConfirm={handleDeleteConfirm}
          isLoading={isDeleting}
        />

        {/* Error Toast */}
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

export default Keys;
