import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyKeys } from "../store/slices/keysSlice";
import {
  Loader2,
  Key,
  Copy,
  CheckCircle,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatDistanceToNow } from "../utils/timeUtils";
import toast from "react-hot-toast";

const Keys = () => {
  const dispatch = useDispatch();
  const { myKeys, pagination, isLoading } = useSelector((state) => state.keys);

  useEffect(() => {
    dispatch(fetchMyKeys({}));
  }, [dispatch]);

  const copyKey = (keyCode) => {
    navigator.clipboard.writeText(keyCode);
    toast.success("Key copied to clipboard!");
  };

  const statusBadge = (status) => {
    const styles = {
      active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      sold: "bg-blue-50 text-blue-700 border-blue-200/60",
      expired: "bg-red-50 text-red-600 border-red-200/60",
      available: "bg-amber-50 text-amber-700 border-amber-200/60",
    };
    const icons = {
      active: <CheckCircle className="w-3 h-3" />,
      sold: <CheckCircle className="w-3 h-3" />,
      expired: <XCircle className="w-3 h-3" />,
      available: <Clock className="w-3 h-3" />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
          styles[status] || "bg-slate-50 text-slate-600 border-slate-200"
        }`}
      >
        {icons[status] || <Clock className="w-3 h-3" />}
        {status}
      </span>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            My Keys
          </h3>
          {pagination && (
            <span className="text-xs text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
              {pagination.total} total
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
              <p className="text-xs text-slate-400 mt-2">Loading keys...</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Key Code
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Game
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Duration
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Devices
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Expires
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {myKeys && myKeys.length > 0 ? (
                  myKeys.map((key) => (
                    <tr
                      key={key._id}
                      className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-mono text-slate-700 text-xs bg-slate-50/50 max-w-[200px] truncate">
                        {key.keyCode}
                      </td>
                      <td className="px-4 py-3 text-slate-800 font-medium">
                        {key.game}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {key.duration} Days
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {key.maxDevices} Device{key.maxDevices > 1 ? "s" : ""}
                      </td>
                      <td className="px-4 py-3">{statusBadge(key.status)}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {key.expiresAt
                          ? new Date(key.expiresAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => copyKey(key.keyCode)}
                          className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                          title="Copy key"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
                      <div className="text-slate-400">
                        <Key className="w-8 h-8 mx-auto mb-2 opacity-40" />
                        <p className="text-sm">No keys purchased yet</p>
                        <p className="text-xs text-slate-300 mt-1">
                          Generate a key to see it here
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-xs text-slate-500">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-1.5">
              <button
                onClick={() =>
                  dispatch(fetchMyKeys({ page: pagination.page - 1 }))
                }
                disabled={pagination.page <= 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Previous
              </button>
              <button
                onClick={() =>
                  dispatch(fetchMyKeys({ page: pagination.page + 1 }))
                }
                disabled={pagination.page >= pagination.pages}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Keys;
