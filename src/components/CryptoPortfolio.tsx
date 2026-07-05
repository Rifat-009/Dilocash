import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Coins, TrendingUp, TrendingDown, RefreshCw, Plus, DollarSign, Wallet, ArrowUpRight, Info, WifiOff } from 'lucide-react';

interface CryptoCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
}

interface PortfolioItem {
  name: string;
  symbol: string;
  amount: number;
  value: number; // in USD
  color: string;
}

export default function CryptoPortfolio() {
  const [coins, setCoins] = useState<CryptoCoin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Simulated balances (loaded from localStorage for absolute offline capability)
  const [cashBalance, setCashBalance] = useState<number>(() => {
    const saved = localStorage.getItem('dilocash_crypto_cash_balance');
    return saved ? Number(saved) : 10000;
  });
  const [holdings, setHoldings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dilocash_crypto_holdings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      BTC: 0.05,
      ETH: 0.6,
      SOL: 4.5,
      XRP: 0,
      ADA: 0,
    };
  });

  // Action states
  const [selectedCoinSymbol, setSelectedCoinSymbol] = useState<string>('BTC');
  const [buyAmountStr, setBuyAmountStr] = useState<string>('500');
  const [txHistory, setTxHistory] = useState<{ id: string; type: 'BUY'; symbol: string; usdAmount: number; coinAmount: number; time: string }[]>(() => {
    const saved = localStorage.getItem('dilocash_crypto_tx_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine || localStorage.getItem('dilocash_simulated_offline') === 'true';
  });

  // Persist portfolio state in localStorage
  useEffect(() => {
    localStorage.setItem('dilocash_crypto_cash_balance', String(cashBalance));
  }, [cashBalance]);

  useEffect(() => {
    localStorage.setItem('dilocash_crypto_holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('dilocash_crypto_tx_history', JSON.stringify(txHistory));
    window.dispatchEvent(new CustomEvent('dilocash_queue_updated'));
  }, [txHistory]);

  const getFallbackCoins = () => {
    return [
      { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 62450.50, change24h: 1.82 },
      { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 3450.20, change24h: -0.45 },
      { id: 'solana', symbol: 'SOL', name: 'Solana', price: 142.80, change24h: 4.15 },
      { id: 'ripple', symbol: 'XRP', name: 'Ripple', price: 0.5230, change24h: 0.12 },
      { id: 'cardano', symbol: 'ADA', name: 'Cardano', price: 0.3850, change24h: -1.25 }
    ];
  };

  const fetchCryptoPrices = async () => {
    setLoading(true);
    if (isOffline) {
      setCoins(getFallbackCoins());
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/crypto-prices');
      const json = await response.json();
      if (json && json.success && json.data) {
        setCoins(json.data);
      } else {
        throw new Error('Prices empty');
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setCoins(getFallbackCoins());
    } finally {
      setLoading(false);
    }
  };

  // Sync network state from our custom global event
  useEffect(() => {
    const handleNetworkChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOffline: boolean }>;
      setIsOffline(customEvent.detail.isOffline);
    };
    window.addEventListener('dilocash_network_change', handleNetworkChange);
    return () => window.removeEventListener('dilocash_network_change', handleNetworkChange);
  }, []);

  useEffect(() => {
    fetchCryptoPrices();
  }, [isOffline]);

  useEffect(() => {
    fetchCryptoPrices();
  }, []);

  // Map holdings & cash into a chart-ready format
  const getPortfolioData = (): PortfolioItem[] => {
    const data: PortfolioItem[] = [
      { name: 'USD Cash', symbol: 'USD', amount: cashBalance, value: cashBalance, color: '#D4AF37' } // Gold for Cash
    ];

    const coinColors: Record<string, string> = {
      BTC: '#F7931A', // Bitcoin Orange
      ETH: '#627EEA', // Ethereum Blue
      SOL: '#A855F7', // Solana Purple
      XRP: '#23292F', // Ripple Dark Gray
      ADA: '#0033AD', // Cardano Blue
    };

    coins.forEach((coin) => {
      const qty = holdings[coin.symbol] || 0;
      if (qty > 0) {
        data.push({
          name: coin.name,
          symbol: coin.symbol,
          amount: qty,
          value: qty * coin.price,
          color: coinColors[coin.symbol] || '#94A3B8'
        });
      }
    });

    return data;
  };

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const buyAmount = parseFloat(buyAmountStr);
    if (isNaN(buyAmount) || buyAmount <= 0) {
      setErrorMsg('Please enter a valid buy amount.');
      return;
    }

    if (buyAmount > cashBalance) {
      setErrorMsg('Insufficient USD cash balance to execute purchase.');
      return;
    }

    const targetCoin = coins.find(c => c.symbol === selectedCoinSymbol);
    if (!targetCoin) {
      setErrorMsg('Selected cryptocurrency is not available.');
      return;
    }

    const coinsToReceive = buyAmount / targetCoin.price;

    // Execute sandbox ledger entry
    setCashBalance(prev => prev - buyAmount);
    setHoldings(prev => ({
      ...prev,
      [selectedCoinSymbol]: (prev[selectedCoinSymbol] || 0) + coinsToReceive
    }));

    // Add to transaction log
    const newTx = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'BUY' as const,
      symbol: selectedCoinSymbol,
      usdAmount: buyAmount,
      coinAmount: coinsToReceive,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
    setTxHistory(prev => [newTx, ...prev].slice(0, 5));

    setSuccessMsg(`Simulated BUY: Received ${coinsToReceive.toFixed(4)} ${selectedCoinSymbol}`);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleReset = () => {
    setCashBalance(10000);
    setHoldings({
      BTC: 0.05,
      ETH: 0.6,
      SOL: 4.5,
      XRP: 0,
      ADA: 0,
    });
    setTxHistory([]);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const portfolioData = getPortfolioData();
  const totalValue = portfolioData.reduce((acc, curr) => acc + curr.value, 0);
  const cryptoOnlyValue = totalValue - cashBalance;

  const activeCoinObj = coins.find(c => c.symbol === selectedCoinSymbol);

  return (
    <div id="crypto-portfolio-sim" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col h-full justify-between relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gold font-mono font-semibold tracking-widest block uppercase">
                SANDBOX WEALTH // PORTFOLIO TRACKER
              </span>
              {isOffline && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">
                  <WifiOff size={10} />
                  Offline Cache
                </span>
              )}
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight mt-1">Crypto Asset Portfolio</h4>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer text-xs font-mono"
              title="Reset Sandbox Portfolio"
            >
              Reset
            </button>
            <button
              onClick={fetchCryptoPrices}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Refresh Live Prices"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Dashboard layout: Grid split */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          {/* Chart & Allocations (left 5 columns) */}
          <div className="md:col-span-5 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 min-h-[220px]">
            <span className="text-[9px] text-gray-400 font-mono font-semibold uppercase mb-2">Portfolio Allocation</span>
            
            <div className="w-full h-32 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    innerRadius={36}
                    outerRadius={50}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Total Balance overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[8px] font-mono text-gray-500 uppercase">NET WORTH</span>
                <span className="text-sm font-bold text-white font-mono mt-0.5">
                  ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>

            {/* Micro Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-3 pt-3 border-t border-white/5 text-[9px] font-mono">
              {portfolioData.map((item, idx) => {
                const percentage = totalValue > 0 ? (item.value / totalValue) * 100 : 0;
                return (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400 truncate">{item.symbol}</span>
                    </div>
                    <span className="text-white font-semibold ml-1 shrink-0">{percentage.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulated Trading / Actions (right 7 columns) */}
          <div className="md:col-span-7 space-y-4">
            {/* Holdings & Wealth overview bar */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                <span className="text-[9px] text-gray-400 font-mono block">USD CASH</span>
                <span className="text-white text-base font-bold font-mono mt-1 block">
                  ${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
                <span className="text-[9px] text-gray-400 font-mono block">CRYPTO VALUE</span>
                <span className="text-gold text-base font-bold font-mono mt-1 block">
                  ${cryptoOnlyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Buy execution panel */}
            <form onSubmit={handleBuy} className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 space-y-3">
              <span className="text-[9px] text-gold font-semibold font-mono tracking-wider block uppercase">
                EXECUTE SIMULATED BUY ORDER
              </span>

              <div className="grid grid-cols-2 gap-3">
                {/* Select Coin */}
                <div>
                  <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Select Asset</label>
                  <select
                    value={selectedCoinSymbol}
                    onChange={(e) => setSelectedCoinSymbol(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 focus:border-gold/30 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer font-mono"
                  >
                    {loading ? (
                      <option className="bg-black text-white">Loading coins...</option>
                    ) : (
                      coins.map((c) => (
                        <option key={c.symbol} value={c.symbol} className="bg-black text-white font-mono">
                          {c.symbol} - {c.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {/* Amount to spend in USD */}
                <div>
                  <label className="text-[9px] text-gray-500 font-mono uppercase block mb-1">Spend USD Amount</label>
                  <div className="relative">
                    <DollarSign size={11} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="number"
                      required
                      min="10"
                      max={cashBalance}
                      placeholder="Amount"
                      value={buyAmountStr}
                      onChange={(e) => setBuyAmountStr(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 focus:border-gold/30 rounded-xl pl-7 pr-3 py-2 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Selected Coin Info & Submit */}
              <div className="flex items-center justify-between pt-1">
                {activeCoinObj ? (
                  <div className="text-[10px] font-mono">
                    <span className="text-gray-500">Live Quote: </span>
                    <span className="text-white font-bold">${activeCoinObj.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    <span className={`ml-1.5 font-bold ${activeCoinObj.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {activeCoinObj.change24h >= 0 ? '+' : ''}{activeCoinObj.change24h.toFixed(2)}%
                    </span>
                  </div>
                ) : (
                  <div className="text-[10px] font-mono text-gray-500">Retrieving tickers...</div>
                )}

                <button
                  type="submit"
                  disabled={loading || cashBalance < 10}
                  className="px-4 py-1.5 rounded-xl bg-gold hover:bg-gold-light disabled:opacity-40 text-black font-extrabold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} /> Buy Sandbox
                </button>
              </div>

              {/* Feedback messages */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[10px] text-red-400 font-mono"
                  >
                    ⚠️ {errorMsg}
                  </motion.p>
                )}
                {successMsg && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[10px] text-emerald-400 font-mono"
                  >
                    ✓ {successMsg}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>

      {/* Mini ledger of trades */}
      <div className="border-t border-white/5 pt-5">
        <span className="text-[10px] text-gray-400 font-mono font-semibold tracking-wider block mb-3 uppercase">
          SANDBOX CRYPTO TRADE HISTORY
        </span>
        <div className="space-y-2 max-h-[110px] overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {txHistory.length === 0 ? (
              <p className="text-center text-gray-600 text-xs py-3.5 font-mono">
                No simulated purchases made in this session.
              </p>
            ) : (
              txHistory.map((tx) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: 'auto' }}
                  exit={{ opacity: 0, x: 10, height: 0 }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.01] border border-white/[0.03] hover:bg-white/[0.02]"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                      <ArrowUpRight size={12} />
                    </div>
                    <div>
                      <span className="text-white text-xs font-bold block">
                        Bought {tx.coinAmount.toFixed(5)} {tx.symbol}
                      </span>
                      <span className="text-[9px] text-gray-500 font-mono">
                        {tx.time} • Exchange Executed
                      </span>
                    </div>
                  </div>
                  <span className="text-gold font-mono font-bold text-xs shrink-0">
                    -${tx.usdAmount.toFixed(2)}
                  </span>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
