import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Settings as SettingsIcon,
  Save,
  Loader2,
  Key,
  User,
  Shield,
  Wallet,
  Gift,
  Lock,
} from "lucide-react";
import api from "../api/axiosInstance";
import toast from "react-hot-toast";

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.currentPassword || !formData.newPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.put("/user/auth/settings", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      toast.success(res.data.message || "Password updated!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder:text-slate-300";

  const infoItems = [
    {
      label: "Username",
      value: user?.username,
      icon: <User className="w-4 h-4 text-blue-400" />,
    },
    {
      label: "Role",
      value: user?.role,
      icon: <Shield className="w-4 h-4 text-indigo-400" />,
      capitalize: true,
    },
    {
      label: "Balance",
      value: `Rp ${(user?.balance || 0).toLocaleString()}`,
      icon: <Wallet className="w-4 h-4 text-emerald-400" />,
      valueClass: "text-emerald-600",
    },
    {
      label: "Referral Code",
      value: user?.referralCode || "N/A",
      icon: <Gift className="w-4 h-4 text-amber-400" />,
      mono: true,
      valueClass: "text-blue-600",
    },
  ];

  return (
    <div className="max-w-2xl animate-fadeIn">
      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 mb-6 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Account Information
          </h3>
        </div>
        <div className="p-5 space-y-1">
          {infoItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50/80 transition-colors -mx-1"
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span className="text-sm text-slate-500">{item.label}</span>
              </div>
              <span
                className={`text-sm font-semibold ${
                  item.mono ? "font-mono" : ""
                } ${item.capitalize ? "capitalize" : ""} ${
                  item.valueClass || "text-slate-800"
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-500" />
            Change Password
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-5">
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Current Password
            </label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter current password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={inputClass}
              placeholder="Enter new password"
            />
          </div>
          <div className="mb-5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmNewPassword"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className={inputClass}
              placeholder="Confirm new password"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
