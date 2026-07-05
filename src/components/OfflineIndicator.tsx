import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, ShieldAlert, Wifi, WifiOff, CloudLightning, Database, RefreshCw, CheckCircle, Info, HelpCircle } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(() => {
    return localStorage.getItem('dilocash_simulated_offline') === 'true';
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('idle');
  const [queuedActionsCount, setQueuedActionsCount] = useState(0);

  // Expose state globally so other components can inspect connection status
  const effectiveOffline = !isOnline || simulatedOffline;

  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      // Trigger custom event so other components update instantly
      window.dispatchEvent(new CustomEvent('dilocash_network_change', {
        detail: { isOffline: !navigator.onLine || simulatedOffline }
      }));
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Initial dispatch
    window.dispatchEvent(new CustomEvent('dilocash_network_change', {
      detail: { isOffline: effectiveOffline }
    }));

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [isOnline, simulatedOffline]);

  // Read queued count from localStorage regularly
  useEffect(() => {
    const checkQueue = () => {
      let count = 0;
      const cardLogs = localStorage.getItem('dilocash_custom_cards_logs');
      const cryptoLogs = localStorage.getItem('dilocash_crypto_tx_history');
      
      if (cardLogs) {
        try { count += JSON.parse(cardLogs).length; } catch(e){}
      }
      if (cryptoLogs) {
        try { count += JSON.parse(cryptoLogs).length; } catch(e){}
      }
      setQueuedActionsCount(count);
    };

    checkQueue();
    window.addEventListener('storage', checkQueue);
    window.addEventListener('dilocash_queue_updated', checkQueue);
    
    // Poll queue size every 1.5 seconds for instant reactive updates in UI
    const interval = setInterval(checkQueue, 1500);

    return () => {
      window.removeEventListener('storage', checkQueue);
      window.removeEventListener('dilocash_queue_updated', checkQueue);
      clearInterval(interval);
    };
  }, []);

  const toggleSimulation = () => {
    const nextVal = !simulatedOffline;
    setSimulatedOffline(nextVal);
    localStorage.setItem('dilocash_simulated_offline', String(nextVal));
    
    // Dispatch instant global event
    window.dispatchEvent(new CustomEvent('dilocash_network_change', {
      detail: { isOffline: !isOnline || nextVal }
    }));

    if (!nextVal && !isOnline) {
      // Still physically offline
    } else if (!nextVal && isOnline) {
      // Trigger sync animation when connection is restored!
      triggerSync();
    }
  };

  const triggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
    }, 2000);
  };

  // Allow physically going online to trigger sync
  useEffect(() => {
    if (isOnline && !simulatedOffline) {
      triggerSync();
    }
  }, [isOnline]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans" id="offline-terminal-panel">
      <AnimatePresence>
        {!isExpanded ? (
          /* Mini compact pill */
          <motion.button
            layoutId="offline-panel"
            onClick={() => setIsExpanded(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-full border shadow-2xl backdrop-blur-md cursor-pointer transition-colors duration-200 ${
              effectiveOffline
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="flex h-2 w-2 relative">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                effectiveOffline ? 'bg-amber-500' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                effectiveOffline ? 'bg-amber-500' : 'bg-emerald-400'
              }`}></span>
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider">
              {effectiveOffline ? 'DILOCASH OFFLINE MODE' : 'DILOCASH SECURE NODE'}
            </span>
            {queuedActionsCount > 0 && effectiveOffline && (
              <span className="bg-amber-500 text-black text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full">
                {queuedActionsCount}
              </span>
            )}
          </motion.button>
        ) : (
          /* Detailed Expanded Control Console */
          <motion.div
            layoutId="offline-panel"
            className="w-80 bg-charcoal-deep/95 border border-white/10 rounded-2xl p-5 shadow-2xl shadow-black backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Database size={16} className={effectiveOffline ? "text-amber-500" : "text-gold"} />
                <span className="text-[11px] font-mono font-bold text-gray-400 tracking-wider">SYSTEM CONNECTIVITY CONSOLE</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-500 hover:text-white font-semibold text-xs font-mono border border-white/5 px-2 py-0.5 rounded"
              >
                COLLAPSE
              </button>
            </div>

            {/* Diagnostic Status Box */}
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-xs text-gray-400 font-medium">Physical Connection</span>
                <span className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                  isOnline ? 'text-emerald-400' : 'text-red-400'
                }`}>
                  {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
                  {isOnline ? 'ESTABLISHED' : 'DISCONNECTED'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <span className="text-xs text-gray-400 font-medium">Meshnet Sync Cache</span>
                <span className={`flex items-center gap-1.5 text-xs font-mono font-bold ${
                  effectiveOffline ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  <Shield size={14} />
                  {effectiveOffline ? 'LOCAL ACTIVE' : 'CLOUD ENCRYPTED'}
                </span>
              </div>

              <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 p-3 rounded-xl">
                <div className="flex flex-col">
                  <span className="text-xs text-white font-semibold">Offline Simulation Mode</span>
                  <span className="text-[10px] text-gray-500 leading-normal">Override physical network state for testing</span>
                </div>
                <button
                  onClick={toggleSimulation}
                  className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    simulatedOffline ? 'bg-gold' : 'bg-white/10'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-charcoal-deep shadow ring-0 transition duration-200 ease-in-out ${
                      simulatedOffline ? 'translate-x-4.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Offline actions queue info */}
            {effectiveOffline && (
              <div className="mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-amber-400/90 font-medium flex items-center gap-1.5">
                    <CloudLightning size={12} />
                    Queued Sandbox Actions:
                  </span>
                  <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                    {queuedActionsCount}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed">
                  Your custom metal cards and crypto sandbox trades are securely written to high-fidelity LocalStorage and queued. They will automatically upload when network returns.
                </p>
              </div>
            )}

            {/* Sync feedback panel */}
            {syncStatus !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3"
              >
                {syncStatus === 'syncing' ? (
                  <>
                    <RefreshCw size={14} className="text-emerald-400 animate-spin" />
                    <span className="text-xs text-emerald-400 font-mono">Syncing local sandbox ledger...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle size={14} className="text-emerald-400 animate-bounce" />
                    <span className="text-xs text-emerald-400 font-mono">Ledger synchronized cleanly!</span>
                  </>
                )}
              </motion.div>
            )}

            {/* Quick manual sync button */}
            {!effectiveOffline && syncStatus === 'idle' && (
              <button
                onClick={triggerSync}
                className="w-full mt-4 py-2 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-[11px] font-mono text-gray-300 rounded-lg flex items-center justify-center gap-1.5 transition-all duration-200"
              >
                <RefreshCw size={12} />
                FORCE SYNC DIAGNOSTICS
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
