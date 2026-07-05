import { useState } from 'react';
import { Settings, CreditCard, RefreshCcw, Smartphone, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 0,
      title: 'Configure Card & Alloy',
      subtitle: 'Design your physical status asset',
      description: 'Choose your premium alloy casing—matte titanium black or solid 24k plated gold. Specify your exact identity engraving and set cryptographic locks instantly via the online customizer.',
      icon: Settings,
      detailLabel: 'CONFIG COMPLETED',
      metric: '98% user approval'
    },
    {
      id: 1,
      title: 'Define Spend Thresholds',
      subtitle: 'Absolute authority over transaction limits',
      description: 'Slide to configure daily spending boundaries between $1,000 and $25,000 USD. If you notice strange activities, freeze or unlock your cards instantly with a single toggle.',
      icon: CreditCard,
      detailLabel: 'LIVE AUTHORIZATION',
      metric: 'Zero-latency sync'
    },
    {
      id: 2,
      title: 'Swap Live Rates Instantly',
      subtitle: 'Real-time multi-currency clearing',
      description: 'Access deep liquidity pools. Convert dollars into Euro, Pound, Yen, or Rupee instantly using Dilocash clearings with direct mid-market pricing and zero bank margins.',
      icon: RefreshCcw,
      detailLabel: 'MID-MARKET CLEARING',
      metric: '0.15% flat margin'
    },
    {
      id: 3,
      title: 'Sync Your Hardware Wallet',
      subtitle: 'Download the secure app overlay',
      description: 'Download the Dilocash mobile client. Your virtual credit cards, burner credentials, and transaction graphs sync securely under hardware-level biometric locks.',
      icon: Smartphone,
      detailLabel: 'BIOMETRIC SECURED',
      metric: 'iOS & Android Ready'
    }
  ];

  const currentStepData = steps[activeStep];
  const StepIcon = currentStepData.icon;

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-charcoal-deep/50 border-t border-white/5 relative">
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-2xl text-center mx-auto mb-16">
          <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
            TIMELINE // INTEGRATION
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
            How It Works
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Setting up your Dilocash account is fully autonomous and secure. Get fully operational in 4 simple checkpoints.
          </p>
        </div>

        {/* Interactive Steps Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Timeline Navigation Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center gap-5 relative group ${
                    isActive
                      ? 'border-gold bg-gold/10 shadow-lg shadow-gold/5'
                      : 'border-white/5 bg-white/[0.01] hover:bg-white/[0.02] hover:border-white/10'
                  }`}
                >
                  {/* Step index counter */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold font-mono text-sm transition-all duration-300 ${
                    isActive
                      ? 'bg-gold text-black'
                      : 'bg-white/5 text-gray-400 group-hover:text-white'
                  }`}>
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className={`font-bold text-sm tracking-wide ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                      {step.title}
                    </h4>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">{step.subtitle}</p>
                  </div>

                  <ArrowRight
                    size={16}
                    className={`transform transition-all duration-300 ${
                      isActive ? 'text-gold opacity-100 translate-x-0' : 'text-gray-600 opacity-0 -translate-x-2'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Content Panel */}
          <div className="lg:col-span-7" id="how-it-works-display-pane">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.01] border border-white/5 relative overflow-hidden flex flex-col justify-between min-h-[380px] shadow-2xl shadow-black"
              >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-gold-premium/5 blur-3xl pointer-events-none" />

                <div className="space-y-6">
                  {/* Step status header */}
                  <div className="flex justify-between items-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/5 rounded-full text-[10px] font-mono text-gray-400 font-semibold">
                      <ShieldCheck size={12} className="text-gold" />
                      SECURE PROCESS STEP {activeStep + 1}/4
                    </div>
                    <span className="text-xs text-emerald-400 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> ACTIVE STATE
                    </span>
                  </div>

                  {/* Core description block */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-gold shadow-inner border border-gold/10">
                        <StepIcon size={24} />
                      </div>
                      <div>
                        <h4 className="text-white text-xl sm:text-2xl font-black">{currentStepData.title}</h4>
                        <p className="text-gold text-sm font-semibold font-mono">{currentStepData.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {currentStepData.description}
                    </p>
                  </div>
                </div>

                {/* Info footer metrics */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5 mt-8">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">INTEGRITY CHECK</span>
                    <span className="text-white font-bold text-xs sm:text-sm">{currentStepData.detailLabel}</span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">NETWORK METRIC</span>
                    <span className="text-gold font-bold text-xs sm:text-sm">{currentStepData.metric}</span>
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
