import { useEffect, useState } from 'react';
import { CryptoPrice } from '../types';
import { TrendingUp, TrendingDown, RefreshCw, WifiOff } from 'lucide-react';

export default function Ticker() {
  const [prices, setPrices] = useState<CryptoPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [isOffline, setIsOffline] = useState(() => {
    return !navigator.onLine || localStorage.getItem('dilocash_simulated_offline') === 'true';
  });

  const getFallbackPrices = () => {
    const mockVolatility = () => (Math.random() - 0.5) * 0.15;
    return [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', price: 92450.25 + mockVolatility() * 50, change24h: 3.42 + mockVolatility() },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', price: 3412.80 + mockVolatility() * 5, change24h: -1.25 + mockVolatility() },
      { id: 'solana', name: 'Solana', symbol: 'SOL', price: 184.65 + mockVolatility() * 0.5, change24h: 8.92 + mockVolatility() },
      { id: 'binancecoin', name: 'BNB', symbol: 'BNB', price: 592.10 + mockVolatility() * 1.2, change24h: 0.15 + mockVolatility() },
      { id: 'ripple', name: 'Ripple', symbol: 'XRP', price: 2.14 + mockVolatility() * 0.01, change24h: -4.10 + mockVolatility() }
    ];
  };

  const fetchPrices = async () => {
    if (isOffline) {
      setPrices(getFallbackPrices());
      setIsLive(false);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/crypto');
      const json = await response.json();
      if (json && json.success) {
        setPrices(json.data);
        setIsLive(json.source === 'live');
      } else {
        throw new Error('Incomplete data structure');
      }
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      setPrices(getFallbackPrices());
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  // Sync network state change from our custom global event
  useEffect(() => {
    const handleNetworkChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ isOffline: boolean }>;
      setIsOffline(customEvent.detail.isOffline);
    };
    window.addEventListener('dilocash_network_change', handleNetworkChange);
    return () => window.removeEventListener('dilocash_network_change', handleNetworkChange);
  }, []);

  // Refetch prices when offline state shifts
  useEffect(() => {
    fetchPrices();
  }, [isOffline]);

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div id="crypto-ticker-loading" className="w-full bg-black/80 border-b border-white/5 py-2 text-xs text-center text-gray-500 font-mono tracking-wider">
        CONNECTING TO LIVE LIQUIDITY POOLS...
      </div>
    );
  }

  // Duplicate items to ensure infinite seamless scrolling
  const tickerItems = [...prices, ...prices, ...prices, ...prices];

  return (
    <div id="crypto-ticker-container" className="w-full bg-charcoal-deep/90 border-b border-white/5 py-2 overflow-hidden relative z-50 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-charcoal-deep to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-charcoal-deep to-transparent z-10 pointer-events-none" />
      
      {isOffline && (
        <div className="absolute left-4 top-1.5 z-20 flex items-center gap-1 bg-amber-500/25 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase">
          <WifiOff size={10} />
          <span>OFFLINE WORKSPACE</span>
        </div>
      )}

      <div className="flex whitespace-nowrap items-center gap-12 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
        {tickerItems.map((crypto, index) => {
          const isPositive = crypto.change24h >= 0;
          return (
            <div
              key={`${crypto.id}-${index}`}
              className="inline-flex items-center gap-3 font-mono text-xs text-gray-400 group cursor-pointer"
            >
              <span className="font-bold text-white group-hover:text-gold transition-colors duration-200">
                {crypto.name}
              </span>
              <span className="text-gray-500 bg-white/5 px-1.5 py-0.5 rounded text-[10px]">
                {crypto.symbol}
              </span>
              <span className="text-white font-semibold">
                ${crypto.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`inline-flex items-center gap-0.5 text-[10px] font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                {isPositive ? '+' : ''}{crypto.change24h.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>

      {/* Tailwind inline raw style definition for keyframe marquee since custom animations are super tidy */}
      <style>{`
        @keyframes marquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-25%, 0, 0); }
        }
      `}</style>
    </div>
  );
}

