import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, ShieldCheck, Plus, RotateCcw, ArrowUpRight, AlertTriangle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  time: string;
  category: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Tech: '#38bdf8',          // light blue
  Dining: '#f43f5e',        // rose
  Travel: '#10b981',        // emerald
  Hardware: '#fbbf24',      // amber/gold
  Subscriptions: '#8b5cf6', // violet
  Compliance: '#f97316',    // orange
  Miscellaneous: '#64748b', // slate
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0c0c0e] border border-white/10 rounded-xl p-3 shadow-xl font-mono text-xs">
        <p className="font-bold text-white mb-1">{payload[0].name}</p>
        <p className="text-gold font-bold">${payload[0].value.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
      </div>
    );
  }
  return null;
};

export default function SpendingSimulator() {
  const [threshold, setThreshold] = useState<number>(3500);
  const [currentSpend, setCurrentSpend] = useState<number>(1450);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '1', description: 'Amazon Cloud Node Host', amount: 450, time: '10:14 AM', category: 'Tech' },
    { id: '2', description: 'Cross-Border Clearing Fee', amount: 200, time: '11:45 AM', category: 'Compliance' },
    { id: '3', description: 'Premium Metal Card Minting', amount: 800, time: '01:22 PM', category: 'Hardware' },
  ]);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [customDesc, setCustomDesc] = useState<string>('');
  const [customCategory, setCustomCategory] = useState<string>('Tech');

  const handleAddTransaction = (description: string, amount: number, category: string) => {
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      description: description || 'Simulated Purchase',
      amount,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      category,
    };
    setTransactions((prev) => [newTx, ...prev].slice(0, 10)); // Keep last 10 in feed
    setCurrentSpend((prev) => prev + amount);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(customAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;
    handleAddTransaction(customDesc.trim() || 'Custom Sandbox Transaction', parsedAmount, customCategory);
    setCustomAmount('');
    setCustomDesc('');
  };

  const handleReset = () => {
    setCurrentSpend(0);
    setTransactions([]);
  };

  const spendPercentage = threshold > 0 ? (currentSpend / threshold) * 100 : 0;
  const isOverThreshold = currentSpend >= threshold;
  const isNearThreshold = !isOverThreshold && spendPercentage >= 80;

  const getProgressBarColor = () => {
    if (isOverThreshold) return 'bg-gradient-to-r from-rose-500 to-red-600';
    if (isNearThreshold) return 'bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse';
    return 'bg-gradient-to-r from-gold via-gold-light to-emerald-400';
  };

  // Dynamically compute spending breakdown
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions.forEach((tx) => {
      const cat = tx.category || 'Miscellaneous';
      totals[cat] = (totals[cat] || 0) + tx.amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  return (
    <div id="spending-simulator" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20" />
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] text-gold font-mono font-semibold tracking-widest block uppercase">
            SANDBOX SIMULATION // SHIELD CONTROLS
          </span>
          <h4 className="text-xl font-bold text-white tracking-tight mt-1">Spending Threshold Guard</h4>
        </div>
        <button
          onClick={handleReset}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
          title="Reset sandbox tracker"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-w-0">
        {/* Left Column: Spend Controls & Simulation */}
        <div className="flex flex-col justify-between space-y-6 min-w-0">
          <div>
            {/* Adjust Threshold Slider */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs text-gray-400 font-semibold font-mono uppercase">
                  Monthly Threshold Limit
                </label>
                <span className="text-gold font-mono font-bold text-base">
                  ${threshold.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold focus:outline-none"
              />
              <div className="flex gap-2 mt-3.5">
                {[1000, 2500, 5000, 10000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setThreshold(val)}
                    className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono transition-all ${
                      threshold === val
                        ? 'bg-gold/20 text-gold border border-gold/40'
                        : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    ${val >= 1000 ? `${val / 1000}K` : val}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar Display */}
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 mb-6">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs text-gray-400 font-mono">Simulated Month spending</span>
                <div className="text-right">
                  <span className="text-white text-lg font-bold font-mono">
                    ${currentSpend.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono ml-1">
                    / ${threshold.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden relative border border-white/5">
                <motion.div
                  className={`h-full rounded-full transition-all duration-300 ${getProgressBarColor()}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(spendPercentage, 100)}%` }}
                />
                {/* 80% Safety Alert mark */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-red-400/60 left-[80%] border-r border-dashed border-red-500/80"
                  title="80% Safety Threshold"
                />
              </div>

              <div className="flex justify-between items-center mt-2.5">
                <span className="text-[9px] text-gray-500 font-mono">0% Spend</span>
                <span className="text-[9px] text-red-400/80 font-mono flex items-center gap-1">
                  <span>●</span> 80% Warning Limit
                </span>
                <span className="text-[9px] text-gray-500 font-mono">100% Limit</span>
              </div>
            </div>

            {/* Safety Alert Threshold Alerts */}
            <AnimatePresence mode="wait">
              {isOverThreshold ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-start"
                >
                  <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400 shrink-0 mt-0.5">
                    <ShieldAlert size={16} className="animate-pulse" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-red-400 font-mono block">CRITICAL ALERT: LIMIT REACHED</span>
                    <p className="text-[11px] text-red-300/80 leading-relaxed">
                      Your simulated spending has fully breached the configured threshold! Automated cold storage guards have locked down subsequent card swipes.
                    </p>
                  </div>
                </motion.div>
              ) : isNearThreshold ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-amber-400 font-mono block">SAFETY ALERT: APPROACHING LIMIT</span>
                    <p className="text-[11px] text-amber-300/80 leading-relaxed">
                      You have exceeded 80% of your budget. Dynamic ledger shields are active. Transaction micro-auditing has been enforced.
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-2.5 items-center"
                >
                  <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                  <span className="text-[11px] text-emerald-300/80 font-mono">
                    Safe status zone. Transaction channels are running at zero-latency.
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Add Transaction buttons */}
          <div className="space-y-3">
            <span className="text-[9px] text-gray-500 font-mono font-semibold tracking-wider block uppercase">
              SIMULATE INSTANT LEDGER ENTRIES
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleAddTransaction('Paris Hotel Escapade', 420.00, 'Travel')}
                disabled={isOverThreshold}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold/30 hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left cursor-pointer group"
              >
                <div>
                  <span className="text-white text-xs font-bold block">Hotel Escapade</span>
                  <span className="text-[9px] text-gray-500 font-mono">Travel</span>
                </div>
                <span className="text-gold font-mono font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  +$420.00
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleAddTransaction('SaaS Server Allocation', 150.00, 'Tech')}
                disabled={isOverThreshold}
                className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-gold/30 hover:bg-white/[0.07] disabled:opacity-40 disabled:cursor-not-allowed transition-all text-left cursor-pointer group"
              >
                <div>
                  <span className="text-white text-xs font-bold block">Server Node Host</span>
                  <span className="text-[9px] text-gray-500 font-mono">Tech</span>
                </div>
                <span className="text-gold font-mono font-bold text-xs group-hover:translate-x-0.5 transition-transform">
                  +$150.00
                </span>
              </button>
            </div>

            {/* Custom entry form */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2 mt-2">
              <input
                type="text"
                required
                placeholder="Merchant description"
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                className="flex-1 bg-white/5 border border-white/5 focus:border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="bg-white/5 border border-white/5 focus:border-gold/30 rounded-xl px-2 py-2 text-xs text-white focus:outline-none cursor-pointer font-mono"
              >
                <option value="Tech" className="bg-[#18181b] text-white">Tech</option>
                <option value="Dining" className="bg-[#18181b] text-white">Dining</option>
                <option value="Travel" className="bg-[#18181b] text-white">Travel</option>
                <option value="Subscriptions" className="bg-[#18181b] text-white">Subscriptions</option>
                <option value="Hardware" className="bg-[#18181b] text-white">Hardware</option>
                <option value="Compliance" className="bg-[#18181b] text-white">Compliance</option>
                <option value="Miscellaneous" className="bg-[#18181b] text-white">Misc</option>
              </select>
              <input
                type="number"
                required
                placeholder="$ Amt"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-20 bg-white/5 border border-white/5 focus:border-gold/30 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none text-center font-mono"
              />
              <button
                type="submit"
                disabled={isOverThreshold}
                className="px-3 rounded-xl bg-gold hover:bg-gold-light text-black font-extrabold text-xs transition-colors disabled:opacity-40 flex items-center justify-center cursor-pointer"
                title="Post Entry"
              >
                <Plus size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Category Breakdown Chart & History */}
        <div className="flex flex-col justify-between space-y-6 bg-white/[0.01] border border-white/5 rounded-2xl p-5 relative overflow-hidden min-w-0 h-[576.638px]">
          <div>
            <span className="text-[10px] text-gold font-mono font-semibold tracking-widest block uppercase mb-1">
              CATEGORY DISTRIBUTION // REALTIME
            </span>
            <div className="flex items-center justify-between">
              <h5 className="text-sm font-bold text-white tracking-tight">Category Breakdown</h5>
              <span className="text-[10px] text-gray-500 font-mono">
                {categoryData.length} active sectors
              </span>
            </div>

            {/* Pie Chart display area */}
            <div className="relative w-full h-[200px] flex items-center justify-center mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData.length > 0 ? categoryData : [{ name: 'No Spending', value: 1 }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoryData.length > 0 ? (
                      categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={CATEGORY_COLORS[entry.name] || CATEGORY_COLORS.Miscellaneous}
                        />
                      ))
                    ) : (
                      <Cell fill="#1e293b" />
                    )}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Total display inside the donut */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[9px] text-gray-500 font-mono uppercase tracking-widest">Total</span>
                <span className="text-lg font-bold text-white font-mono mt-0.5">
                  ${currentSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Legend grids */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
              {Object.keys(CATEGORY_COLORS).map((cat) => {
                const spendingObj = categoryData.find((d) => d.name === cat);
                const val = spendingObj ? spendingObj.value : 0;
                if (val === 0 && cat !== 'Miscellaneous') return null; // Only show non-zero categories
                return (
                  <div key={cat} className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 truncate">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                      />
                      <span className="text-gray-400 truncate">{cat}</span>
                    </div>
                    <span className="text-white font-mono font-medium">${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Transaction History Feed */}
          <div className="border-t border-white/5 pt-5 mt-auto">
            <span className="text-[10px] text-gray-400 font-mono font-semibold tracking-wider block mb-3 uppercase">
              SANDBOX TRANSACTION HISTORY
            </span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {transactions.length === 0 ? (
                  <p className="text-center text-gray-600 text-xs py-4 font-mono">
                    No simulated swipes posted in this session.
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10, height: 0 }}
                      animate={{ opacity: 1, x: 0, height: 'auto' }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: CATEGORY_COLORS[tx.category] || CATEGORY_COLORS.Miscellaneous }}
                        />
                        <div className="min-w-0">
                          <span className="text-white text-xs font-bold block truncate max-w-[140px] sm:max-w-[180px]">
                            {tx.description}
                          </span>
                          <span className="text-[9px] text-gray-500 font-mono">
                            {tx.time} • {tx.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-white font-mono font-bold text-xs shrink-0">
                        -${tx.amount.toFixed(2)}
                      </span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
