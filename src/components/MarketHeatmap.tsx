import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown, RefreshCw, AlertCircle, Info, Zap, Sparkles, WifiOff } from 'lucide-react';

interface MarketPair {
  symbol: string;
  base: string;
  quote: string;
  volatility24h: number; // percentage, e.g. 1.25%
  rate: number;
  change: number; // % change, e.g. +0.45%
  high: number;
  low: number;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  volumeUSD: string;
}

export default function MarketHeatmap() {
  const [pairs, setPairs] = useState<MarketPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<MarketPair | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine || localStorage.getItem('dilocash_simulated_offline') === 'true';
  });

  // Sync network state from our custom global event
  useEffect(() => {
    const handleNetworkChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOffline: boolean }>;
      setIsOffline(customEvent.detail.isOffline);
    };
    window.addEventListener('dilocash_network_change', handleNetworkChange);
    return () => window.removeEventListener('dilocash_network_change', handleNetworkChange);
  }, []);

  // Initial mock currencies & volatility indices with subtle random updates on refresh
  const generateMarketData = () => {
    setLoading(true);
    setTimeout(() => {
      const randomOffset = () => (Math.random() - 0.5) * 0.15; // -0.075 to +0.075
      const mockPairs: MarketPair[] = [
        { symbol: 'USD/EUR', base: 'USD', quote: 'EUR', volatility24h: Math.max(0.1, 0.32 + randomOffset()), rate: 0.9234 * (1 + randomOffset() * 0.02), change: Number((-0.12 + (Math.random() - 0.5) * 0.8).toFixed(2)), high: 0.9275, low: 0.9210, sentiment: 'Neutral', volumeUSD: '850M' },
        { symbol: 'USD/GBP', base: 'USD', quote: 'GBP', volatility24h: Math.max(0.1, 0.54 + randomOffset()), rate: 0.7915 * (1 + randomOffset() * 0.02), change: Number((0.38 + (Math.random() - 0.5) * 0.8).toFixed(2)), high: 0.7940, low: 0.7872, sentiment: 'Bullish', volumeUSD: '620M' },
        { symbol: 'USD/JPY', base: 'USD', quote: 'JPY', volatility24h: Math.max(0.1, 1.45 + randomOffset()), rate: 154.21 * (1 + randomOffset() * 0.02), change: Number((1.12 + (Math.random() - 0.5) * 1.5).toFixed(2)), high: 154.85, low: 152.10, sentiment: 'Bullish', volumeUSD: '1.4B' },
        { symbol: 'USD/INR', base: 'USD', quote: 'INR', volatility24h: Math.max(0.1, 0.21 + randomOffset()), rate: 83.45 * (1 + randomOffset() * 0.02), change: Number((0.02 + (Math.random() - 0.5) * 0.4).toFixed(2)), high: 83.52, low: 83.38, sentiment: 'Neutral', volumeUSD: '480M' },
        { symbol: 'EUR/GBP', base: 'EUR', quote: 'GBP', volatility24h: Math.max(0.1, 0.41 + randomOffset()), rate: 0.8571 * (1 + randomOffset() * 0.02), change: Number((-0.28 + (Math.random() - 0.5) * 0.6).toFixed(2)), high: 0.8615, low: 0.8550, sentiment: 'Bearish', volumeUSD: '390M' },
        { symbol: 'GBP/JPY', base: 'GBP', quote: 'JPY', volatility24h: Math.max(0.1, 1.82 + randomOffset()), rate: 194.81 * (1 + randomOffset() * 0.02), change: Number((1.48 + (Math.random() - 0.5) * 2.0).toFixed(2)), high: 195.40, low: 191.60, sentiment: 'Bullish', volumeUSD: '950M' },
        { symbol: 'AUD/USD', base: 'AUD', quote: 'USD', volatility24h: Math.max(0.1, 0.88 + randomOffset()), rate: 0.6625 * (1 + randomOffset() * 0.02), change: Number((-0.65 + (Math.random() - 0.5) * 1.0).toFixed(2)), high: 0.6685, low: 0.6610, sentiment: 'Bearish', volumeUSD: '510M' },
        { symbol: 'USD/CAD', base: 'USD', quote: 'CAD', volatility24h: Math.max(0.1, 0.67 + randomOffset()), rate: 1.3645 * (1 + randomOffset() * 0.02), change: Number((0.42 + (Math.random() - 0.5) * 0.8).toFixed(2)), high: 1.3690, low: 1.3592, sentiment: 'Bullish', volumeUSD: '420M' },
      ];

      // Assign dynamic sentiments based on randomized changes
      mockPairs.forEach(p => {
        if (p.change > 0.3) {
          p.sentiment = 'Bullish';
        } else if (p.change < -0.3) {
          p.sentiment = 'Bearish';
        } else {
          p.sentiment = 'Neutral';
        }
      });

      setPairs(mockPairs);
      // Select USD/JPY by default or keep previous selection if available
      setSelectedPair(prev => {
        if (prev) {
          const updated = mockPairs.find(mp => mp.symbol === prev.symbol);
          return updated || mockPairs[2];
        }
        return mockPairs[2];
      });
      setLastUpdated(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setLoading(false);
    }, 700);
  };

  useEffect(() => {
    generateMarketData();
  }, []);

  // Calculate Global Sentiment (Fear & Greed Index) from Volatilities and Trends
  const sentimentStats = useMemo(() => {
    if (!pairs || pairs.length === 0) {
      return { 
        index: 50, 
        label: 'Neutral', 
        color: 'text-yellow-400', 
        strokeColor: '#eab308',
        badge: 'bg-yellow-500/10 text-yellow-400', 
        insight: 'Computing global sentiment indexes...',
        avgVol: 0.5,
        avgChange: 0
      };
    }
    
    const avgVol = pairs.reduce((sum, p) => sum + p.volatility24h, 0) / pairs.length;
    const avgChange = pairs.reduce((sum, p) => sum + p.change, 0) / pairs.length;
    const bullishCount = pairs.filter(p => p.sentiment === 'Bullish').length;
    const bearishCount = pairs.filter(p => p.sentiment === 'Bearish').length;
    
    const totalSentiments = bullishCount + bearishCount || 1;
    const bullRatio = bullishCount / totalSentiments;
    
    // Fear & Greed Index calculation:
    // Base is 50. Sentiment ratio scales up/down. Volatility shifts the level based on conditions.
    const sentimentBias = (bullRatio - 0.5) * 55; // -27.5 to +27.5
    const changeBias = avgChange * 12; // typical range: -10 to +10
    const volAdjustment = (avgVol - 0.6) * (avgChange >= 0 ? 10 : -15); // High vol shifts fear or greed
    
    let index = Math.round(50 + sentimentBias + changeBias + volAdjustment);
    index = Math.max(5, Math.min(95, index)); // clamp strictly inside visible gauge bounds
    
    let label = 'Neutral';
    let color = 'text-yellow-400';
    let strokeColor = '#eab308';
    let badge = 'bg-yellow-500/10 text-yellow-400';
    let insight = 'Market conditions are stable with balanced buying and selling pressures.';

    if (index <= 25) {
      label = 'Extreme Fear';
      color = 'text-rose-500';
      strokeColor = '#f43f5e';
      badge = 'bg-rose-500/10 text-rose-400';
      insight = `Panic sentiment. Average FX volatility is elevated at ${avgVol.toFixed(2)}%, triggering structural flight-to-safety hedging.`;
    } else if (index <= 45) {
      label = 'Fear';
      color = 'text-amber-500';
      strokeColor = '#f59e0b';
      badge = 'bg-amber-500/10 text-amber-400';
      insight = `Cautious sentiment. Rising volatility and negative currency trends indicate defensive capital rotation.`;
    } else if (index <= 55) {
      label = 'Neutral';
      color = 'text-yellow-400';
      strokeColor = '#eab308';
      badge = 'bg-yellow-500/10 text-yellow-400';
      insight = `Consolidation phase. Standard deviations remain stable at ${avgVol.toFixed(2)}% with low directional bias.`;
    } else if (index <= 75) {
      label = 'Greed';
      color = 'text-emerald-400';
      strokeColor = '#10b981';
      badge = 'bg-emerald-500/10 text-emerald-400';
      insight = `Risk-on environment. Stable bullish trendlines in high-liquidity pairs indicate strong momentum accumulation.`;
    } else {
      label = 'Extreme Greed';
      color = 'text-gold';
      strokeColor = '#d4af37';
      badge = 'bg-gold/10 text-gold';
      insight = `Exuberant sentiment. Intense momentum with average positive changes of +${avgChange.toFixed(2)}% signals potential over-extension.`;
    }

    return { index, label, color, strokeColor, badge, insight, avgVol, avgChange };
  }, [pairs]);

  // Volatility categorizer to assign style classes
  const getVolTier = (vol: number) => {
    if (vol < 0.40) return { label: 'LOW', border: 'border-emerald-500/20 hover:border-emerald-500/40', text: 'text-emerald-400', bg: 'bg-emerald-950/20', badge: 'bg-emerald-500/10 text-emerald-400' };
    if (vol < 0.90) return { label: 'MODERATE', border: 'border-amber-500/20 hover:border-amber-500/40', text: 'text-amber-400', bg: 'bg-amber-950/20', badge: 'bg-amber-500/10 text-amber-400' };
    return { label: 'HIGH', border: 'border-rose-500/30 hover:border-rose-500/60 animate-pulse', text: 'text-rose-400', bg: 'bg-rose-950/20', badge: 'bg-rose-500/10 text-rose-400' };
  };

  return (
    <div id="market-heatmap" className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col h-full justify-between relative overflow-hidden backdrop-blur-xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gold font-mono font-semibold tracking-widest block uppercase">
                REAL-TIME VOLATILITY // HEATMAP INDEX
              </span>
              {isOffline && (
                <span className="flex items-center gap-1 text-[9px] font-mono text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase">
                  <WifiOff size={10} />
                  Offline Cache
                </span>
              )}
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight mt-1">Global Forex Market Heatmap</h4>
          </div>
          <button
            onClick={generateMarketData}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            title="Refresh Heatmap Volatilities"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Heatmap Grid */}
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <span className="text-xs font-mono text-gray-500 animate-pulse">COMPUTING MARKET VOLATILITY INDEX...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {pairs.map((p) => {
              const tier = getVolTier(p.volatility24h);
              const isSelected = selectedPair?.symbol === p.symbol;

              return (
                <button
                  key={p.symbol}
                  onClick={() => setSelectedPair(p)}
                  className={`p-3.5 rounded-2xl border text-left transition-all duration-300 relative overflow-hidden cursor-pointer flex flex-col justify-between h-24 ${tier.bg} ${
                    isSelected ? 'border-gold bg-gold/[0.03] shadow-md shadow-gold/5' : tier.border
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-white text-xs sm:text-sm font-bold font-mono">{p.symbol}</span>
                    <span className={`text-[8px] font-mono font-semibold px-1.5 py-0.5 rounded-full ${tier.badge}`}>
                      {tier.label}
                    </span>
                  </div>

                  <div className="mt-3">
                    <span className="text-xs font-mono text-gray-500 block">24H Volatility</span>
                    <span className={`text-sm font-mono font-bold ${tier.text}`}>
                      {p.volatility24h.toFixed(2)}%
                    </span>
                  </div>

                  {/* Tiny indicator for selection */}
                  {isSelected && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gold rounded-tl-lg" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Selected Pair & AI Sentiment Gauge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* Selected Pair Analytics */}
          <div className="md:col-span-7">
            <AnimatePresence mode="wait">
              {selectedPair && (
                <motion.div
                  key={selectedPair.symbol}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl p-5 h-full flex flex-col justify-between"
                >
                  <div className="flex justify-between items-center mb-4 pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-bold text-sm sm:text-base font-mono">{selectedPair.symbol}</span>
                      <span className="text-[10px] text-gray-400 font-mono">FOREX SPOT TICK</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold">
                      <span>Sentiment:</span>
                      <span className={selectedPair.sentiment === 'Bullish' ? 'text-emerald-400' : selectedPair.sentiment === 'Bearish' ? 'text-rose-400' : 'text-gray-400'}>
                        {selectedPair.sentiment}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-400 font-mono">ESTIMATED RATE</span>
                      <span className="text-white text-xs sm:text-sm font-bold font-mono block">
                        {selectedPair.rate.toFixed(4)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-400 font-mono">24H HIGH</span>
                      <span className="text-emerald-400 text-xs font-semibold font-mono block">
                        {selectedPair.high.toFixed(4)}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] text-gray-400 font-mono">24H LOW</span>
                      <span className="text-rose-400 text-xs font-semibold font-mono block">
                        {selectedPair.low.toFixed(4)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-gray-500">24H Change:</span>
                      <span className={selectedPair.change >= 0 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {selectedPair.change >= 0 ? '+' : ''}{selectedPair.change}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-gray-500">Vol (USD):</span>
                      <span className="text-white font-bold">${selectedPair.volumeUSD}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Global Sentiment Gauge Panel */}
          <div className="md:col-span-5">
            <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 h-full flex flex-col justify-between min-h-[175px] relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gold/5 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="flex items-center justify-between w-full pb-2 border-b border-white/5 mb-3">
                <span className="text-[9px] font-mono font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={11} className="text-gold" /> AI Sentiment Gauge
                </span>
                <span className={`text-[8px] font-mono font-extrabold px-1.5 py-0.5 rounded ${sentimentStats.badge}`}>
                  {sentimentStats.label}
                </span>
              </div>

              <div className="flex items-center gap-4 w-full">
                {/* SVG Circular Gauge */}
                <div className="shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 120 120" className="w-24 h-24 drop-shadow-[0_0_12px_rgba(212,175,55,0.04)]">
                    <defs>
                      <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="35%" stopColor="#f59e0b" />
                        <stop offset="50%" stopColor="#eab308" />
                        <stop offset="75%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#d4af37" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    {/* Background Track Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="6"
                      strokeDasharray="212.06 70.68"
                      strokeLinecap="round"
                      transform="rotate(135 60 60)"
                    />

                    {/* Colored Active Arc */}
                    <circle
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke="url(#gauge-gradient)"
                      strokeWidth="6"
                      strokeDasharray="212.06 70.68"
                      strokeDashoffset={212.06 - (sentimentStats.index / 100) * 212.06}
                      strokeLinecap="round"
                      transform="rotate(135 60 60)"
                      style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />

                    {/* Dynamic Dot indicator on arc */}
                    <circle
                      cx={60 + 45 * Math.cos(((135 + (sentimentStats.index / 100) * 270) * Math.PI) / 180)}
                      cy={60 + 45 * Math.sin(((135 + (sentimentStats.index / 100) * 270) * Math.PI) / 180)}
                      r="4.5"
                      fill="#ffffff"
                      stroke={sentimentStats.strokeColor}
                      strokeWidth="2"
                      filter="url(#glow)"
                      style={{ transition: 'cx 0.8s cubic-bezier(0.4, 0, 0.2, 1), cy 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />

                    {/* Text Readout in Center */}
                    <text
                      x="60"
                      y="53"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-mono text-2xl font-bold fill-white"
                    >
                      {sentimentStats.index}
                    </text>
                    
                    <text
                      x="60"
                      y="71"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={`font-mono text-[7px] font-extrabold tracking-widest uppercase ${sentimentStats.color}`}
                    >
                      {sentimentStats.label}
                    </text>
                    
                    <text
                      x="60"
                      y="81"
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="font-mono text-[5px] fill-gray-500 tracking-wider font-semibold"
                    >
                      FEAR & GREED
                    </text>
                  </svg>
                </div>

                {/* Insight Details */}
                <div className="flex-1 flex flex-col justify-between min-h-[96px]">
                  <p className="text-[10px] text-gray-400 leading-relaxed font-sans pr-1">
                    {sentimentStats.insight}
                  </p>
                  
                  <div className="flex gap-4 mt-2 pt-2 border-t border-white/5 text-[9px] font-mono text-gray-500">
                    <div>
                      <span>Avg Vol:</span>
                      <span className="text-white font-bold ml-1">{sentimentStats.avgVol.toFixed(2)}%</span>
                    </div>
                    <div>
                      <span>Bias:</span>
                      <span className={sentimentStats.avgChange >= 0 ? 'text-emerald-400 font-bold ml-1' : 'text-rose-400 font-bold ml-1'}>
                        {sentimentStats.avgChange >= 0 ? '+' : ''}{sentimentStats.avgChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between p-3.5 bg-white/[0.01] border border-white/[0.03] rounded-2xl text-[10px] font-mono text-gray-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Low Volatility
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Moderate Vol
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              High Volatility
            </span>
          </div>
          <span className="hidden sm:inline">UPDATED: {lastUpdated}</span>
        </div>
      </div>

      <div className="mt-5 text-[10px] text-gray-600 font-mono flex items-start gap-2 pt-4 border-t border-white/5 leading-relaxed">
        <Info size={12} className="text-gray-500 shrink-0 mt-0.5" />
        <span>
          Volatility represents standard deviations of hourly returns over 24H intervals. Use this index to spot high-liquidity and breakout momentum for smart cross-border hedging swaps.
        </span>
      </div>
    </div>
  );
}
