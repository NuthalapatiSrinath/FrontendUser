import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAvailableKeys,
  generateKey,
  clearLastGenerated,
} from "../store/slices/keysSlice";
import { fetchDashboard } from "../store/slices/dashboardSlice";
import {
  Loader2,
  Zap,
  Copy,
  CheckCircle,
  Wallet,
  Gamepad2,
  Clock,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";

const Generate = () => {
  const dispatch = useDispatch();
  const { availableKeys, generateLoading, lastGenerated, isLoading } =
    useSelector((state) => state.keys);
  const { user } = useSelector((state) => state.auth);

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");

  useEffect(() => {
    dispatch(fetchAvailableKeys());
    dispatch(clearLastGenerated());
  }, [dispatch]);

  const durationsForGame = availableKeys.filter(
    (k) => k._id?.game === selectedGame,
  );

  const handleGenerate = () => {
    if (!selectedGame || !selectedDuration) {
      toast.error("Please select a game and duration");
      return;
    }
    dispatch(
      generateKey({ game: selectedGame, duration: Number(selectedDuration) }),
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Key generated successfully!");
        dispatch(fetchAvailableKeys());
        dispatch(fetchDashboard());
      } else {
        toast.error(res.payload || "Generation failed");
      }
    });
  };

  const copyKey = (keyCode) => {
    navigator.clipboard.writeText(keyCode);
    toast.success("Key copied!");
  };

  const games = [...new Set(availableKeys.map((k) => k._id?.game))].filter(
    Boolean,
  );

  const selectClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all";

  return (
    <div className="animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-500" />
            Generate Key
          </h3>
        </div>

        <div className="p-5">
          {/* Balance Display */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">
                  Your Balance
                </p>
                <p className="text-lg font-bold text-slate-800">
                  Rp {(user?.balance || 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                <p className="text-xs text-slate-400 mt-2">
                  Loading available keys...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Available Keys Summary */}
              {availableKeys.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">
                    Available Keys
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {availableKeys.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white border border-slate-200/60 rounded-xl p-4 hover:shadow-md hover:border-blue-200 transition-all group cursor-default"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Gamepad2 className="w-4 h-4 text-blue-400 group-hover:text-blue-500 transition-colors" />
                          <p className="text-sm font-bold text-slate-800">
                            {item._id?.game}
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                          <Clock className="w-3 h-3" />
                          {item._id?.duration} Days &middot; {item.count}{" "}
                          available
                        </div>
                        <p className="text-sm text-emerald-600 font-semibold">
                          Rp {(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selection Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Game
                  </label>
                  <select
                    value={selectedGame}
                    onChange={(e) => {
                      setSelectedGame(e.target.value);
                      setSelectedDuration("");
                    }}
                    className={selectClass}
                  >
                    <option value="">Select a game</option>
                    {games.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Duration
                  </label>
                  <select
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    disabled={!selectedGame}
                    className={`${selectClass} disabled:opacity-50`}
                  >
                    <option value="">Select duration</option>
                    {durationsForGame.map((d, i) => (
                      <option key={i} value={d._id?.duration}>
                        {d._id?.duration} Days - Rp{" "}
                        {(d.price || 0).toLocaleString()} ({d.count} available)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={generateLoading || !selectedGame || !selectedDuration}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-6 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {generateLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                {generateLoading ? "Generating..." : "Generate Key"}
              </button>
            </>
          )}

          {/* Generated Key Result */}
          {lastGenerated && lastGenerated.success && (
            <div className="mt-6 bg-emerald-50 border border-emerald-200/60 rounded-xl p-5 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-emerald-700">
                  Key Generated Successfully!
                </span>
              </div>
              <div className="bg-white rounded-xl border border-emerald-200/60 px-4 py-3 flex items-center justify-between">
                <span className="font-mono text-lg text-slate-800 tracking-wider">
                  {lastGenerated.key?.keyCode}
                </span>
                <button
                  onClick={() => copyKey(lastGenerated.key?.keyCode)}
                  className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-emerald-600 mt-3">
                Game: {lastGenerated.key?.game} &middot; Duration:{" "}
                {lastGenerated.key?.duration} Days &middot; New Balance: Rp{" "}
                {(lastGenerated.newBalance || 0).toLocaleString()}
              </p>
            </div>
          )}

          {availableKeys.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-400">
                No keys available for purchase at the moment
              </p>
              <p className="text-xs text-slate-300 mt-1">
                Check back later for new keys
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Generate;
