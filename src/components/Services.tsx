import { useState } from 'react';
import { CreditCard, Shield, Globe, Landmark, ToggleLeft, ArrowRight, Smartphone, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export default function Services() {
  const [activeTab, setActiveTab] = useState<'all' | 'physical' | 'virtual' | 'security'>('all');

  const services = [
    {
      id: 'alloy-card',
      category: 'physical',
      title: 'Solid Multi-Alloy Metallic Cards',
      description: 'Forged from custom matte titanium or solid 24k plated gold, delivering instant sensory feedback with heavy-duty structural integrity.',
      icon: CreditCard,
      highlight: '18g solid metal weight',
      badge: 'PREMIUM ALLOY'
    },
    {
      id: 'burner-api',
      category: 'virtual',
      title: 'Single-Use Virtual Burners',
      description: 'Generate temporary credentials instantly for risky online checkouts. The tokenized numbers self-destruct 1 second after authorization.',
      icon: ToggleLeft,
      highlight: 'Unlimited free burns',
      badge: 'SECURITY SHELL'
    },
    {
      id: 'fx-clearing',
      category: 'virtual',
      title: 'Decentralized FX Settlement',
      description: 'Bypass hefty commercial banks with Dilocash mid-market clearings. Instantly route transactions through major global liquidity pools.',
      icon: Globe,
      highlight: '0.15% tier margins',
      badge: 'FX CLEARING'
    },
    {
      id: 'biometric-vault',
      category: 'security',
      title: 'Cold Cryptographic Vaults',
      description: 'Lock away emergency cash or reserves with localized biometric authentication. Access is guarded by enterprise end-to-end multi-sig keys.',
      icon: Shield,
      highlight: 'Hardware-level encryption',
      badge: 'MILITARY SHIELD'
    },
    {
      id: 'treasury-acc',
      category: 'physical',
      title: 'Institutional Tier Accounts',
      description: 'Access yield-bearing cash balances with instant fractional liquidity. Backed by fully insured treasury operations up to $2.5M.',
      icon: Landmark,
      highlight: 'Up to 5.24% variable APY',
      badge: 'TREASURY TRUST'
    },
    {
      id: 'mobile-app',
      category: 'virtual',
      title: 'Unified Wallet App Integration',
      description: 'Manage physical alloys, virtual burners, real-time limits, and live push receipts natively from a beautiful responsive client application.',
      icon: Smartphone,
      highlight: 'iOS & Android native',
      badge: 'MOBILE FIRST'
    }
  ];

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(s => s.category === activeTab);

  return (
    <section id="service" className="py-20 md:py-28 relative border-t border-white/5 bg-charcoal-deep/30">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-gold-premium/5 blur-[120px] rounded-full pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
          <div className="max-w-xl">
            <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
              MODULES // FEATURES
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
              Fast And Simple Digital Payment Solution
            </h3>
            <p className="text-gray-400 text-sm sm:text-base mt-3">
              We design physical status instruments and virtual security shields in a single, high-fidelity platform.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-white/[0.02] border border-white/5 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All Services' },
              { id: 'physical', label: 'Physical Alloys' },
              { id: 'virtual', label: 'Digital Wallets' },
              { id: 'security', label: 'Cold Security' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold text-black shadow-lg shadow-gold/15'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                id={`service-card-${service.id}`}
                className="group p-8 rounded-3xl bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-gold/20 shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[300px] relative overflow-hidden"
              >
                {/* Micro hover ambient light */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gold-premium/5 rounded-full blur-2xl group-hover:bg-gold-premium/15 transition-all duration-500" />
                
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white group-hover:bg-gold group-hover:text-black transition-all duration-500 shadow-inner">
                      <IconComponent size={20} />
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-white font-extrabold text-lg group-hover:text-gold transition-colors duration-200">
                      {service.title}
                    </h4>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 mt-6 flex justify-between items-center relative z-10 font-mono text-xs">
                  <span className="text-gray-500">HIGHLIGHT //</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Sparkles size={12} className="text-gold" />
                    {service.highlight}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Micro Dashboard Link */}
        <div className="mt-12 bg-white/[0.01] border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Shield size={24} />
            </div>
            <div>
              <h5 className="text-white font-bold text-base">Over $4.2B USD cleared with zero incidents</h5>
              <p className="text-gray-500 text-xs mt-0.5">Dilocash uses smart contracts to guarantee multi-signature clearance.</p>
            </div>
          </div>
          <a
            href="#pricing"
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center gap-2 border border-white/10 transition-all duration-300"
          >
            Compare Tiers <ArrowRight size={14} />
          </a>
        </div>

      </div>
    </section>
  );
}
