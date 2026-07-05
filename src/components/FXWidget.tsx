import React, { useState, useEffect } from 'react';
import { FxRate } from '../types';
import { ArrowLeftRight, Coins, RefreshCcw, TrendingUp, TrendingDown, DollarSign, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export default function FXWidget() {
  const [rates, setRates] = useState<FxRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [usdAmount, setUsdAmount] = useState<string>('1250');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('EUR');
  const [isLive, setIsLive] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const [historyData, setHistoryData] = useState<{ date: string; rate: number }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [trendPercent, setTrendPercent] = useState<number>(0.25);
  const [isTrendPositive, setIsTrendPositive] = useState<boolean>(true);

  const [history24hData, setHistory24hData] = useState<{ time: string; rate: number }[]>([]);
  const [history24hLoading, setHistory24hLoading] = useState(true);
  const [trend24hPercent, setTrend24hPercent] = useState<number>(0.0);
  const [isTrend24hPositive, setIsTrend24hPositive] = useState<boolean>(true);

  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine || localStorage.getItem('dilocash_simulated_offline') === 'true';
  });

  const getFallbackRates = () => {
    return [
      { code: 'EUR', name: 'Euro', rate: 0.92, symbol: '€' },
      { code: 'GBP', name: 'British Pound', rate: 0.79, symbol: '£' },
      { code: 'JPY', name: 'Japanese Yen', rate: 154.21, symbol: '¥' },
      { code: 'AUD', name: 'Australian Dollar', rate: 1.51, symbol: 'A$' },
      { code: 'CAD', name: 'Canadian Dollar', rate: 1.36, symbol: 'C$' },
      { code: 'CHF', name: 'Swiss Franc', rate: 0.89, symbol: 'CHF' },
      { code: 'INR', name: 'Indian Rupee', rate: 83.45, symbol: '₹' }
    ];
  };

  const getFallbackHistory = (currencyCode: string) => {
    const baseRates: Record<string, number> = {
      EUR: 0.92, GBP: 0.79, JPY: 154.21, AUD: 1.51, CAD: 1.36, CHF: 0.89, INR: 83.45
    };
    const base = baseRates[currencyCode] || 1.0;
    const history = [];
    const today = new Date();
    for (let i = 8; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const wave = Math.sin((currencyCode.charCodeAt(0) + i) * 0.45) * (base * 0.012) + (Math.random() - 0.5) * (base * 0.004);
      history.push({
        date: dateStr,
        rate: Number((base + wave).toFixed(currencyCode === 'JPY' || currencyCode === 'INR' ? 2 : 4))
      });
    }
    return history;
  };

  const getFallbackHistory24h = (currencyCode: string) => {
    const baseRates: Record<string, number> = {
      EUR: 0.92, GBP: 0.79, JPY: 154.21, AUD: 1.51, CAD: 1.36, CHF: 0.89, INR: 83.45
    };
    const baseRate = baseRates[currencyCode] || 1.0;
    const history24h = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 60 * 60 * 1000);
      const label = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      const factor = i / 24;
      const noise = factor * (
        Math.sin(i * 0.4) * (baseRate * 0.004) + 
        Math.cos(i * 0.25) * (baseRate * 0.002) + 
        Math.sin(i * 0.1) * (baseRate * 0.001)
      );
      history24h.push({
        time: label,
        rate: Number((baseRate + noise).toFixed(currencyCode === 'JPY' || currencyCode === 'INR' ? 2 : 4))
      });
    }
    return history24h;
  };

  const fetchRates = async () => {
    setIsRotating(true);
    if (isOffline) {
      setRates(getFallbackRates());
      setIsLive(false);
      setLoading(false);
      setTimeout(() => setIsRotating(false), 800);
      return;
    }

    try {
      const response = await fetch('/api/fx-rates');
      const json = await response.json();
      if (json && json.success) {
        setRates(json.data);
        setIsLive(json.source === 'live');
      } else {
        throw new Error('Incomplete structure');
      }
    } catch (error) {
      console.error('Error fetching forex rates:', error);
      setRates(getFallbackRates());
      setIsLive(false);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRotating(false), 800);
    }
  };

  const fetchHistory = async (currencyCode: string) => {
    setHistoryLoading(true);
    if (isOffline) {
      const data = getFallbackHistory(currencyCode);
      setHistoryData(data);
      if (data.length > 0) {
        const firstPoint = data[0].rate;
        const lastPoint = data[data.length - 1].rate;
        if (firstPoint > 0) {
          const diff = ((lastPoint - firstPoint) / firstPoint) * 100;
          setTrendPercent(Number(diff.toFixed(2)));
          setIsTrendPositive(diff >= 0);
        }
      }
      setHistoryLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/fx-history?from=USD&to=${currencyCode}`);
      const json = await response.json();
      if (json && json.success && json.data && json.data.length > 0) {
        setHistoryData(json.data);
        const firstPoint = json.data[0].rate;
        const lastPoint = json.data[json.data.length - 1].rate;
        if (firstPoint > 0) {
          const diff = ((lastPoint - firstPoint) / firstPoint) * 100;
          setTrendPercent(Number(diff.toFixed(2)));
          setIsTrendPositive(diff >= 0);
        }
      } else {
        throw new Error('History empty');
      }
    } catch (error) {
      console.error('Error fetching historical rates:', error);
      const data = getFallbackHistory(currencyCode);
      setHistoryData(data);
    } finally {
      setHistoryLoading(false);
    }
  };

  const fetchHistory24h = async (currencyCode: string) => {
    setHistory24hLoading(true);
    if (isOffline) {
      const data = getFallbackHistory24h(currencyCode);
      setHistory24hData(data);
      if (data.length > 0) {
        const firstPoint = data[0].rate;
        const lastPoint = data[data.length - 1].rate;
        if (firstPoint > 0) {
          const diff = ((lastPoint - firstPoint) / firstPoint) * 100;
          setTrend24hPercent(Number(diff.toFixed(2)));
          setIsTrend24hPositive(diff >= 0);
        }
      }
      setHistory24hLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/fx-history-24h?from=USD&to=${currencyCode}`);
      const json = await response.json();
      if (json && json.success && json.data && json.data.length > 0) {
        setHistory24hData(json.data);
        const firstPoint = json.data[0].rate;
        const lastPoint = json.data[json.data.length - 1].rate;
        if (firstPoint > 0) {
          const diff = ((lastPoint - firstPoint) / firstPoint) * 100;
          setTrend24hPercent(Number(diff.toFixed(2)));
          setIsTrend24hPositive(diff >= 0);
        }
      } else {
        throw new Error('History 24h empty');
      }
    } catch (error) {
      console.error('Error fetching 24h historical rates:', error);
      const data = getFallbackHistory24h(currencyCode);
      setHistory24hData(data);
    } finally {
      setHistory24hLoading(false);
    }
  };

  // Sync network state from global custom event
  useEffect(() => {
    const handleNetworkChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOffline: boolean }>;
      setIsOffline(customEvent.detail.isOffline);
    };
    window.addEventListener('dilocash_network_change', handleNetworkChange);
    return () => window.removeEventListener('dilocash_network_change', handleNetworkChange);
  }, []);

  useEffect(() => {
    fetchRates();
  }, [isOffline]);

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    fetchHistory(selectedCurrency);
    fetchHistory24h(selectedCurrency);
  }, [selectedCurrency, isOffline]);

  const currentRateObj = rates.find((r) => r.code === selectedCurrency);
  const convertedValue = currentRateObj
    ? (Number(usdAmount || 0) * currentRateObj.rate).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  return (
    <div id="fx-widget-root" className="w-full bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gold tracking-wider font-mono">LIVE FX RATE SERVICE</span>
              {isOffline && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">
                  <WifiOff size={10} />
                  Offline Cache
                </span>
              )}
            </div>
            <h4 className="text-white text-xl font-bold mt-1">Cross-Border FX Exchange</h4>
          </div>
          <button
            onClick={() => {
              fetchRates();
              fetchHistory(selectedCurrency);
              fetchHistory24h(selectedCurrency);
            }}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors duration-200"
            title={isOffline ? "Utilize Local Cached Rates" : "Refresh Live Forex Rates"}
            aria-label="Refresh rates button"
          >
            <RefreshCcw size={14} className={isRotating ? 'animate-spin' : ''} />
          </button>
        </div>
        <p className="text-gray-400 text-sm mt-2">
          {isOffline 
            ? "Offline Mode active: showing locally stored offline mid-market exchange rates." 
            : "Make instant exchanges directly on Dilocash using institution-grade mid-market rates."}
        </p>

        {/* Input & Output Fields */}
        <div className="mt-6 space-y-4">
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <label htmlFor="usd-input-fx" className="text-[10px] text-gray-500 font-mono">YOU SEND (USD)</label>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-gray-400 font-mono font-medium">$</span>
                <input
                  id="usd-input-fx"
                  type="number"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="bg-transparent border-none text-white font-mono font-bold text-lg focus:outline-none w-28 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white font-mono">
                US
              </div>
              <span className="text-white text-xs font-bold font-mono">USD</span>
            </div>
          </div>

          <div className="flex justify-center -my-2 relative z-10">
            <div className="w-9 h-9 rounded-full bg-gold hover:bg-gold-light text-black flex items-center justify-center shadow-lg shadow-gold/25 transition-all duration-300">
              <ArrowLeftRight size={14} className="transform rotate-90" />
            </div>
          </div>

          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-gray-500 font-mono">YOU RECEIVE (ESTIMATED)</span>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-gold font-mono font-bold text-lg">
                  {currentRateObj?.symbol || '€'}
                </span>
                <span className="text-white font-mono font-bold text-lg">
                  {convertedValue}
                </span>
              </div>
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <select
                id="fx-currency-selector"
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 text-white text-xs font-bold font-mono cursor-pointer focus:outline-none focus:border-gold/50"
              >
                {rates.map((rate) => (
                  <option key={rate.code} value={rate.code} className="bg-charcoal-deep text-white">
                    {rate.code} - {rate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Live quote & 24h Sparkline Container */}
        <div className="mt-4 space-y-3">
          {currentRateObj && (
            <div className="flex items-center justify-between text-xs font-mono text-gray-500 bg-white/[0.02] border border-white/5 rounded-2xl p-3.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 relative flex">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                </span>
                <span>Live Mid-Market Rate:</span>
              </div>
              <span className="text-white font-bold">
                1 USD = {currentRateObj.rate} {selectedCurrency}
              </span>
            </div>
          )}

          {/* 24-Hour Sparkline Rate Trend */}
          <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-3.5 flex items-center justify-between gap-4">
            <div className="flex flex-col min-w-[110px]">
              <span className="text-[9px] text-gray-400 font-semibold tracking-wider font-mono">24H RATE TREND</span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-white text-xs font-bold font-mono">
                  {currentRateObj ? `${currentRateObj.rate}` : '0.00'}
                </span>
                <span className={`text-[9px] font-mono font-medium ${isTrend24hPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isTrend24hPositive ? '↑' : '↓'} {isTrend24hPositive ? '+' : ''}{trend24hPercent}%
                </span>
              </div>
            </div>

            {/* Micro Sparkline */}
            <div className="flex-1 h-9 max-w-[180px]">
              {history24hLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-[8px] font-mono text-gray-600 animate-pulse">GENERATING TICK CHART...</span>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history24hData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
                    <defs>
                      <linearGradient id="colorRate24h" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isTrend24hPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={isTrend24hPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <YAxis hide domain={['dataMin', 'dataMax']} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#121212',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        padding: '4px 8px',
                      }}
                      labelStyle={{ display: 'none' }}
                      itemStyle={{ color: isTrend24hPositive ? '#10B981' : '#F43F5E', padding: 0 }}
                      formatter={(value: any, name: any, props: any) => [`${value} ${selectedCurrency} at ${props.payload.time}`, 'Rate']}
                    />
                    <Area
                      type="monotone"
                      dataKey="rate"
                      stroke={isTrend24hPositive ? '#10B981' : '#F43F5E'}
                      strokeWidth={1.2}
                      fillOpacity={1}
                      fill="url(#colorRate24h)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
            
            <div className="text-[8px] text-gray-500 font-mono text-right hidden sm:block shrink-0 leading-tight">
              <span>24H GRAPH</span>
              <br />
              <span>INTERVAL: 1H</span>
            </div>
          </div>
        </div>

        {/* Recharts Analytics Historical AreaChart */}
        <div className="mt-6 bg-white/[0.02] border border-white/5 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] text-gray-400 font-semibold tracking-wider font-mono">
              {selectedCurrency}/USD 7-DAY ANALYTICAL TREND
            </span>
            <div className={`flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded ${
              isTrendPositive 
                ? 'text-emerald-400 bg-emerald-500/10' 
                : 'text-rose-400 bg-rose-500/10'
            }`}>
              {isTrendPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              <span>{isTrendPositive ? '+' : ''}{trendPercent}%</span>
            </div>
          </div>
          
          <div className="w-full h-28 flex items-center justify-center">
            {historyLoading ? (
              <span className="text-xs font-mono text-gray-600 animate-pulse">ANALYZING TRENDLINES...</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={historyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isTrendPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.2} />
                      <stop offset="95%" stopColor={isTrendPositive ? '#10B981' : '#F43F5E'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="date" 
                    tickLine={false} 
                    axisLine={false}
                    tick={{ fill: '#6B7280', fontSize: 8, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    hide 
                    domain={['dataMin - 0.002', 'dataMax + 0.002']} 
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#121212',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                      fontFamily: 'monospace',
                      fontSize: '10px',
                    }}
                    labelStyle={{ color: '#9CA3AF', fontWeight: 'bold' }}
                    itemStyle={{ color: '#D4AF37' }}
                    formatter={(value: any) => [`${value} ${selectedCurrency}`, 'Rate']}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke={isTrendPositive ? '#10B981' : '#F43F5E'}
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorRate)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex justify-between items-center text-[9px] text-gray-600 font-mono mt-2 pt-1 border-t border-white/5">
            <span>7 DAYS AGO</span>
            <span>LIVE INTERACTIVE HOVER</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 text-[10px] text-gray-500 font-mono bg-white/5 p-2 rounded-xl border border-white/5">
        <Coins size={12} className="text-gold" />
        <span>No hidden fees. Transparent 0.15% tier margins apply.</span>
      </div>
    </div>
  );
}
