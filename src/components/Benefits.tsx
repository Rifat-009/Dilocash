import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  X, 
  ShieldAlert, 
  Sparkles, 
  TrendingUp, 
  Landmark, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Zap, 
  Info, 
  Lock,
  Search,
  Sliders,
  Terminal,
  Activity,
  Play,
  RefreshCw,
  Database,
  Building2,
  FileText,
  BadgeAlert,
  HelpCircle
} from 'lucide-react';

interface ComparisonItem {
  feature: string;
  category: 'financials' | 'security' | 'speed';
  dilocash: string;
  legacy: string;
  isPositive: boolean;
  research: {
    summary: string;
    statLabel: string;
    statValue: string;
    proof: string;
  };
}

interface FDICBank {
  name: string;
  certId: string;
  insuranceLimit: string;
  routingSpeed: string;
  regulatoryBody: string;
  status: 'ACTIVE' | 'AUDITED' | 'PEER_CONNECTED';
}

interface LogEntry {
  id: string;
  time: string;
  type: 'INFO' | 'SUCCESS' | 'BLOCKED' | 'WARNING';
  message: string;
}

export default function Benefits() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'financials' | 'security' | 'speed'>('all');
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  
  // Interactive Hub state
  const [activeWidget, setActiveWidget] = useState<'none' | 'yield' | 'fdic' | 'security'>('none');
  
  // Widget 1: Treasury Yields State
  const [capital, setCapital] = useState<number>(120000);
  const [yieldRate, setYieldRate] = useState<number>(5.42); // Real-time treasury yield
  const [isCalculated, setIsCalculated] = useState<boolean>(true);
  
  // Widget 2: FDIC Finder State
  const [searchBank, setSearchBank] = useState<string>('');
  const [selectedBankIndex, setSelectedBankIndex] = useState<number>(0);
  const [isVerifyingFDIC, setIsVerifyingFDIC] = useState<boolean>(false);
  const [verificationSuccess, setVerificationSuccess] = useState<boolean>(false);
  
  // Widget 3: Security Spec Terminal State
  const [securityLevel, setSecurityLevel] = useState<'balanced' | 'aggressive' | 'vault'>('balanced');
  const [mintedToken, setMintedToken] = useState<{ id: string; num: string; expires: string; active: boolean } | null>(null);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', time: '16:04:12', type: 'INFO', message: 'Dilocash Dynamic Firewall Initialized on Node-04 // SSL Enabled' },
    { id: '2', time: '16:04:30', type: 'INFO', message: 'Token synchronization with partner treasury banks complete.' },
    { id: '3', time: '16:05:01', type: 'SUCCESS', message: 'Encrypted biometric verification verified from client device ID_89281' }
  ]);
  const [terminalPulse, setTerminalPulse] = useState<boolean>(true);

  const widgetRef = useRef<HTMLDivElement>(null);

  // Dynamic values calculation
  const monthlyYield = (capital * (yieldRate / 100)) / 12;
  const annualYield = capital * (yieldRate / 100);
  const legacyAnnualYield = capital * 0.0015; // standard bank 0.15% APY
  const savingsGain = annualYield - legacyAnnualYield;

  const fdicBanks: FDICBank[] = [
    { name: 'Evolve Bank & Trust', certId: '12984', insuranceLimit: '$5,000,000 (Sweep Network)', routingSpeed: 'Immediate API ACH', regulatoryBody: 'Federal Reserve Bank (FRB)', status: 'ACTIVE' },
    { name: 'Cross River Bank', certId: '21055', insuranceLimit: '$2,500,000 (Standard Tier)', routingSpeed: 'FedNow / RTP Active', regulatoryBody: 'FDIC & State of New Jersey', status: 'ACTIVE' },
    { name: 'Lineage Bank', certId: '58774', insuranceLimit: '$10,000,000 (Enterprise Tier)', routingSpeed: 'Same-day Clearing ACH', regulatoryBody: 'FDIC Sovereign Clearing', status: 'AUDITED' },
    { name: 'Pathward, N.A.', certId: '31899', insuranceLimit: '$5,000,000 (Sweep Network)', routingSpeed: 'Realtime Card Settlement', regulatoryBody: 'Office of the Comptroller of the Currency (OCC)', status: 'ACTIVE' }
  ];

  const triggerWidget = (type: 'yield' | 'fdic' | 'security') => {
    if (activeWidget === type) {
      setActiveWidget('none');
    } else {
      setActiveWidget(type);
      setTimeout(() => {
        widgetRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const handleSimulateAttack = () => {
    const timeNow = new Date().toTimeString().split(' ')[0];
    const newLog: LogEntry = {
      id: Date.now().toString(),
      time: timeNow,
      type: 'BLOCKED',
      message: `SHIELD ALARM: Blocked rogue merchant subscription swipe from 'MaliciousSub_Holdings' for $79.99 [Token Lock Active]`
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleMintToken = () => {
    setIsMinting(true);
    setTimeout(() => {
      const timeNow = new Date().toTimeString().split(' ')[0];
      const randNum = `4532 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      setMintedToken({
        id: Math.floor(1000 + Math.random() * 9000).toString(),
        num: randNum,
        expires: '08/29',
        active: true
      });
      const newLog: LogEntry = {
        id: Date.now().toString(),
        time: timeNow,
        type: 'SUCCESS',
        message: `FIREWALL: Minted dynamic single-use token: ${randNum.slice(0, 9)}•••• •••• for checkout authorization.`
      };
      setLogs(prev => [newLog, ...prev]);
      setIsMinting(false);
    }, 1200);
  };

  const triggerVerification = () => {
    setIsVerifyingFDIC(true);
    setTimeout(() => {
      setIsVerifyingFDIC(false);
      setVerificationSuccess(true);
      setTimeout(() => setVerificationSuccess(false), 4000);
    }, 1500);
  };

  // Pulse terminal cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminalPulse(p => !p);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  const categories = [
    { id: 'all', label: 'ALL CRITERIA' },
    { id: 'financials', label: 'FINANCIAL GAINS' },
    { id: 'security', label: 'SECURITY SHIELD' },
    { id: 'speed', label: 'SPEED & ACCESS' }
  ] as const;

  const comparisonItems: ComparisonItem[] = [
    {
      feature: 'Instrument Alloy Material',
      category: 'speed',
      dilocash: 'Solid Titanium Black / 24K Plated Gold',
      legacy: 'Standard PVC Plastic',
      isPositive: true,
      research: {
        summary: 'Legacy credit cards utilize standard layered polyvinyl chloride (PVC) polymers, which degrade within 24 months and represent significant non-biodegradable footprint. Dilocash core alloys are manufactured in certified mint facilities using solid Grade 5 aerospace-grade titanium cores or genuine 24-karat gold electro-deposited plating layers.',
        statLabel: 'DURABILITY FACTOR',
        statValue: '12x Higher Resilience',
        proof: 'Passed accelerated continuous friction tests representing 10 years of intensive terminal insertions without contactless degradation.'
      }
    },
    {
      feature: 'Account Issuance Velocity',
      category: 'speed',
      dilocash: '2 Minutes Instant Digital Setup',
      legacy: '2-3 Weeks + In-branch Verification',
      isPositive: true,
      research: {
        summary: 'Traditional retail banking requires batch-processed manual credit review, offline KYC routing, and physical branch visits. Dilocash connects directly to real-time sovereign database APIs, enabling secure biometric identity verification and ledger provisioning within 120 seconds.',
        statLabel: 'PROVISIONING LATENCY',
        statValue: '99.8% Time Reduction',
        proof: 'Utilizes secure cryptographic handshakes with international verification registries to clear compliance rules in sub-second intervals.'
      }
    },
    {
      feature: 'Foreign Exchange (FX) Markup',
      category: 'financials',
      dilocash: '0.15% Flat Mid-Market Pricing',
      legacy: '3.00% - 5.00% Hidden Bank Spreads',
      isPositive: true,
      research: {
        summary: 'Traditional clearing institutions inject dynamic spreads (typically 3-5% above spot) under the guise of static rates. Dilocash uses smart liquidity routing to query interbank clearing houses in real-time, executing trades at the literal mid-market spot rate + a flat 0.15% clearance fee.',
        statLabel: 'AVG ANNUAL DEVIATION SAVINGS',
        statValue: 'Save $820+ / Year',
        proof: 'Audited against live Reuters feed index. Spreads remain flat and deterministic even during extreme overnight liquidity dry-ups.'
      }
    },
    {
      feature: 'Virtual Burner Accounts',
      category: 'security',
      dilocash: 'Unlimited Free Self-Destruct Credentials',
      legacy: 'Not Available / Strictly Prohibited',
      isPositive: true,
      research: {
        summary: 'Online card-not-present leaks account for over 74% of international transaction security breaches. Dilocash prevents this exposure by minting single-merchant ephemeral card tokens that automatically lock down or self-destruct after checking out.',
        statLabel: 'FRAUD EXPOSURE RATING',
        statValue: '99.9% Attack Abatement',
        proof: 'Tokens are tightly bound to a single merchant URI. If a vendor database is compromised, the stolen keys remain inert and useless.'
      }
    },
    {
      feature: 'Active Spend Threshold Controls',
      category: 'security',
      dilocash: 'Instant Real-time Slider Adjustment',
      legacy: 'Requires Phone Call / Fixed Limits',
      isPositive: true,
      research: {
        summary: 'Prevent runaway subscription fees and unauthorized merchant card swipes. Dilocash exposes direct-to-ledger adjustment sliders on the client app, letting you configure card-level daily clearing thresholds that update on our ledger with zero latency.',
        statLabel: 'LIMIT PROPAGATION',
        statValue: '<50ms Update Time',
        proof: 'Syncs dynamic values directly to card-issuer terminal authorization layers via ultra-fast Redis cache state databases.'
      }
    },
    {
      feature: 'Cryptographic Biometric Locks',
      category: 'security',
      dilocash: 'Localized Mobile App Biometrics',
      legacy: 'PIN Codes / Manual Phone Center Freeze',
      isPositive: true,
      research: {
        summary: 'Traditional pin structures are highly vulnerable to visual capturing or skimming arrays. Dilocash integrates deep asymmetric encryption tied directly to the smartphone secure hardware enclave, requiring dual-factor biometric passkeys for all settings.',
        statLabel: 'SECURITY INTEGRITY LEVEL',
        statValue: 'Military Grade',
        proof: 'No biometric credentials or private keys ever leave local secure enclaves. Transactions are signed using secure hardware keys.'
      }
    }
  ];

  const filteredItems = comparisonItems.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const toggleRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  return (
    <section id="benefits" className="py-20 md:py-28 bg-charcoal-deep border-t border-white/5 relative">
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-gold-premium/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl text-center mx-auto mb-12">
          <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
            COMPARISON // ADVANTAGES
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
            Why Modern Nomads Choose Dilocash
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Legacy credit cards charge hidden spreads and restrict digital independence. We build tools representing real freedom.
          </p>
        </div>

        {/* Dynamic Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveCategory(tab.id);
                setExpandedRow(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 border ${
                activeCategory === tab.id
                  ? 'bg-gold/15 text-gold border-gold/45 shadow-lg shadow-gold/5'
                  : 'bg-white/5 text-gray-400 border-transparent hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Feature Comparison Grid & Table */}
        <div className="w-full bg-white/[0.01] border border-white/5 rounded-3xl overflow-hidden shadow-2xl shadow-black relative mb-16">
          
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-12 border-b border-white/5 bg-white/[0.01] p-6 text-xs font-mono font-bold tracking-wider text-gray-500">
            <div className="col-span-6 uppercase">FINANCIAL METRIC // SECURITY FEATURE</div>
            <div className="col-span-3 text-gold uppercase flex items-center gap-1.5">
              <Sparkles size={12} className="fill-gold" /> Dilocash Core
            </div>
            <div className="col-span-3 uppercase flex items-center gap-1.5 text-gray-600">
              <Landmark size={12} /> Legacy Retail Banks
            </div>
          </div>

          {/* Comparison Rows */}
          <div className="divide-y divide-white/5 font-sans">
            {filteredItems.map((item, index) => {
              const isCurrentlyExpanded = expandedRow === index;
              return (
                <div
                  key={index}
                  className={`transition-colors duration-200 ${
                    isCurrentlyExpanded ? 'bg-white/[0.02]' : 'hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Row Trigger */}
                  <div
                    onClick={() => toggleRow(index)}
                    className="grid grid-cols-1 md:grid-cols-12 p-6 items-center cursor-pointer select-none"
                  >
                    {/* Feature Label */}
                    <div className="col-span-12 md:col-span-6 flex items-center justify-between md:justify-start gap-3 pr-4 mb-3 md:mb-0">
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-white tracking-tight">{item.feature}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          item.category === 'financials' ? 'bg-amber-500/10 text-amber-500' :
                          item.category === 'security' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-indigo-500/10 text-indigo-400'
                        }`}>
                          {item.category.toUpperCase()}
                        </span>
                      </div>
                      
                      {/* Interactive Expand indicators for mobile */}
                      <div className="flex items-center gap-1.5 text-gold text-xs font-mono md:hidden">
                        <span>RESEARCH</span>
                        {isCurrentlyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>

                    {/* Dilocash Status */}
                    <div className="col-span-6 md:col-span-3 flex items-start gap-2 pr-2 mb-2 md:mb-0">
                      <div className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-gold shrink-0 mt-0.5">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="text-gray-300 text-xs sm:text-sm font-semibold leading-snug">{item.dilocash}</span>
                    </div>

                    {/* Legacy Status */}
                    <div className="col-span-6 md:col-span-3 flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
                        <X size={12} strokeWidth={3} />
                      </div>
                      <span className="text-gray-500 text-xs sm:text-sm leading-snug">{item.legacy}</span>
                    </div>

                    {/* Desktop Research Icon */}
                    <div className="hidden md:flex absolute right-6 items-center gap-1.5 text-gray-500 hover:text-gold transition-colors text-xs font-mono">
                      <span>RESEARCH</span>
                      {isCurrentlyExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>

                  {/* Deep Research Accordion Panel */}
                  <AnimatePresence initial={false}>
                    {isCurrentlyExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="overflow-hidden bg-black/30 border-t border-white/5"
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                          {/* Detailed text */}
                          <div className="lg:col-span-8 space-y-4">
                            <div className="flex items-center gap-2">
                              <Info size={14} className="text-gold" />
                              <span className="text-[10px] text-gold font-mono font-bold tracking-wider">ACADEMIC // CLEARANCE DOCUMENTATION</span>
                            </div>
                            
                            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-normal">
                              {item.research.summary}
                            </p>
                            
                            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 font-mono leading-relaxed">
                              <strong className="text-white">Validation Proof: </strong>
                              {item.research.proof}
                            </div>
                          </div>

                          {/* Graphical statistical metrics */}
                          <div className="lg:col-span-4 flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5">
                            <div>
                              <span className="text-[9px] text-gray-500 font-mono font-semibold tracking-wider block uppercase">
                                {item.research.statLabel}
                              </span>
                              <span className="text-xl sm:text-2xl font-extrabold text-gold font-mono block mt-1">
                                {item.research.statValue}
                              </span>
                            </div>

                            {/* visual progress comparative indicator */}
                            <div className="mt-4">
                              <div className="flex justify-between text-[9px] font-mono text-gray-500 mb-1">
                                <span>SYSTEM GAIN RATE</span>
                                <span className="text-gold">OUTPERFORMS LEGACY</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: item.category === 'financials' ? '85%' : item.category === 'security' ? '98%' : '75%' }}
                                  transition={{ duration: 0.6, delay: 0.1 }}
                                  className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light rounded-full" 
                                />
                              </div>
                            </div>

                            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-400">
                              <ShieldCheck size={12} />
                              <span>Sovereign Clearing Verified</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>

        {/* Section divider label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-[1px] flex-grow bg-white/10"></div>
          <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
            INTERACTIVE CAPABILITY CENTER
          </span>
          <div className="h-[1px] flex-grow bg-white/10"></div>
        </div>

        {/* Supporting Benefits cards (Now deeply interactive) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Explore Treasury Yields */}
          <div 
            onClick={() => triggerWidget('yield')}
            className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 border ${
              activeWidget === 'yield'
                ? 'bg-gradient-to-b from-gold/15 to-transparent border-gold/40 shadow-xl shadow-gold/5'
                : 'bg-white/[0.01] hover:bg-white/[0.02] border-white/5 hover:border-gold/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeWidget === 'yield' ? 'bg-gold text-charcoal-deep font-extrabold' : 'bg-gold/10 text-gold'
                }`}>
                  <TrendingUp size={18} />
                </div>
                {activeWidget === 'yield' && (
                  <span className="text-[9px] bg-gold/10 text-gold font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                    OPEN NOW
                  </span>
                )}
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight">Real-time Yield Acceleration</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-normal">
                Dilocash sweeps excess cash balances directly into institutional treasury assets, securing high yield without manual actions.
              </p>
            </div>
            <span className="text-[10px] text-gold font-mono font-semibold tracking-wider flex items-center gap-1.5">
              <span>EXPLORE TREASURY YIELDS</span>
              {activeWidget === 'yield' ? <ChevronUp size={12} /> : <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />}
            </span>
          </div>

          {/* Card 2: Read FDIC Charter */}
          <div 
            onClick={() => triggerWidget('fdic')}
            className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 border ${
              activeWidget === 'fdic'
                ? 'bg-gradient-to-b from-emerald-500/15 to-transparent border-emerald-500/40 shadow-xl shadow-emerald-500/5'
                : 'bg-white/[0.01] hover:bg-white/[0.02] border-white/5 hover:border-emerald-500/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeWidget === 'fdic' ? 'bg-emerald-400 text-charcoal-deep font-extrabold' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  <ShieldCheck size={18} />
                </div>
                {activeWidget === 'fdic' && (
                  <span className="text-[9px] bg-emerald-450/10 text-emerald-400 font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                    ACTIVE ROUTE
                  </span>
                )}
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight">Global Regulatory Security</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-normal">
                Your assets are managed through legally registered partner bank clearing systems, maintaining fully transparent FDIC structures.
              </p>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold tracking-wider flex items-center gap-1.5">
              <span>READ FDIC CHARTER</span>
              {activeWidget === 'fdic' ? <ChevronUp size={12} /> : <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />}
            </span>
          </div>

          {/* Card 3: Audit Security Specs */}
          <div 
            onClick={() => triggerWidget('security')}
            className={`group p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between space-y-4 border ${
              activeWidget === 'security'
                ? 'bg-gradient-to-b from-amber-500/15 to-transparent border-amber-500/40 shadow-xl shadow-amber-500/5'
                : 'bg-white/[0.01] hover:bg-white/[0.02] border-white/5 hover:border-amber-500/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  activeWidget === 'security' ? 'bg-amber-500 text-charcoal-deep font-extrabold' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  <Lock size={18} />
                </div>
                {activeWidget === 'security' && (
                  <span className="text-[9px] bg-amber-500/10 text-amber-500 font-mono font-bold px-2 py-0.5 rounded-full animate-pulse">
                    MONITOR ON
                  </span>
                )}
              </div>
              <h4 className="text-white font-bold text-sm tracking-tight">Proactive Risk Prevention</h4>
              <p className="text-gray-500 text-xs leading-relaxed font-normal">
                If an unknown merchant tries to trigger a recurring charge, our smart system identifies and auto-locks virtual cards.
              </p>
            </div>
            <span className="text-[10px] text-amber-500 font-mono font-semibold tracking-wider flex items-center gap-1.5">
              <span>AUDIT SECURITY SPECS</span>
              {activeWidget === 'security' ? <ChevronUp size={12} /> : <ChevronDown size={12} className="group-hover:translate-y-0.5 transition-transform" />}
            </span>
          </div>

        </div>

        {/* Dynamic Expandable Interface Section */}
        <div ref={widgetRef} className="mt-8">
          <AnimatePresence mode="wait">
            
            {/* 1. Treasury Yield Simulator Workspace */}
            {activeWidget === 'yield' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full bg-white/[0.01] border border-gold/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-gold/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
                  {/* Controls / Inputs */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <span className="text-[10px] text-gold font-mono font-extrabold tracking-widest block uppercase mb-1">
                        TREASURY SIMULATOR // REAL-TIME
                      </span>
                      <h4 className="text-white text-xl md:text-2xl font-black tracking-tight">
                        Calculate Capital Acceleration
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm mt-1">
                        Adjust your sweeping threshold to see potential institutional yield rewards compared directly to legacy banks.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Interactive Slider */}
                      <div>
                        <div className="flex justify-between text-xs font-mono mb-2">
                          <span className="text-gray-500">YOUR CASH THRESHOLD</span>
                          <span className="text-gold font-bold">${capital.toLocaleString()} USD</span>
                        </div>
                        <input
                          type="range"
                          min="10000"
                          max="1500000"
                          step="5000"
                          value={capital}
                          onChange={(e) => setCapital(Number(e.target.value))}
                          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                        />
                        <div className="flex justify-between text-[9px] font-mono text-gray-500 mt-1">
                          <span>$10,000 Minimum</span>
                          <span>$1,500,000 Maximum</span>
                        </div>
                      </div>

                      {/* Yield rate selector */}
                      <div>
                        <span className="text-xs text-gray-500 font-mono block mb-2">TREASURY BILL TERM RATE</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { label: '4-Week T-Bill', rate: 5.31 },
                            { label: '13-Week T-Bill', rate: 5.42 },
                            { label: '26-Week T-Bill', rate: 5.54 }
                          ].map((term) => (
                            <button
                              key={term.label}
                              onClick={() => setYieldRate(term.rate)}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                yieldRate === term.rate
                                  ? 'bg-gold/10 border-gold/40 text-white'
                                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-[9px] font-mono block text-gray-500">{term.label}</span>
                              <span className="text-sm font-extrabold block text-gold mt-1 font-mono">{term.rate}% APY</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations breakdown output */}
                  <div className="lg:w-96 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5">
                    <div className="space-y-4">
                      <span className="text-[9px] text-gray-500 font-mono font-bold tracking-wider block uppercase">
                        PROJECTED INTEREST GAIN BREAKDOWN
                      </span>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs text-gray-400">EST. DAILY INTEREST</span>
                          <span className="text-sm text-white font-mono font-semibold">+${(monthlyYield / 30.4).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs text-gray-400">EST. MONTHLY DEPOSIT</span>
                          <span className="text-sm text-white font-mono font-semibold">+${monthlyYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-white/5">
                          <span className="text-xs text-gray-400">EST. ANNUAL RETURN</span>
                          <span className="text-sm text-gold font-mono font-bold">+${annualYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-xs text-red-500/80">LEGACY BANK APY (0.15%)</span>
                          <span className="text-sm text-gray-500 font-mono font-semibold">+${legacyAnnualYield.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-white/10">
                      <div className="p-3 bg-gold/10 rounded-xl border border-gold/30 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] text-gold font-mono font-bold block">NET EXTRA EARNED</span>
                          <span className="text-base font-extrabold text-white font-mono">
                            +${savingsGain.toLocaleString(undefined, { maximumFractionDigits: 0 })}/yr
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-gray-400 block">DILOCASH ADVANTAGE</span>
                          <span className="text-xs font-mono font-black text-gold">36x HIGHER</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. FDIC Regulatory Finder Hub */}
            {activeWidget === 'fdic' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full bg-white/[0.01] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
                  {/* Left Controls */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-mono font-extrabold tracking-widest block uppercase mb-1">
                        FDIC CLEARING AGENT SEARCH // SOVEREIGN
                      </span>
                      <h4 className="text-white text-xl md:text-2xl font-black tracking-tight">
                        Partner Bank Insurance Certifications
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm mt-1">
                        Dilocash is a financial technology platform, not a bank. We route user deposit ledgers to FDIC-insured partner clearing houses using high-speed APIs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Search box or selection list */}
                      <div>
                        <span className="text-xs text-gray-500 font-mono block mb-2">SELECT FDIC-REGISTERED PARTNER TRUST</span>
                        <div className="space-y-2">
                          {fdicBanks.map((bank, index) => (
                            <div
                              key={bank.name}
                              onClick={() => setSelectedBankIndex(index)}
                              className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                selectedBankIndex === index
                                  ? 'bg-emerald-500/10 border-emerald-500/45 text-white'
                                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <Building2 size={16} className={selectedBankIndex === index ? "text-emerald-400" : "text-gray-500"} />
                                <div>
                                  <span className="text-xs font-bold block">{bank.name}</span>
                                  <span className="text-[10px] text-gray-500 font-mono">Cert ID: {bank.certId}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-black/40 text-emerald-400 border border-emerald-500/20">
                                  {bank.status}
                                </span>
                                <ChevronDown size={14} className={selectedBankIndex === index ? "rotate-180 transition-transform" : "transition-transform"} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Details Verification Panel */}
                  <div className="lg:w-96 flex flex-col justify-between p-6 rounded-2xl bg-black/40 border border-white/5 relative">
                    <div className="space-y-5">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] text-gray-500 font-mono font-bold tracking-wider block uppercase">
                            GOVERNMENT CERTIFICATION DEEPLINK
                          </span>
                          <span className="text-base font-extrabold text-white block mt-1">
                            {fdicBanks[selectedBankIndex].name}
                          </span>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
                          FDIC Active
                        </div>
                      </div>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-gray-500">REGULATOR:</span>
                          <span className="text-gray-300 text-right text-[11px] font-semibold">{fdicBanks[selectedBankIndex].regulatoryBody}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-gray-500">MAX SECURED INS:</span>
                          <span className="text-emerald-400 font-bold">{fdicBanks[selectedBankIndex].insuranceLimit}</span>
                        </div>
                        <div className="flex justify-between py-1.5 border-b border-white/5">
                          <span className="text-gray-500">SETTLEMENT ENGINE:</span>
                          <span className="text-gray-300 font-bold">{fdicBanks[selectedBankIndex].routingSpeed}</span>
                        </div>
                        <div className="flex justify-between py-1.5">
                          <span className="text-gray-500">CERTIFICATE CODE:</span>
                          <span className="text-gray-300 font-bold">{fdicBanks[selectedBankIndex].certId}-US</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
                      <button
                        onClick={triggerVerification}
                        disabled={isVerifyingFDIC}
                        className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs font-mono tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {isVerifyingFDIC ? (
                          <>
                            <RefreshCw size={14} className="animate-spin" />
                            <span>QUERYING FDIC LEDGER...</span>
                          </>
                        ) : (
                          <>
                            <Database size={14} />
                            <span>VERIFY FDIC SOVEREIGN SECURE</span>
                          </>
                        )}
                      </button>

                      <AnimatePresence>
                        {verificationSuccess && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono leading-relaxed"
                          >
                            ✓ API Query handshake passed successfully. Deposit swept account limits are fully registered under Certificate ID {fdicBanks[selectedBankIndex].certId} with absolute multi-bank pass-through structure.
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. Proactive Risk Prevention Security Spec */}
            {activeWidget === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full bg-white/[0.01] border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/5 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex flex-col lg:flex-row gap-8 items-stretch relative z-10">
                  {/* Left Controls */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <span className="text-[10px] text-amber-500 font-mono font-extrabold tracking-widest block uppercase mb-1">
                        FIREWALL & BURNER AUDIT // CONSOLE
                      </span>
                      <h4 className="text-white text-xl md:text-2xl font-black tracking-tight">
                        Risk & Ephemeral Token Dashboard
                      </h4>
                      <p className="text-gray-400 text-xs md:text-sm mt-1">
                        Configure dynamic security defenses on demand. Mint burner credentials instantly or launch immediate simulated rogue transaction attempts.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {/* Security sliders or configs */}
                      <div>
                        <span className="text-xs text-gray-500 font-mono block mb-2">SHIELD SENSITIVITY LEVEL</span>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'balanced', label: 'BALANCED DEFENSE', desc: 'Blocks high-risk scopes' },
                            { id: 'aggressive', label: 'AGGRESSIVE SHIELD', desc: 'No recursive subscription' },
                            { id: 'vault', label: 'LOCKED VAULT', desc: 'Manual confirm every sweep' }
                          ].map((cfg) => (
                            <button
                              key={cfg.id}
                              onClick={() => {
                                setSecurityLevel(cfg.id as any);
                                const timeNow = new Date().toTimeString().split(' ')[0];
                                const logMsg = `SYSTEM: Configured threat defense model to [${cfg.label}] - propagation lag <10ms`;
                                setLogs(prev => [{ id: Date.now().toString(), time: timeNow, type: 'INFO', message: logMsg }, ...prev]);
                              }}
                              className={`p-3 rounded-xl border text-left transition-all ${
                                securityLevel === cfg.id
                                  ? 'bg-amber-500/10 border-amber-500/40 text-white'
                                  : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                              }`}
                            >
                              <span className="text-[10px] font-bold block text-amber-500">{cfg.label}</span>
                              <span className="text-[9px] block text-gray-500 mt-0.5 leading-snug">{cfg.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Token Generator Action Card */}
                      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Lock size={14} className="text-amber-500" />
                            <span className="text-xs font-bold text-white">Interactive Virtual Burner Card Generator</span>
                          </div>
                          <span className="text-[9px] font-mono text-gray-500">MERC-SPECIFIC</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={handleMintToken}
                            disabled={isMinting}
                            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs font-mono tracking-wider transition-colors disabled:opacity-50 shrink-0"
                          >
                            {isMinting ? 'MINTING TOKEN...' : 'MINT EPHEMERAL TOKEN'}
                          </button>

                          {/* Render Token */}
                          <AnimatePresence>
                            {mintedToken && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex-1 p-3 bg-black/60 rounded-xl border border-amber-500/20 flex items-center justify-between"
                              >
                                <div>
                                  <span className="text-[9px] font-mono text-gray-500 block">DILOCASH BURNER</span>
                                  <span className="text-xs font-mono text-white font-bold tracking-widest">{mintedToken.num}</span>
                                </div>
                                <div className="text-right">
                                  <span className="text-[8px] font-mono text-gray-500 block">EXPIRES</span>
                                  <span className="text-[10px] font-mono text-amber-500 font-bold">{mintedToken.expires}</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Realtime System Log Console */}
                  <div className="lg:w-96 flex flex-col justify-between p-6 rounded-2xl bg-black/50 border border-white/5">
                    <div className="space-y-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-gray-500 font-mono font-bold tracking-wider uppercase flex items-center gap-1.5">
                          <Terminal size={12} className="text-amber-500" /> LIVE FIREWALL TRAFFIC LOG
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          <span className="text-[8px] text-emerald-400 font-mono">MONITOR ACTIVE</span>
                        </div>
                      </div>

                      {/* Log Rows container */}
                      <div className="flex-grow h-44 overflow-y-auto font-mono text-[10px] space-y-2 pr-1">
                        {logs.map((log) => (
                          <div key={log.id} className="leading-relaxed border-b border-white/[0.02] pb-1.5">
                            <span className="text-gray-600">[{log.time}]</span>{' '}
                            <span className={`font-bold ${
                              log.type === 'BLOCKED' ? 'text-red-400' :
                              log.type === 'SUCCESS' ? 'text-emerald-400' :
                              log.type === 'WARNING' ? 'text-amber-500' :
                              'text-blue-400'
                            }`}>
                              [{log.type}]
                            </span>{' '}
                            <span className="text-gray-300">{log.message}</span>
                          </div>
                        ))}
                        <div className="text-gray-600 flex items-center gap-1">
                          <span>$ dilocash-firewall --listen</span>
                          <span className={`w-1.5 h-3 bg-white/70 inline-block ${terminalPulse ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10">
                      <button
                        onClick={handleSimulateAttack}
                        className="w-full py-3 rounded-xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 hover:border-red-500/50 text-red-400 font-black text-xs font-mono tracking-wider transition-all flex items-center justify-center gap-1.5"
                      >
                        <BadgeAlert size={14} />
                        <span>SIMULATE ROGUE ACQUISITION ATTEMPT</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
