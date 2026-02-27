import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import {
  Loader2,
  Clock,
  Shield,
  Wallet,
  Timer,
  User as UserIcon,
  Activity,
  Hash,
} from "lucide-react";
import { formatDistanceToNow } from "../utils/timeUtils";

const Dashboard = () => {
  const dispatch = useDispatch();
  const {
    user: dashUser,
    registrations,
    isLoading,
  } = useSelector((state) => state.dashboard);
  const { user: authUser } = useSelector((state) => state.auth);

  const user = dashUser || authUser;

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto" />
          <p className="text-sm text-slate-400 mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const infoItems = [
    {
      icon: Shield,
      label: "Role",
      value: user?.role || "User",
      color: "bg-blue-50 text-blue-600",
      capitalize: true,
    },
    {
      icon: Wallet,
      label: "Balance",
      value: `Rp ${(user?.balance || 0).toLocaleString()}`,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Clock,
      label: "Login Time",
      value: user?.lastLoginAt
        ? formatDistanceToNow(user.lastLoginAt)
        : "Just now",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: Timer,
      label: "Auto Logout",
      value: `in ${user?.autoLogoutMinutes || 30} min`,
      color: "bg-pink-50 text-pink-600",
    },
    {
      icon: UserIcon,
      label: "Username",
      value: user?.username,
      color: "bg-violet-50 text-violet-600",
    },
  ];

  return (
    <div className="animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl px-6 py-5 mb-6 shadow-lg shadow-blue-500/15 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-32" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="w-5 h-5 text-blue-200" />
            <span className="text-blue-200 text-sm font-medium">Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold">
            Welcome back, {user?.username || "User"}
          </h1>
          <p className="text-blue-200 text-sm mt-1">
            Here's your account overview
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration History Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Hash className="w-4 h-4 text-blue-500" />
                Registration History
              </h3>
              <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                {registrations?.length || 0} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      ID
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Game
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Username
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Duration
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Devices
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {registrations && registrations.length > 0 ? (
                    registrations.map((reg, i) => (
                      <tr
                        key={reg.id || i}
                        className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                      >
                        <td className="px-4 py-3 text-slate-600 font-mono text-xs">
                          #{reg.id}
                        </td>
                        <td className="px-4 py-3 text-slate-800 font-medium">
                          {reg.game}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {reg.username}
                          <span className="text-blue-500">**</span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {reg.duration}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {reg.devices}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {formatDistanceToNow(reg.createdAt)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-4 py-12 text-center">
                        <div className="text-slate-400">
                          <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                          <p className="text-sm">No registration history yet</p>
                          <p className="text-xs text-slate-300 mt-1">
                            Generate a key to get started
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">
                Account Info
              </h3>
            </div>

            <div className="p-4 space-y-1">
              {infoItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <div
                    className={`w-9 h-9 ${item.color.split(" ")[0]} rounded-xl flex items-center justify-center shrink-0`}
                  >
                    <item.icon
                      className={`w-4.5 h-4.5 ${item.color.split(" ")[1]}`}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-semibold text-slate-800 truncate ${item.capitalize ? "capitalize" : ""}`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
