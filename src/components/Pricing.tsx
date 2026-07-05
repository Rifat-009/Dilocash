import React, { useState } from 'react';
import { Check, ShieldCheck, Sparkles, Zap, CreditCard, ChevronRight, X, Cpu, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PricingPlan } from '../types';

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'processing' | 'success'>('form');

  const plans: PricingPlan[] = [
    {
      id: 'silver',
      name: 'Silver Card Edition',
      price: 0,
      period: 'month',
      description: 'Ideal for getting started with basic virtual payments.',
      features: [
        'Standard PVC composite card',
        'Max daily limit: $2,500 USD',
        'Standard 1.5% currency margins',
        '1 active virtual burner card',
        'Standard mobile app support'
      ],
      isPopular: false,
      cardTheme: 'burner'
    },
    {
      id: 'gold',
      name: 'Gold Luxury Edition',
      price: billingPeriod === 'month' ? 19 : 15,
      period: billingPeriod,
      description: 'Our most popular tier. Plated solid metal with priority clearings.',
      features: [
        'Heavy-duty physical plated gold card',
        'Max daily limit: $15,000 USD',
        'Premium 0.15% FX clearing margins',
        'Unlimited virtual burner cards',
        'Priority 24/7 localized support',
        'Institutional yield-bearing vault access'
      ],
      isPopular: true,
      cardTheme: 'gold'
    },
    {
      id: 'black',
      name: 'Black Elite Edition',
      price: billingPeriod === 'month' ? 49 : 39,
      period: billingPeriod,
      description: 'Ultimate matte titanium privilege for founders and high-net-worth users.',
      features: [
        'Matte titanium black laser engraved card',
        'Uncapped custom daily spend limits',
        '0.0% currency clearing margin tiers',
        'Unlimited virtual burner cards',
        'Dedicated personal wealth concierge',
        'Multi-signature localized biometric vaults',
        'Complimentary VIP airport lounge access'
      ],
      isPopular: false,
      cardTheme: 'black'
    }
  ];

  const handleOpenCheckout = (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setCheckoutStep('form');
    setCheckoutName('');
  };

  const handleCloseCheckout = () => {
    setSelectedPlan(null);
  };

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName.trim()) return;
    setCheckoutStep('processing');
    
    // Simulate premium bank-grade minting speed
    setTimeout(() => {
      setCheckoutStep('success');
    }, 2800);
  };

  return (
    <section id="pricing" className="py-20 md:py-28 bg-charcoal-deep/30 border-t border-white/5 relative">
      <div className="absolute bottom-1/4 right-1/2 translate-x-1/2 w-[500px] h-[500px] bg-gold-premium/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl text-center mx-auto mb-16">
          <span className="text-xs font-semibold text-gold tracking-wider font-mono uppercase">
            MEMBERSHIP // PACKAGES
          </span>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2 leading-tight">
            Transparent Pricing, Premium Prestige
          </h3>
          <p className="text-gray-400 text-sm sm:text-base mt-3">
            Choose the membership tier that maps to your global liquidity demands. No hidden contract loops.
          </p>

          {/* Billing Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-xs font-mono font-semibold ${billingPeriod === 'month' ? 'text-white' : 'text-gray-500'}`}>
              MONTHLY BILLING
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
              className="w-14 h-7 rounded-full bg-white/5 border border-white/10 p-1 flex items-center relative transition-colors duration-300 hover:border-gold/30"
              aria-label="Toggle billing cycle"
              id="billing-cycle-toggle"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gold transition-transform duration-300 ${
                  billingPeriod === 'year' ? 'translate-x-7' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-xs font-mono font-semibold flex items-center gap-1.5 ${billingPeriod === 'year' ? 'text-gold' : 'text-gray-500'}`}>
              YEARLY BILLING
              <span className="bg-gold/10 text-gold border border-gold/20 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => {
            const isGold = plan.id === 'gold';
            const isBlack = plan.id === 'black';

            return (
              <div
                key={plan.id}
                id={`pricing-card-${plan.id}`}
                className={`flex flex-col justify-between p-8 rounded-3xl relative transition-all duration-300 ${
                  isGold
                    ? 'bg-gradient-to-b from-gold/10 to-transparent border border-gold/40 shadow-2xl shadow-gold/5 lg:-translate-y-2 z-10 overflow-visible'
                    : 'bg-white/[0.01] border border-white/5 hover:border-white/15 overflow-hidden'
                }`}
              >
                {/* Visual Glow Header elements for popular choice */}
                {isGold && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-gold-dark to-gold px-4 py-1 rounded-full text-[9px] font-mono font-black text-black tracking-widest uppercase shadow-md shadow-gold/25 flex items-center gap-1">
                    <Sparkles size={10} className="fill-black" /> MOST RECOMMENDED
                  </div>
                )}

                <div>
                  {/* Tier Name */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-extrabold text-lg">{plan.name}</h4>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-[200px]">
                        {plan.description}
                      </p>
                    </div>
                    {/* Tiny micro card mock decoration */}
                    <div className={`w-8 h-5 rounded border ${
                      isGold 
                        ? 'bg-gradient-to-br from-amber-400 to-amber-700 border-amber-300' 
                        : isBlack 
                          ? 'bg-zinc-900 border-zinc-700' 
                          : 'bg-zinc-100 border-zinc-300'
                    }`} />
                  </div>

                  {/* Price */}
                  <div className="my-8 flex items-baseline gap-1">
                    <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      USD / {plan.period === 'year' ? 'YR (BILLED ANNUALLY)' : 'MO'}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-4 pt-6 border-t border-white/5">
                    {plan.features.map((feat, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isGold ? 'bg-gold/10 text-gold' : 'bg-white/5 text-gray-400'
                        }`}>
                          <Check size={12} strokeWidth={2.5} />
                        </div>
                        <span className="text-xs sm:text-sm text-gray-300">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Select Plan Button */}
                <div className="mt-8 pt-6 border-t border-white/5">
                  <button
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full py-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                      isGold
                        ? 'bg-gradient-to-r from-gold-dark via-gold to-gold-light text-black hover:brightness-110 shadow-lg shadow-gold/25'
                        : isBlack
                          ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300'
                    }`}
                  >
                    Select Plan
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Sandbox Checkout Modal */}
        <AnimatePresence>
          {selectedPlan && (
            <div id="checkout-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Dark backdrop blur */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseCheckout}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Card Form Container */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-charcoal-light border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative z-10 shadow-2xl shadow-black overflow-hidden"
              >
                {/* Close Button */}
                <button
                  onClick={handleCloseCheckout}
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close checkout"
                  id="checkout-close-btn"
                >
                  <X size={18} />
                </button>

                {checkoutStep === 'form' && (
                  <form onSubmit={handleConfirmReservation} className="space-y-6">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-mono text-gold tracking-widest font-bold block uppercase">
                        SECURE SANDBOX RESERVATION
                      </span>
                      <h4 className="text-white text-xl font-bold">Configure Custom Alloy</h4>
                      <p className="text-gray-400 text-xs">
                        You are initiating reservation steps for the <span className="text-gold font-bold">{selectedPlan.name}</span>.
                      </p>
                    </div>

                    {/* Miniature Card preview in Form */}
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-6 rounded flex items-center justify-center ${
                          selectedPlan.cardTheme === 'gold' 
                            ? 'card-metallic-gold' 
                            : selectedPlan.cardTheme === 'black' 
                              ? 'card-metallic-black' 
                              : 'card-metallic-burner'
                        }`}>
                          <Cpu size={14} className="text-black/30" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-white font-bold">{selectedPlan.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">ESTIMATED DELIVERABLE</span>
                        </div>
                      </div>
                      <span className="text-white font-mono font-black text-sm">${selectedPlan.price}/MO</span>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label htmlFor="custom-name-on-alloy" className="text-xs text-gray-400 font-semibold font-mono uppercase">
                          Custom Name on Alloy Card
                        </label>
                        <input
                          id="custom-name-on-alloy"
                          type="text"
                          required
                          value={checkoutName}
                          onChange={(e) => setCheckoutName(e.target.value.toUpperCase().slice(0, 24))}
                          placeholder="ALEXANDER CHEN"
                          className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3.5 text-sm text-white font-mono focus:outline-none placeholder-gray-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="custom-billing-currency" className="text-xs text-gray-400 font-semibold font-mono uppercase">
                          Preferred Billing Currency
                        </label>
                        <select
                          id="custom-billing-currency"
                          className="w-full bg-white/5 border border-white/10 focus:border-gold/50 rounded-xl px-4 py-3.5 text-sm text-white font-mono focus:outline-none"
                        >
                          <option value="USD">USD ($) - US Dollar</option>
                          <option value="EUR">EUR (€) - Euro</option>
                          <option value="GBP">GBP (£) - British Pound</option>
                          <option value="JPY">JPY (¥) - Japanese Yen</option>
                        </select>
                      </div>
                    </div>

                    {/* Terms */}
                    <p className="text-[10px] text-gray-500 leading-relaxed font-mono">
                      By confirming this reservation, you agree to Dilocash bank policies. No real funds are transferred during this Sandbox execution.
                    </p>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl text-black bg-gradient-to-r from-gold-dark via-gold to-gold-light hover:brightness-110 font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-lg shadow-gold/25"
                    >
                      Confirm Card Reservation
                    </button>
                  </form>
                )}

                {checkoutStep === 'processing' && (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-16 h-16 rounded-full border-4 border-gold/20 border-t-gold animate-spin" />
                    <div className="space-y-2">
                      <h4 className="text-white text-lg font-bold">MINTING METALLIC ALLOY...</h4>
                      <p className="text-gray-500 text-xs max-w-xs mx-auto font-mono">
                        Authorizing digital vaults and engraving profile identity `{checkoutName}` on standard matte alloy backing.
                      </p>
                    </div>
                  </div>
                )}

                {checkoutStep === 'success' && (
                  <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                    {/* Rotating badge */}
                    <div className="w-20 h-20 rounded-full bg-gold/15 border border-gold flex items-center justify-center text-gold animate-pulse">
                      <ShieldCheck size={40} />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full uppercase">
                        RESERVATION GUARANTEED
                      </span>
                      <h4 className="text-white text-2xl font-black mt-2">Welcome to Dilocash!</h4>
                      <p className="text-gray-400 text-xs max-w-sm mx-auto leading-relaxed">
                        Your physical metal asset was compiled successfully. Digital token credentials and virtual burner configurations are loaded inside the secure sandbox registry.
                      </p>
                    </div>

                    {/* Success Certificate Box */}
                    <div className="w-full bg-white/[0.02] border border-white/5 p-4 rounded-2xl font-mono text-[10px] text-left space-y-1 text-gray-500">
                      <div><span className="text-white">CARDHOLDER //</span> {checkoutName}</div>
                      <div><span className="text-white">MEMBERSHIP //</span> {selectedPlan.name.toUpperCase()}</div>
                      <div><span className="text-white">STATUS //</span> CLEARING AUTHORIZED</div>
                      <div><span className="text-white">VAULT CERTIFICATE //</span> #DLC-{Math.floor(Math.random() * 900000 + 100000)}</div>
                    </div>

                    <button
                      onClick={handleCloseCheckout}
                      className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs transition-colors w-full"
                    >
                      Access Sandbox Dashboard
                    </button>
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
