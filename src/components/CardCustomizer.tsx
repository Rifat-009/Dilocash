import { useState, useMemo, useEffect } from 'react';
import { CardTheme, CreditCardState } from '../types';
import { Shield, ShieldAlert, Sparkles, Cpu, Eye, EyeOff, Lock, Unlock, Zap, Coins, Download, CheckCircle, XCircle, CreditCard, QrCode, Fingerprint, Check, Printer, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PremiumParticles from './PremiumParticles';

interface CardCustomizerProps {
  onCardConfigChange?: (config: CreditCardState) => void;
}

export default function CardCustomizer({ onCardConfigChange }: CardCustomizerProps) {
  const [theme, setTheme] = useState<CardTheme>(() => (localStorage.getItem('dilocash_card_theme') as CardTheme) || 'black');
  const [cardHolder, setCardHolder] = useState(() => localStorage.getItem('dilocash_card_holder') || 'ALEXANDER CHEN');
  const [limit, setLimit] = useState(() => Number(localStorage.getItem('dilocash_card_limit')) || 12500);
  const [isLocked, setIsLocked] = useState(() => localStorage.getItem('dilocash_card_locked') === 'true');
  const [showCvv, setShowCvv] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Tab mode state: 'design' to customize card, 'qr' to simulate terminal, 'biometric' for scanning
  const [activeTab, setActiveTab] = useState<'design' | 'biometric' | 'qr'>('design');

  // Biometric verification states
  const [bioStatus, setBioStatus] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [bioProgress, setBioProgress] = useState(0);

  // POS QR Terminal states
  const [merchantName, setMerchantName] = useState('Dilocash Premium Lounge');
  const [paymentAmount, setPaymentAmount] = useState('45.00');
  const [invoiceId, setInvoiceId] = useState('INV-2026-0042');
  const [qrStatus, setQrStatus] = useState<'idle' | 'pending' | 'success' | 'declined'>('idle');
  const [declineReason, setDeclineReason] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Card Order & Engraving states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [engraveStatus, setEngraveStatus] = useState<'idle' | 'calibrating' | 'engraving' | 'sealing' | 'complete'>('idle');
  const [engraveProgress, setEngraveProgress] = useState(0);
  const [engravedText, setEngravedText] = useState('');
  const [receiptHash, setReceiptHash] = useState('');

  // Persist settings in localStorage
  useEffect(() => {
    localStorage.setItem('dilocash_card_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('dilocash_card_holder', cardHolder);
  }, [cardHolder]);

  useEffect(() => {
    localStorage.setItem('dilocash_card_limit', String(limit));
  }, [limit]);

  useEffect(() => {
    localStorage.setItem('dilocash_card_locked', String(isLocked));
  }, [isLocked]);

  // Audio & Laser Engraving Simulation Core
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let humNode: OscillatorNode | null = null;
    let humGain: GainNode | null = null;

    if (isApplyModalOpen) {
      setEngraveStatus('calibrating');
      setEngraveProgress(0);
      setEngravedText('');
      setReceiptHash('TX-DLCS-' + Math.random().toString(36).substring(2, 10).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000));

      try {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        humNode = audioCtx.createOscillator();
        humGain = audioCtx.createGain();
        humNode.type = 'sawtooth';
        humNode.frequency.setValueAtTime(55, audioCtx.currentTime);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(120, audioCtx.currentTime);
        
        humNode.connect(filter);
        filter.connect(humGain);
        humGain.connect(audioCtx.destination);
        
        humGain.gain.setValueAtTime(0, audioCtx.currentTime);
        humGain.gain.linearRampToValueAtTime(0.02, audioCtx.currentTime + 0.5);
        humNode.start();
      } catch (e) {
        console.log('Audio Context block:', e);
      }

      // Transition to engraving after 1.5s calibration
      const calTimer = setTimeout(() => {
        setEngraveStatus('engraving');
        
        if (humNode && audioCtx && humGain) {
          humNode.type = 'triangle';
          humNode.frequency.setValueAtTime(220, audioCtx.currentTime);
          let time = audioCtx.currentTime;
          humNode.frequency.linearRampToValueAtTime(380, time + 0.1);
        }

        let progress = 0;
        const textToEngrave = cardHolder || 'ALEXANDER CHEN';

        const interval = setInterval(() => {
          progress += 2;
          
          if (audioCtx && humNode && humGain) {
            // Modulate laser hum sound pitch on each tick to mimic heavy machine engraving
            const pitch = 180 + Math.random() * 260;
            humNode.frequency.setValueAtTime(pitch, audioCtx.currentTime);
            humGain.gain.setValueAtTime(0.012 + Math.random() * 0.01, audioCtx.currentTime);
          }

          if (progress >= 70) {
            clearInterval(interval);
            setEngraveStatus('sealing');
            
            if (audioCtx && humNode && humGain) {
              humNode.type = 'sine';
              humNode.frequency.setValueAtTime(600, audioCtx.currentTime);
              humNode.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 1.2);
              humGain.gain.setValueAtTime(0.015, audioCtx.currentTime);
              humGain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.2);
            }

            let sealProgress = 70;
            const sealInterval = setInterval(() => {
              sealProgress += 5;
              if (sealProgress >= 100) {
                clearInterval(sealInterval);
                setEngraveStatus('complete');
                setEngraveProgress(100);
                
                // Track this offline action in local cache queue
                try {
                  const existingLogs = localStorage.getItem('dilocash_custom_cards_logs') || '[]';
                  const arr = JSON.parse(existingLogs);
                  arr.push({
                    holder: cardHolder,
                    theme: theme,
                    limit: limit,
                    timestamp: new Date().toISOString()
                  });
                  localStorage.setItem('dilocash_custom_cards_logs', JSON.stringify(arr));
                  window.dispatchEvent(new CustomEvent('dilocash_queue_updated'));
                } catch (e) {}
                
                if (humNode) {
                  try {
                    humNode.stop();
                  } catch (err) {}
                }

                if (audioCtx) {
                  try {
                    const playTone = (freq: number, start: number, duration: number) => {
                      if (!audioCtx) return;
                      const osc = audioCtx.createOscillator();
                      const gain = audioCtx.createGain();
                      osc.connect(gain);
                      gain.connect(audioCtx.destination);
                      osc.frequency.setValueAtTime(freq, start);
                      gain.gain.setValueAtTime(0.04, start);
                      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
                      osc.start(start);
                      osc.stop(start + duration);
                    };
                    playTone(523.25, audioCtx.currentTime, 0.15); // C5
                    playTone(659.25, audioCtx.currentTime + 0.1, 0.15); // E5
                    playTone(783.99, audioCtx.currentTime + 0.2, 0.15); // G5
                    playTone(1046.50, audioCtx.currentTime + 0.3, 0.4); // C6
                  } catch (e) {}
                }
              } else {
                setEngraveProgress(sealProgress);
              }
            }, 100);
          } else {
            setEngraveProgress(progress);
            const revealLength = Math.max(1, Math.floor((progress / 70) * textToEngrave.length));
            setEngravedText(textToEngrave.slice(0, revealLength));
          }
        }, 80);

        (window as any).engraveInterval = interval;

      }, 1500);

      return () => {
        clearTimeout(calTimer);
        if ((window as any).engraveInterval) {
          clearInterval((window as any).engraveInterval);
        }
        if (humNode) {
          try {
            humNode.stop();
          } catch (e) {}
        }
        if (audioCtx) {
          try {
            audioCtx.close();
          } catch (e) {}
        }
      };
    }
  }, [isApplyModalOpen, cardHolder]);

  const cardDetails = useMemo(() => {
    switch (theme) {
      case 'gold':
        return {
          number: '4815 1623 4299 8888',
          expiry: '09/31',
          cvv: '888',
          level: 'ELITE LUXURY',
          class: 'card-metallic-gold text-amber-950',
          accentColor: '#B38F24',
          sub: 'Pure plated physical status'
        };
      case 'burner':
        return {
          number: '4921 7732 1104 3921',
          expiry: '01/27',
          cvv: '409',
          level: 'BURNER INSTANT',
          class: 'card-metallic-burner text-white',
          accentColor: '#FF2D55',
          sub: 'Single-use self-destruct security'
        };
      case 'black':
      default:
        return {
          number: '4532 8824 9912 4012',
          expiry: '12/30',
          cvv: '102',
          level: 'FOUNDERS EDITION',
          class: 'card-metallic-black text-white',
          accentColor: '#D4AF37',
          sub: 'Matte titanium solid weight'
        };
    }
  }, [theme]);

  // Update parent if handler provided
  const triggerParentChange = (updated: Partial<CreditCardState>) => {
    if (onCardConfigChange) {
      onCardConfigChange({
        theme,
        cardHolder,
        limit,
        isLocked,
        expiryDate: cardDetails.expiry,
        cvv: cardDetails.cvv,
        cardNumber: cardDetails.number,
        ...updated
      });
    }
  };

  // Generate a high-resolution base64 data URL of the customized card
  const getCardDataURL = (face: 'front' | 'back'): string => {
    const canvas = document.createElement('canvas');
    // High-resolution export scale (3.5x original aspect ratio)
    const width = 1260;
    const height = 770;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Quality tuning
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Rounded rectangle drawing helper
    const drawRoundedRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      radius: number
    ) => {
      c.beginPath();
      c.moveTo(x + radius, y);
      c.lineTo(x + w - radius, y);
      c.quadraticCurveTo(x + w, y, x + w, y + radius);
      c.lineTo(x + w, y + h - radius);
      c.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
      c.lineTo(x + radius, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - radius);
      c.lineTo(x, y + radius);
      c.quadraticCurveTo(x, y, x + radius, y);
      c.closePath();
    };

    // 1. Render Alloy Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'gold') {
      gradient.addColorStop(0, '#E6C655');
      gradient.addColorStop(0.25, '#AA7C11');
      gradient.addColorStop(0.65, '#FFF2C2');
      gradient.addColorStop(1, '#946610');
    } else if (theme === 'burner') {
      gradient.addColorStop(0, '#FF3B30');
      gradient.addColorStop(0.5, '#7F0000');
      gradient.addColorStop(1, '#FF2D55');
    } else { // matte black
      gradient.addColorStop(0, '#242426');
      gradient.addColorStop(0.5, '#0E0E0F');
      gradient.addColorStop(1, '#2D2D31');
    }

    // Draw background with clipping rounded rect
    ctx.save();
    drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 44);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Alloy outer metal border stroke
    ctx.lineWidth = 6;
    if (theme === 'gold') {
      ctx.strokeStyle = 'rgba(255, 230, 150, 0.45)';
    } else if (theme === 'burner') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    } else {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    }
    ctx.stroke();

    // Diagonal Holographic Sheen
    const sheenGrad = ctx.createLinearGradient(0, 0, width, 0);
    sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sheenGrad.addColorStop(0.35, 'rgba(255, 255, 255, 0.01)');
    sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.11)');
    sheenGrad.addColorStop(0.65, 'rgba(255, 255, 255, 0.01)');
    sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sheenGrad;
    ctx.fillRect(4, 4, width - 8, height - 8);
    ctx.restore();

    // Color theme setups
    const textColor = theme === 'gold' ? '#2A1A05' : '#FFFFFF';
    const labelColor = theme === 'gold' ? 'rgba(42, 26, 5, 0.6)' : 'rgba(255, 255, 255, 0.55)';

    if (face === 'front') {
      // FRONT SIDE DRAWINGS

      // Holographic top-right glow overlay
      ctx.save();
      const radialGlow = ctx.createRadialGradient(width * 0.8, height * 0.2, 50, width * 0.8, height * 0.2, 450);
      radialGlow.addColorStop(0, theme === 'gold' ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.1)');
      radialGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radialGlow;
      drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 44);
      ctx.fill();
      ctx.restore();

      // Top Header: Category / Level
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 15px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(cardDetails.level, 75, 80);

      // Top Header: Brand Name
      ctx.fillStyle = textColor;
      ctx.font = 'bold 38px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('Dilocash', 75, 122);

      // Security Microchip (x=75, y=205, w=125, h=95)
      const chipX = 75;
      const chipY = 205;
      const chipW = 125;
      const chipH = 95;
      ctx.save();
      const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
      if (theme === 'gold') {
        chipGrad.addColorStop(0, '#FFEDB3');
        chipGrad.addColorStop(0.5, '#E2B849');
        chipGrad.addColorStop(1, '#966D12');
      } else {
        chipGrad.addColorStop(0, '#FFFFFF');
        chipGrad.addColorStop(0.5, '#CBCBCB');
        chipGrad.addColorStop(1, '#818181');
      }
      drawRoundedRect(ctx, chipX, chipY, chipW, chipH, 14);
      ctx.fillStyle = chipGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Chip Grid Lines
      ctx.strokeStyle = 'rgba(0,0,0,0.22)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(chipX + chipW / 2, chipY);
      ctx.lineTo(chipX + chipW / 2, chipY + chipH);
      ctx.moveTo(chipX, chipY + chipH / 3);
      ctx.lineTo(chipX + chipW, chipY + chipH / 3);
      ctx.moveTo(chipX, chipY + (chipH * 2) / 3);
      ctx.lineTo(chipX + chipW, chipY + (chipH * 2) / 3);
      ctx.stroke();

      drawRoundedRect(ctx, chipX + chipW / 4, chipY + chipH / 4, chipW / 2, chipH / 2, 8);
      ctx.stroke();
      ctx.restore();

      // Contactless Waves Icon (x=width-125, y=250)
      const waveX = width - 125;
      const waveY = 250;
      ctx.save();
      ctx.strokeStyle = textColor;
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      // Arc 1
      ctx.beginPath();
      ctx.arc(waveX, waveY, 16, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      // Arc 2
      ctx.beginPath();
      ctx.arc(waveX, waveY, 30, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      // Arc 3
      ctx.beginPath();
      ctx.arc(waveX, waveY, 44, -Math.PI / 4, Math.PI / 4);
      ctx.stroke();
      ctx.restore();

      // Card Number
      ctx.fillStyle = textColor;
      ctx.font = '600 45px "JetBrains Mono", "Courier New", Courier, monospace';
      const numberStr = isLocked ? '••••  ••••  ••••  ••••' : cardDetails.number;
      ctx.fillText(numberStr, 75, 435);

      // Card Holder
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('CARD HOLDER', 75, 520);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText((cardHolder || 'YOUR NAME').toUpperCase(), 75, 555);

      // Expiry Date
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('EXPIRY', width - 265, 520);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(isLocked ? '••/••' : cardDetails.expiry, width - 265, 555);

      // CVV
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('CVV', width - 120, 520);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 24px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(isLocked ? '•••' : showCvv ? cardDetails.cvv : '•••', width - 120, 555);

      // Frozen state overlay if locked
      if (isLocked) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
        ctx.beginPath();
        drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 44);
        ctx.fill();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 44px "JetBrains Mono", "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CARD FROZEN', width / 2, height / 2 - 10);
        ctx.fillStyle = '#FCA5A5';
        ctx.font = '16px "JetBrains Mono", "Courier New", Courier, monospace';
        ctx.fillText('COLD STORAGE SECURED PROTOCOL', width / 2, height / 2 + 40);
        ctx.textAlign = 'left';
      }

    } else {
      // BACK SIDE DRAWINGS

      // Magnetic Stripe
      ctx.fillStyle = '#08080A';
      ctx.fillRect(4, 56, width - 8, 126);

      // Signature Label
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 12px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('AUTHORISED SIGNATURE', 75, 240);

      // White Signature Strip (x=75, y=260, w=width-290, h=100)
      const sigX = 75;
      const sigY = 260;
      const sigW = width - 290;
      const sigH = 100;
      ctx.save();
      drawRoundedRect(ctx, sigX, sigY, sigW, sigH, 8);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.fill();

      // Clip security lines inside strip
      ctx.beginPath();
      drawRoundedRect(ctx, sigX, sigY, sigW, sigH, 8);
      ctx.clip();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.lineWidth = 3;
      for (let i = -sigH; i < sigW + sigH; i += 12) {
        ctx.beginPath();
        ctx.moveTo(sigX + i, sigY);
        ctx.lineTo(sigX + i + sigH, sigY + sigH);
        ctx.stroke();
      }
      ctx.restore();

      // Signature text
      ctx.fillStyle = '#334155';
      ctx.font = 'italic bold 28px "Courier New", Courier, monospace';
      ctx.fillText((cardHolder || 'AUTHORISED SIGNATURE').toUpperCase(), sigX + 35, sigY + 58);

      // CVV panel (x=width-185, y=260, w=110, h=100)
      const cvvX = width - 185;
      const cvvY = 260;
      const cvvW = 110;
      const cvvH = 100;
      ctx.save();
      drawRoundedRect(ctx, cvvX, cvvY, cvvW, cvvH, 8);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = labelColor;
      ctx.font = 'bold 10px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('CVV CODE', cvvX + 15, cvvY + 36);

      ctx.fillStyle = textColor;
      ctx.font = 'bold 26px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(isLocked ? '•••' : showCvv ? cardDetails.cvv : '•••', cvvX + 15, cvvY + 74);

      // Support Helpline text
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 11px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('CUSTOMER HELPLINE', 75, 435);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 15px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText('SUPPORT.DILOCASH.COM', 75, 465);

      // Expiry Date (Back Side)
      ctx.fillStyle = labelColor;
      ctx.font = 'bold 11px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.fillText('EXPIRY DATE', width - 225, 435);
      ctx.fillStyle = textColor;
      ctx.font = 'bold 18px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(isLocked ? '••/••' : cardDetails.expiry, width - 225, 465);

      // Divider Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(75, 535);
      ctx.lineTo(width - 75, 535);
      ctx.stroke();

      // PCI Compliance text
      ctx.fillStyle = labelColor;
      ctx.font = '9px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText('PCI-DSS COMPLIANT // SECURED PROTOCOL // HYBRID COLD KEY', 75, 575);

      // Alloy Type text badge
      ctx.save();
      const badgeText = theme === 'gold' ? 'GOLD ALLOY' : theme === 'burner' ? 'BURNER' : 'TITANIUM';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      drawRoundedRect(ctx, width - 265, 555, 115, 32, 6);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px "JetBrains Mono", "Courier New", Courier, monospace';
      ctx.fillText(badgeText, width - 248, 575);
      ctx.restore();

      // Dilo circular golden seal
      ctx.save();
      const dX = width - 110;
      const dY = 571;
      ctx.beginPath();
      ctx.arc(dX, dY, 18, 0, 2 * Math.PI);
      const dGrad = ctx.createLinearGradient(dX - 18, dY - 18, dX + 18, dY + 18);
      dGrad.addColorStop(0, '#E6C655');
      dGrad.addColorStop(1, '#946610');
      ctx.fillStyle = dGrad;
      ctx.fill();

      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px "Plus Jakarta Sans", "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('D', dX, dY + 5);
      ctx.textAlign = 'left';
      ctx.restore();

      // Frozen overlay if locked
      if (isLocked) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.72)';
        ctx.beginPath();
        drawRoundedRect(ctx, 4, 4, width - 8, height - 8, 44);
        ctx.fill();

        ctx.fillStyle = '#EF4444';
        ctx.font = 'bold 44px "JetBrains Mono", "Courier New", Courier, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CARD BLOCKED', width / 2, height / 2);
        ctx.textAlign = 'left';
      }
    }

    return canvas.toDataURL('image/png', 1.0);
  };

  const handleDownloadSlip = () => {
    const textToEngrave = cardHolder || 'ALEXANDER CHEN';
    const materialSelected = theme === 'gold' ? '24K Gold-Plated Heavy Brass' : theme === 'burner' ? 'Rose Recyclable Carbon Fiber' : 'Solid Matte Aerospace Titanium';
    const cardLevel = cardDetails.level.toUpperCase();

    const slipContent = `======================================================================
                     DILOCASH DIGITAL LEDGER
                  PHYSICAL METAL CARD ORDER SLIP
======================================================================

  [ TRANSACTION RECORD & RECEIPT DETAILS ]
  
  RECEIPT ID:       ${receiptHash}
  TIMESTAMP:        ${new Date().toLocaleDateString()} 14:55:00 UTC
  STATUS:           SUCCESSFULLY ENGRAVED & SEALED

----------------------------------------------------------------------
  [ SPECIFICATION & PARAMETERS ]
----------------------------------------------------------------------
  
  CARDHOLDER ID:    ${textToEngrave.toUpperCase()}
  BASE MATERIAL:    ${materialSelected}
  CARD PRIVILEGE:   ${cardLevel}
  DAILY LIMIT:      $${limit.toLocaleString()} USD
  SECURITY ENGINE:  Level 1 Biometric Enclave
  DEPOSIT STATUS:   VERIFIED SECURE & ACTIVE

----------------------------------------------------------------------
  [ ACCOUNT DEBIT & FEE STRUCTURE ]
----------------------------------------------------------------------
  
  CNC Laser Engraving Fee:               $149.00 USD
  Insured FedEx Courier Speed:            $35.00 USD
  Founders VIP Membership Waive:        -$184.00 USD
  --------------------------------------------------
  TOTAL AMOUNT DUE:                      $0.00 USD
  STATUS:                                PAID IN FULL

----------------------------------------------------------------------
  [ CRYPTOGRAPHIC SIGNATURE & PAIR KEY ]
----------------------------------------------------------------------
  
  SIGNATURE KEY:
  ${receiptHash}
  
  VERIFIED CHIP ID:
  ECDSA_SHA256_${receiptHash.replace('TX-DLCS-', '')}

======================================================================
  Dilocash digital banking technology is powered by verified 
  biometric consensus protocols. This document is a validated record 
  of your physical metal asset fabrication.
======================================================================
`;

    // 1. Download the slip text file
    const blob = new Blob([slipContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dilocash-card-slip-${receiptHash.toLowerCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // 2. Download the high-resolution front card design
    const cleanHolderName = textToEngrave.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'card';
    const frontUrl = getCardDataURL('front');
    if (frontUrl) {
      const frontLink = document.createElement('a');
      frontLink.download = `dilocash-${theme}-front-${cleanHolderName}.png`;
      frontLink.href = frontUrl;
      document.body.appendChild(frontLink);
      frontLink.click();
      document.body.removeChild(frontLink);
    }

    // 3. Download the high-resolution back card design
    const backUrl = getCardDataURL('back');
    if (backUrl) {
      const backLink = document.createElement('a');
      backLink.download = `dilocash-${theme}-back-${cleanHolderName}.png`;
      backLink.href = backUrl;
      document.body.appendChild(backLink);
      backLink.click();
      document.body.removeChild(backLink);
    }
  };

  const handleDownloadPNG = () => {
    const sideLabel = isFlipped ? 'back' : 'front';
    const cleanHolderName = cardHolder.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'card';
    const filename = `dilocash-${theme}-${sideLabel}-${cleanHolderName}.png`;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = getCardDataURL(isFlipped ? 'back' : 'front');
    link.click();
  };

  // Simulate POS contactless card pay execution
  const handlePOSPayment = () => {
    if (isPaying) return;
    setIsPaying(true);
    setQrStatus('pending');

    setTimeout(() => {
      const amountNum = parseFloat(paymentAmount);
      
      // Validation criteria
      if (isLocked) {
        setQrStatus('declined');
        setDeclineReason('Instrument Frozen. Unfreeze card to authorise.');
        setIsPaying(false);
        return;
      }

      if (isNaN(amountNum) || amountNum <= 0) {
        setQrStatus('declined');
        setDeclineReason('Invalid payment amount requested.');
        setIsPaying(false);
        return;
      }

      if (amountNum > limit) {
        setQrStatus('declined');
        setDeclineReason('Amount exceeds configured Daily Spend Limit.');
        setIsPaying(false);
        return;
      }

      // Successful simulated POS checkout
      const newLimit = limit - amountNum;
      setLimit(newLimit);
      setQrStatus('success');
      setIsPaying(false);
      triggerParentChange({ limit: newLimit });

      // Trigger high fidelity Web Audio synthesizer beep
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const playTone = (freq: number, start: number, duration: number) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.08, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
          osc.start(start);
          osc.stop(start + duration);
        };
        playTone(880, audioCtx.currentTime, 0.08);
        playTone(1320, audioCtx.currentTime + 0.06, 0.15);
      } catch (err) {
        console.warn('Audio feedback blocked or uninitialized:', err);
      }
    }, 1200);
  };

  // Play biometric success chime
  const playBioSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playTone = (freq: number, start: number, duration: number, type: 'sine' | 'triangle' = 'sine') => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.08, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        osc.start(start);
        osc.stop(start + duration);
      };
      // Sweet digital confirmation tri-tone
      playTone(523.25, audioCtx.currentTime, 0.12, 'sine'); // C5
      playTone(659.25, audioCtx.currentTime + 0.08, 0.12, 'sine'); // E5
      playTone(987.77, audioCtx.currentTime + 0.16, 0.25, 'sine'); // B5
    } catch (err) {
      console.warn('Audio feedback blocked or uninitialized:', err);
    }
  };

  // Play scanning hum/sweep
  const playBioScanSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (err) {
      // ignore
    }
  };

  const startScanning = () => {
    if (bioStatus === 'scanning' || bioStatus === 'success') return;
    
    playBioScanSound();
    setBioStatus('scanning');
    setBioProgress(0);
    
    let currentProgress = 0;
    const intervalTime = 30; // ms
    const totalDuration = 1200; // 1.2 seconds total scan time
    const step = (100 / (totalDuration / intervalTime));

    const interval = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= 100) {
        setBioProgress(100);
        setBioStatus('success');
        clearInterval(interval);
        playBioSuccessSound();
        
        // Auto-unlock card if it was locked!
        setIsLocked(false);
        if (onCardConfigChange) {
          onCardConfigChange({
            theme,
            cardHolder,
            limit,
            isLocked: false,
            expiryDate: cardDetails.expiry,
            cvv: cardDetails.cvv,
            cardNumber: cardDetails.number,
          });
        }
      } else {
        setBioProgress(currentProgress);
      }
    }, intervalTime);
    
    (window as any).activeScanInterval = interval;
  };

  const cancelScanning = () => {
    if (bioStatus === 'scanning') {
      if ((window as any).activeScanInterval) {
        clearInterval((window as any).activeScanInterval);
      }
      setBioStatus('idle');
      setBioProgress(0);
    }
  };

  return (
    <div id="card-customizer-root" className="w-full flex flex-col lg:flex-row gap-8 items-center lg:items-stretch">
      
      {/* Visual Render Column */}
      <div className="flex-1 flex flex-col justify-between items-center relative min-h-[380px] p-6 rounded-3xl bg-white/[0.02] border border-white/5 shadow-2xl overflow-hidden">
        {/* Subtle grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        
        <div className="text-center mb-6 relative z-10">
          <span className="text-[10px] font-mono tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full uppercase">
            Live Preview
          </span>
          <h4 className="text-white font-semibold text-lg mt-2 font-mono">Dilocash Premium Card</h4>
          <p className="text-gray-400 text-xs mt-0.5">{cardDetails.sub}</p>
        </div>

        {/* NFC Terminal status & signal display */}
        <div className="w-full max-w-[360px] mb-4 bg-white/[0.03] border border-white/5 rounded-2xl p-2 px-3.5 flex items-center justify-between text-xs font-mono relative overflow-hidden">
          <div className="flex items-center gap-2">
            {/* NFC Status Indicator Dot */}
            <div className={`w-2 h-2 rounded-full relative transition-all duration-300 ${
              isHovered 
                ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                : 'bg-gold/40 shadow-[0_0_4px_rgba(212,175,55,0.4)]'
            }`}>
              {isHovered && (
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              )}
            </div>
            <span className={`text-[10px] font-bold tracking-wider uppercase transition-colors duration-300 ${isHovered ? 'text-emerald-400' : 'text-gray-400'}`}>
              {isHovered ? 'NFC Terminal Active' : 'NFC Terminal Ready'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span>{isHovered ? 'TAP DETECTED' : 'HOVER TO SCAN'}</span>
          </div>

          {/* Signal sweep line */}
          {isHovered && (
            <motion.div
              initial={{ left: '-100%' }}
              animate={{ left: '100%' }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-emerald-500/10 to-transparent pointer-events-none"
            />
          )}
        </div>

        {/* Realtime Credit Card Element */}
        <div 
          className={`w-full max-w-[360px] h-[220px] relative card-container cursor-pointer select-none transition-transform duration-300 ${activeTab === 'qr' || activeTab === 'biometric' ? 'scale-90 mb-2' : ''}`}
          style={{ perspective: '1200px' }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Premium Light-Scattering Particle System Behind Card */}
          <PremiumParticles isHovered={isHovered} isFlipped={isFlipped} theme={theme} />

          {/* NFC Contactless Payment Wave Pulse Behind the Card */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-0">
            <AnimatePresence>
              {isHovered && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                    className="absolute w-72 h-72 rounded-full border border-emerald-500/30 bg-emerald-500/[0.01]"
                  />
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 2.3, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
                    className="absolute w-72 h-72 rounded-full border border-emerald-500/15"
                  />
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* 3D Flip Wrapper */}
          <motion.div
            className="w-full h-full relative"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            {/* FRONT SIDE */}
            <div
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                boxShadow: isLocked 
                  ? '0 0 30px rgba(239, 68, 68, 0.25)' 
                  : theme === 'gold' 
                    ? '0 15px 35px rgba(212, 175, 55, 0.15)' 
                    : theme === 'burner'
                      ? '0 15px 35px rgba(255, 59, 48, 0.15)'
                      : '0 15px 35px rgba(0, 0, 0, 0.6)'
              }}
              className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden ${cardDetails.class}`}
            >
              {/* Glossy Sheen */}
              <div className="card-sheen" />
              
              {/* Holographic background wireframe */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
              
              {/* Card Top */}
              <div className="flex items-start justify-between relative z-10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-mono tracking-widest uppercase opacity-75">
                    {cardDetails.level}
                  </span>
                  <span className="text-lg font-bold tracking-tight mt-0.5">Dilocash</span>
                </div>
                <div className="flex items-center gap-1">
                  {theme === 'burner' && (
                    <div className="bg-white/20 text-white px-2 py-0.5 rounded text-[8px] font-mono tracking-wider flex items-center gap-1 animate-pulse">
                      <Zap size={8} /> ONE-TIME USE
                    </div>
                  )}
                  {isLocked && (
                    <div className="bg-red-500/25 border border-red-500/40 text-red-200 px-2.5 py-0.5 rounded-full text-[8px] font-mono font-bold tracking-wider flex items-center gap-1">
                      <Lock size={8} /> FROZEN
                    </div>
                  )}
                </div>
              </div>

              {/* Card Middle: Chip & Contactless */}
              <div className="flex items-center justify-between mt-4 relative z-10">
                <div className="relative">
                  {/* Security Chip Representation */}
                  <div className={`w-10 h-8 rounded-md bg-gradient-to-br ${theme === 'gold' ? 'from-amber-200 to-amber-500' : 'from-zinc-200 to-zinc-500'} p-0.5 shadow-md flex items-center justify-center overflow-hidden`}>
                    <Cpu size={24} className={theme === 'gold' ? 'text-amber-950/40' : 'text-zinc-800/40'} />
                    <div className="absolute inset-0 flex flex-col justify-between p-0.5 opacity-25">
                      <div className="h-[1px] bg-black w-full" />
                      <div className="h-[1px] bg-black w-full" />
                      <div className="h-[1px] bg-black w-full" />
                    </div>
                  </div>
                </div>
                <div className={`transition-all duration-300 ${isHovered ? 'opacity-100 text-emerald-400' : 'opacity-40 text-current'}`}>
                  {/* Contactless waves icon */}
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transform rotate-90">
                    <path d="M5 12a14 14 0 0 1 14 0" />
                    <path d="M8 12a8 8 0 0 1 8 0" />
                    <path d="M11 12a2 2 0 0 1 2 0" />
                  </svg>
                </div>
              </div>

              {/* Card Bottom: Number, Name, Expiry */}
              <div className="flex flex-col gap-2 relative z-10 mt-auto">
                <div className="font-mono text-base sm:text-lg tracking-[0.18em] font-semibold">
                  {isLocked ? '•••• •••• •••• ••••' : cardDetails.number}
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="flex flex-col max-w-[70%]">
                    <span className="text-[7px] uppercase tracking-wider opacity-60">Card Holder</span>
                    <span className="text-xs font-mono font-medium tracking-wider truncate uppercase">
                      {cardHolder || 'YOUR NAME'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] uppercase tracking-wider opacity-60">Expiry</span>
                      <span className="text-[11px] font-mono font-semibold tracking-wider">
                        {isLocked ? '••/••' : cardDetails.expiry}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[7px] uppercase tracking-wider opacity-60">CVV</span>
                      <span className="text-[11px] font-mono font-semibold tracking-wider">
                        {isLocked ? '•••' : showCvv ? cardDetails.cvv : '•••'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frozen Overlay effect */}
              <AnimatePresence>
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 gap-2"
                  >
                    <Lock size={32} className="text-red-500 animate-bounce" />
                    <span className="text-red-400 font-mono text-xs font-bold tracking-widest uppercase">
                      CARD BLOCKED / COLD STATE
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BACK SIDE */}
            <div
              style={{ 
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                boxShadow: isLocked 
                  ? '0 0 30px rgba(239, 68, 68, 0.25)' 
                  : theme === 'gold' 
                    ? '0 15px 35px rgba(212, 175, 55, 0.15)' 
                    : theme === 'burner'
                      ? '0 15px 35px rgba(255, 59, 48, 0.15)'
                      : '0 15px 35px rgba(0, 0, 0, 0.6)'
              }}
              className={`absolute inset-0 w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden ${cardDetails.class}`}
            >
              {/* Magnetic Stripe */}
              <div className="absolute top-4 left-0 w-full h-9 bg-neutral-950 shadow-inner" />

              {/* Signature Panel & CVV */}
              <div className="mt-11 flex items-center justify-between gap-4 relative z-10">
                <div className="flex-1 h-8 bg-zinc-100/90 rounded border border-white/10 flex items-center px-3 justify-end shadow-inner relative overflow-hidden">
                  <div className="absolute inset-y-0 left-0 right-10 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(0,0,0,0.03)_4px,rgba(0,0,0,0.03)_8px)] pointer-events-none" />
                  <span className="font-mono text-[9px] font-bold text-gray-500 uppercase tracking-wider relative z-10 select-all truncate">
                    {cardHolder || 'AUTHORISED SIGNATURE'}
                  </span>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className="text-[6px] uppercase tracking-wider opacity-60">Security Code</span>
                  <div className="h-8 px-2.5 bg-neutral-900/30 rounded border border-white/10 flex items-center justify-center font-mono font-bold text-xs">
                    {isLocked ? '•••' : showCvv ? cardDetails.cvv : '•••'}
                  </div>
                </div>
              </div>

              {/* Help & Support text */}
              <div className="flex flex-col gap-1 mt-auto relative z-10">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col text-left">
                    <span className="text-[6px] uppercase tracking-wider opacity-60">Customer Helpline</span>
                    <span className="text-[7px] font-mono tracking-widest font-semibold opacity-80">
                      SUPPORT.DILOCASH.COM
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[6px] uppercase tracking-wider opacity-60">Expiry Date</span>
                    <span className="text-[11px] font-mono font-bold tracking-wider">
                      {isLocked ? '••/••' : cardDetails.expiry}
                    </span>
                  </div>
                </div>

                {/* Back Footer details */}
                <div className="border-t border-white/10 pt-1.5 mt-1 flex justify-between items-center text-[7px] opacity-75">
                  <span className="font-mono uppercase tracking-widest text-[6px]">
                    PCI-DSS COMPLIANT // SECURED PROTOCOL
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="px-1 py-0.5 rounded bg-white/10 flex items-center justify-center font-bold text-[6px] text-white">
                      {theme === 'gold' ? 'GOLD ALLOY' : theme === 'burner' ? 'BURNER' : 'TITANIUM'}
                    </div>
                    <div className="w-4 h-4 bg-gradient-to-br from-[#D4AF37] to-[#8E6F1D] rounded-full flex items-center justify-center font-bold text-black text-[7px]">
                      D
                    </div>
                  </div>
                </div>
              </div>

              {/* Frozen Overlay effect */}
              <AnimatePresence>
                {isLocked && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex flex-col items-center justify-center z-20 gap-2"
                  >
                    <Lock size={32} className="text-red-500" />
                    <span className="text-red-400 font-mono text-[10px] font-bold tracking-widest uppercase">
                      CARD BLOCKED
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Informative Interaction Hint */}
        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <span className="animate-pulse">💡</span>
          <span>Click card to flip 3D alloy // Hover to scan contactless</span>
        </div>

        {/* Real-time Simulated POS Terminal */}
        {activeTab === 'qr' && (
          <div className="w-full max-w-[360px] bg-[#0c0c0e]/95 border border-white/10 rounded-2xl p-4 mt-4 shadow-2xl relative overflow-hidden font-mono text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2.5 text-[10px] text-gray-500">
              <span className="font-bold text-gold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> DILOCASH POS TERMINAL
              </span>
              <span>v4.2.0</span>
            </div>

            <div className="space-y-1 mb-3">
              <span className="text-[9px] text-gray-500 uppercase block">Merchant Business</span>
              <span className="text-xs font-bold text-white block truncate">{merchantName}</span>
              <div className="flex justify-between text-[9px] text-gray-400">
                <span>Ref: {invoiceId}</span>
                <span className="text-gold font-bold">TOTAL CHARGE</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-[9px] text-gray-500">Awaiting QR scan or Tap</span>
                <span className="text-base font-bold text-emerald-400">${parseFloat(paymentAmount || '0').toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-[#141416] border border-white/5 rounded-xl p-3 flex flex-col items-center justify-center min-h-[140px] relative">
              {qrStatus === 'success' ? (
                <div className="flex flex-col items-center text-center space-y-2 py-2 animate-scaleUp">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">PAYMENT APPROVED</span>
                    <span className="text-[8px] text-gray-500 mt-0.5 block">Tx Code: {Math.random().toString(36).substring(3, 9).toUpperCase()}</span>
                  </div>
                  <div className="text-[8px] text-gray-500 font-mono pt-1.5 border-t border-dashed border-white/10 w-full max-w-[180px] leading-relaxed">
                    CHARGED: ${parseFloat(paymentAmount).toFixed(2)} USD<br/>
                    REMAINING LIMIT: ${limit.toLocaleString()}<br/>
                    biometric cold keys authorized
                  </div>
                </div>
              ) : qrStatus === 'declined' ? (
                <div className="flex flex-col items-center text-center space-y-2 py-2">
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/30">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block">TRANSACTION DECLINED</span>
                    <span className="text-[8px] text-gray-400 mt-0.5 block max-w-[200px] leading-relaxed">{declineReason}</span>
                  </div>
                </div>
              ) : qrStatus === 'pending' || isPaying ? (
                <div className="flex flex-col items-center text-center space-y-2 py-4">
                  <div className="w-8 h-8 rounded-full border-2 border-gold/20 border-t-gold animate-spin" />
                  <span className="text-[9px] text-gray-400 uppercase tracking-widest">DIALING SWIFT CLEARING...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  <div className="p-1 bg-white rounded-lg">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(`dilocash://pay?m=${merchantName}&a=${paymentAmount}&ref=${invoiceId}`)}&color=0e0e0f&bgcolor=ffffff`}
                      alt="Payment QR"
                      width="110"
                      height="110"
                      className="rounded"
                    />
                  </div>
                  <span className="text-[8px] text-gray-500 text-center max-w-[190px] leading-relaxed">
                    Scan dynamic QR with client device or click below to simulate contact card tap
                  </span>
                </div>
              )}
            </div>

            {qrStatus === 'idle' && (
              <button
                type="button"
                onClick={handlePOSPayment}
                className="w-full mt-2.5 py-1.5 px-2.5 bg-white/5 hover:bg-gold/10 hover:text-gold rounded-lg border border-white/5 hover:border-gold/30 text-[9px] font-bold uppercase tracking-wider text-center text-gray-300 transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <CreditCard className="w-2.5 h-2.5" /> Simulate Card Tap Pay
              </button>
            )}

            {qrStatus !== 'idle' && (
              <button
                type="button"
                onClick={() => setQrStatus('idle')}
                className="w-full mt-2.5 py-1.5 px-2.5 bg-white/5 hover:bg-white/10 rounded-lg border border-white/5 text-[9px] font-bold uppercase tracking-wider text-center text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                Reset POS Terminal
              </button>
            )}
          </div>
        )}

        {/* Live spend meter representation */}
        <div className="w-full mt-4 bg-white/5 border border-white/5 rounded-2xl p-3.5 flex items-center justify-between text-xs font-mono">
          <span className="text-gray-400">DAILY TRANSACTION LIMIT:</span>
          <span className="text-gold font-bold">${limit.toLocaleString()} USD</span>
        </div>

        {/* Biometric Verification overlay */}
        <AnimatePresence>
          {bioStatus !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-[#070708]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center"
            >
              {bioStatus === 'scanning' && (
                <div className="space-y-6 flex flex-col items-center justify-center">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.3], opacity: [0.4, 0] }}
                      transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                      className="absolute inset-0 rounded-full border border-cyan-400/20"
                    />
                    
                    <div className="w-24 h-24 rounded-full border-2 border-cyan-500/40 relative overflow-hidden bg-cyan-950/20 flex items-center justify-center">
                      <Fingerprint className="w-12 h-12 text-cyan-400 animate-pulse" />
                      <motion.div
                        animate={{ top: ['0%', '100%', '0%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_8px_#22d3ee] pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-cyan-400 font-mono text-xs font-extrabold tracking-widest uppercase animate-pulse">
                      SECURE BIOMETRIC SCANNING
                    </h5>
                    <p className="text-gray-400 text-[11px] max-w-[240px] font-mono leading-relaxed">
                      Please hold your fingerprint on the touchpad on the right panel.
                    </p>
                  </div>

                  <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: `${bioProgress}%` }}
                      className="h-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]"
                    />
                  </div>
                  <span className="text-cyan-400/80 font-mono text-[10px] font-bold">
                    {Math.round(bioProgress)}% SECURING CHANNEL
                  </span>
                </div>
              )}

              {bioStatus === 'success' && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-6 flex flex-col items-center justify-center"
                >
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 2, opacity: 0 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="absolute inset-0 rounded-full bg-emerald-500/20 border border-emerald-500/40"
                    />
                    <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                      <motion.svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        className="w-10 h-10"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </motion.svg>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="text-emerald-400 font-mono text-xs font-extrabold tracking-widest uppercase">
                      VERIFICATION SUCCESS
                    </h5>
                    <p className="text-gray-300 text-[11px] font-mono max-w-[260px] leading-relaxed">
                      Biometric signature validated.<br />
                      <span className="text-gray-500 text-[10px]">Alloy security lock has been unlocked successfully.</span>
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setBioStatus('idle');
                      setBioProgress(0);
                    }}
                    className="py-1.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 rounded-xl text-[10px] font-bold uppercase tracking-wider font-mono cursor-pointer transition-all shadow-md shadow-emerald-500/10"
                  >
                    Return to preview
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Control Panel Column */}
      <div className="flex-1 flex flex-col justify-between bg-white/[0.01] border border-white/5 p-6 sm:p-8 rounded-3xl">
        <div className="space-y-6">
          <div>
            <span className="text-xs font-semibold text-gold tracking-wider font-mono">STEP 02 // OPERATIONS</span>
            <h4 className="text-white text-xl font-bold mt-1 font-sans">Interactive Control</h4>
            <p className="text-gray-400 text-sm mt-1">
              Toggle card configurations or simulate dynamic merchant POS checkouts.
            </p>
          </div>

          {/* Mode Switcher Segmented Control */}
          <div className="grid grid-cols-3 bg-white/5 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab('design')}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-300 cursor-pointer ${
                activeTab === 'design'
                  ? 'bg-gold text-black shadow-lg font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Designer
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('biometric');
                setBioStatus('idle');
                setBioProgress(0);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-300 cursor-pointer ${
                activeTab === 'biometric'
                  ? 'bg-gold text-black shadow-lg font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Biometrics
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('qr');
                setQrStatus('idle');
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-300 cursor-pointer ${
                activeTab === 'qr'
                  ? 'bg-gold text-black shadow-lg font-bold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              POS Pay
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'design' ? (
              <motion.div
                key="design-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Theme Selector */}
                <div className="space-y-2 text-left">
                  <label className="text-xs text-gray-400 font-semibold tracking-wider font-mono uppercase">
                    Alloy & Security Shell
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => { setTheme('black'); triggerParentChange({ theme: 'black' }); }}
                      className={`py-3 px-2 rounded-xl text-center border font-bold text-xs flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        theme === 'black'
                          ? 'border-gold bg-gold/10 text-white shadow-lg shadow-gold/5'
                          : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-zinc-900 border border-zinc-700" />
                      Matte Black
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTheme('gold'); triggerParentChange({ theme: 'gold' }); }}
                      className={`py-3 px-2 rounded-xl text-center border font-bold text-xs flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        theme === 'gold'
                          ? 'border-gold bg-gold/10 text-white shadow-lg shadow-gold/5'
                          : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border border-amber-200" />
                      Gold Luxury
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTheme('burner'); triggerParentChange({ theme: 'burner' }); }}
                      className={`py-3 px-2 rounded-xl text-center border font-bold text-xs flex flex-col items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                        theme === 'burner'
                          ? 'border-gold bg-gold/10 text-white shadow-lg shadow-gold/5'
                          : 'border-white/5 bg-white/[0.02] text-gray-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border border-rose-400" />
                      Burner Card
                    </button>
                  </div>
                </div>

                {/* Name Customizer */}
                <div className="space-y-2 text-left">
                  <label htmlFor="cardholder-name-input" className="text-xs text-gray-400 font-semibold tracking-wider font-mono uppercase">
                    Cardholder Identity
                  </label>
                  <input
                    id="cardholder-name-input"
                    type="text"
                    value={cardHolder}
                    onChange={(e) => {
                      const val = e.target.value.toUpperCase().slice(0, 24);
                      setCardHolder(val);
                      triggerParentChange({ cardHolder: val });
                    }}
                    placeholder="E.G. ALEXANDER CHEN"
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-gold/50 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-gray-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Spend limit slider */}
                <div className="space-y-2 text-left">
                  <div className="flex justify-between items-center text-xs font-mono uppercase text-gray-400">
                    <label htmlFor="daily-spend-limit">Daily Spend Threshold</label>
                    <span className="text-white font-bold">${limit.toLocaleString()} USD</span>
                  </div>
                  <input
                    id="daily-spend-limit"
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={limit}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setLimit(val);
                      triggerParentChange({ limit: val });
                    }}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                    <span>$1,000 USD</span>
                    <span>$25,000 USD (MAX)</span>
                  </div>
                </div>

                {/* Toggle Controls Grid */}
                <div className="grid grid-cols-2 gap-4 pt-1">
                  {/* Freeze control */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLocked(!isLocked);
                      triggerParentChange({ isLocked: !isLocked });
                    }}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 cursor-pointer ${
                      isLocked
                        ? 'border-red-500/30 bg-red-500/10 text-red-400 shadow-md shadow-red-500/5'
                        : 'border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10'
                    }`}
                  >
                    {isLocked ? (
                      <>
                        <Unlock size={14} className="text-red-400" /> Unfreeze Card
                      </>
                    ) : (
                      <>
                        <Lock size={14} className="text-gray-400" /> Freeze Card
                      </>
                    )}
                  </button>

                  {/* Show CVV control */}
                  <button
                    type="button"
                    onClick={() => setShowCvv(!showCvv)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold text-xs transition-all duration-300 cursor-pointer ${
                      showCvv
                        ? 'border-gold bg-gold/10 text-gold shadow-md'
                        : 'border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10'
                    }`}
                  >
                    {showCvv ? (
                      <>
                        <EyeOff size={14} /> Mask CVV
                      </>
                    ) : (
                      <>
                        <Eye size={14} /> Reveal CVV
                      </>
                    )}
                  </button>
                </div>

                {/* Apply for Card & Download Buttons */}
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-400 via-gold to-amber-500 hover:from-amber-500 hover:to-gold text-black transition-all duration-300 font-black text-xs font-mono uppercase tracking-widest cursor-pointer shadow-[0_4px_15px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(212,175,55,0.4)]"
                  >
                    <Sparkles size={14} className="text-black animate-pulse" />
                    Apply for Physical Card
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadPNG}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gold/10 bg-white/[0.01] hover:bg-gold/5 hover:border-gold/30 text-gold hover:text-white transition-all duration-300 font-bold text-xs font-mono uppercase tracking-widest cursor-pointer"
                  >
                    <Download size={13} className="text-gold" />
                    Download High-Res {isFlipped ? 'Back' : 'Front'} Card
                  </button>
                </div>
              </motion.div>
            ) : activeTab === 'biometric' ? (
              <motion.div
                key="biometric-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-5 text-left"
              >
                <div>
                  <h5 className="text-white text-xs font-bold font-mono uppercase tracking-wider text-gold">Biometric Security Core</h5>
                  <p className="text-gray-400 text-[11px] mt-0.5 font-sans">
                    Validate identity signatures using integrated visual fingerprint scanning sensors to activate cold key channels.
                  </p>
                </div>

                {/* Fingerprint Scanning Pad Container */}
                <div className="bg-[#0c0c0e]/80 border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[220px]">
                  {/* Subtle pulsing background glow */}
                  <div className={`absolute w-36 h-36 rounded-full blur-[60px] pointer-events-none transition-colors duration-500 ${
                    bioStatus === 'scanning' ? 'bg-cyan-500/10' : bioStatus === 'success' ? 'bg-emerald-500/10' : 'bg-gold/5'
                  }`} />

                  {bioStatus === 'success' ? (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center space-y-3.5"
                    >
                      <div className="w-14 h-14 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                        <Check className="w-8 h-8" strokeWidth={3} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono block">BIOMETRIC MATCH</span>
                        <span className="text-[10px] text-gray-400 mt-1 block font-mono max-w-[220px] leading-relaxed">
                          Secure hardware-enclave keys successfully unlocked and mapped. Daily limit spend enabled.
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setBioStatus('idle');
                          setBioProgress(0);
                        }}
                        className="py-1.5 px-4 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-300 font-mono border border-white/5 cursor-pointer transition-all"
                      >
                        Reset Scanner
                      </button>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center space-y-4 w-full">
                      {/* Scanning Touchpad Button */}
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onMouseDown={startScanning}
                        onMouseUp={cancelScanning}
                        onMouseLeave={cancelScanning}
                        onTouchStart={startScanning}
                        onTouchEnd={cancelScanning}
                        onClick={() => {
                          // Support quick click trigger too
                          if (bioStatus === 'idle') {
                            startScanning();
                          }
                        }}
                        className={`relative w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                          bioStatus === 'scanning'
                            ? 'border-cyan-400 bg-cyan-950/30 shadow-[0_0_20px_rgba(34,211,238,0.25)]'
                            : 'border-white/10 bg-white/[0.02] hover:border-gold/40 hover:bg-gold/5'
                        }`}
                      >
                        {/* Interactive scanning dial line */}
                        {bioStatus === 'scanning' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-1 rounded-full border border-dashed border-cyan-400/40"
                          />
                        )}

                        <Fingerprint className={`w-10 h-10 transition-colors duration-300 ${
                          bioStatus === 'scanning' ? 'text-cyan-400' : 'text-gray-400 group-hover:text-gold'
                        }`} />
                      </motion.button>

                      <div className="space-y-1">
                        <span className="text-[10px] font-bold font-mono tracking-wider text-gray-300 uppercase block">
                          {bioStatus === 'scanning' ? 'Scanning...' : 'Touchpad Ready'}
                        </span>
                        <span className="text-[9px] text-gray-500 font-mono block max-w-[240px] leading-relaxed">
                          {bioStatus === 'scanning' 
                            ? 'Hold mouse button or finger down to scan...' 
                            : 'Click or hold down fingerprint pad to authenticate secure cold key enclave.'
                          }
                        </span>
                      </div>

                      {bioStatus === 'scanning' && (
                        <div className="w-full max-w-[180px] space-y-1.5">
                          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-cyan-400" style={{ width: `${bioProgress}%` }} />
                          </div>
                          <span className="text-cyan-400 text-[8px] font-mono font-bold tracking-widest uppercase">
                            Progress: {Math.round(bioProgress)}%
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Additional simulated telemetry */}
                <div className="p-3 bg-white/[0.01] border border-white/[0.03] rounded-xl text-[9px] font-mono text-gray-500 leading-relaxed flex items-center gap-2">
                  <span className="text-gold">●</span>
                  <span>
                    Cryptographic hash: <span className="text-gray-400">SHA-256 (Enclave_4B91_Cold_Ver)</span> validated on-device. No plain text data or biometric telemetry leaves the physical card vault.
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="qr-panel"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="space-y-4 text-left"
              >
                <div>
                  <h5 className="text-white text-xs font-bold font-mono uppercase tracking-wider text-gold">POS Merchant Configuration</h5>
                  <p className="text-gray-400 text-[11px] mt-0.5 font-sans">Customize terminal invoice settings to test payment limits.</p>
                </div>

                {/* Merchant Name Input */}
                <div className="space-y-1.5">
                  <label className="text-[10px] text-gray-400 font-semibold font-mono uppercase">Merchant Business Name</label>
                  <input
                    type="text"
                    value={merchantName}
                    onChange={(e) => {
                      setMerchantName(e.target.value.slice(0, 32));
                      setQrStatus('idle');
                    }}
                    placeholder="E.g. Blue Bottle Cafe"
                    className="w-full bg-white/[0.02] border border-white/5 focus:border-gold/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-semibold font-mono uppercase">Amount (USD)</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">$</span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => {
                          setPaymentAmount(e.target.value);
                          setQrStatus('idle');
                        }}
                        placeholder="0.00"
                        className="w-full bg-white/[0.02] border border-white/5 focus:border-gold/30 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Invoice Reference */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-gray-400 font-semibold font-mono uppercase">Invoice Reference ID</label>
                    <input
                      type="text"
                      value={invoiceId}
                      onChange={(e) => {
                        setInvoiceId(e.target.value.toUpperCase().slice(0, 16));
                        setQrStatus('idle');
                      }}
                      placeholder="INV-XXXX"
                      className="w-full bg-white/[0.02] border border-white/5 focus:border-gold/30 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Quick presets */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-gray-500 font-mono uppercase block">Merchant Presets</span>
                  <div className="flex gap-2">
                    {[
                      { name: 'Hotel Ritz', price: '450.00' },
                      { name: 'Tesla Supercharger', price: '32.50' },
                      { name: 'Gucci Flagship', price: '1250.00' },
                    ].map((item) => (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => {
                          setMerchantName(item.name);
                          setPaymentAmount(item.price);
                          setInvoiceId(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                          setQrStatus('idle');
                        }}
                        className="flex-1 bg-white/5 border border-white/5 hover:border-gold/30 hover:bg-white/10 rounded-lg py-1.5 px-2 text-[9px] text-gray-400 hover:text-white font-mono transition-all truncate cursor-pointer"
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate Action Button */}
                <button
                  type="button"
                  onClick={() => {
                    setQrStatus('idle');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gold hover:bg-gold-light text-black font-extrabold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <QrCode size={13} /> Update QR Terminal Invoice
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Small badge of security compliance */}
        <div className="mt-6 flex items-center gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <Shield className="text-emerald-400" size={16} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Security Standards</span>
            <span className="text-[10px] text-gray-500">PCI-DSS compliance level 1 with biometric cold keys.</span>
          </div>
        </div>

      </div>

      {/* Luxurious Order & Laser Engraving Modal */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto"
            id="engrave-modal-overlay"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-4xl bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden flex flex-col md:flex-row gap-8"
              id="engrave-modal-body"
            >
              {/* Left Column: Majestic Laser Engraving Display */}
              <div className="flex-1 flex flex-col items-center justify-center relative bg-[#040405] border border-white/5 rounded-2xl p-6 overflow-hidden min-h-[340px]">
                {/* Micro laser matrix layout or glowing targets */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.03),transparent_70%)] pointer-events-none" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] opacity-45 pointer-events-none" />

                {/* Laser Head calibration/warning labels */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[8px] font-mono text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" /> CNC_LASER_SYS: ACTIVE
                  </span>
                  <span>SPECTRA POWER: 24.5KW</span>
                  <span>CAL_OFFSET: X+0.04 Y-0.01</span>
                </div>

                {/* The card simulation inside engraving machine */}
                <div className="relative w-full max-w-[340px] h-[210px] flex items-center justify-center mt-4">
                  {/* Glowing perimeter frame */}
                  <div className="absolute -inset-2.5 rounded-3xl border border-gold/10 bg-gold/[0.01] pointer-events-none" />

                  {/* Card Front face replica */}
                  <div className={`w-full h-full rounded-2xl p-6 flex flex-col justify-between overflow-hidden relative shadow-2xl ${cardDetails.class}`}>
                    <div className="card-sheen" />
                    
                    {/* Exquisite pattern backing */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.05),transparent_60%)] pointer-events-none" />
                    
                    {/* Header */}
                    <div className="flex items-start justify-between relative z-10">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-mono tracking-widest uppercase opacity-75">
                          {cardDetails.level}
                        </span>
                        <span className="text-base font-bold tracking-tight mt-0.5">Dilocash</span>
                      </div>
                      <div className="w-8 h-7 rounded-md bg-gradient-to-br from-zinc-300 to-zinc-500 opacity-30 shadow flex items-center justify-center">
                        <Cpu size={18} className="text-zinc-900" />
                      </div>
                    </div>

                    {/* Laser line overlay sweeps across card zone during engraving */}
                    {engraveStatus === 'engraving' && (
                      <motion.div
                        animate={{ 
                          top: ['40%', '82%', '40%'],
                        }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444,0_0_4px_#f59e0b] z-20 pointer-events-none"
                      >
                        {/* Laser focus point spark */}
                        <div className="absolute left-[30%] -translate-y-1/2 w-4 h-4 bg-amber-400 rounded-full blur-[2px] animate-pulse" />
                        <div className="absolute left-[30%] -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" />
                      </motion.div>
                    )}

                    {/* Custom engraved text area */}
                    <div className="mt-auto relative z-10 text-left">
                      <span className="text-[7px] uppercase tracking-wider opacity-60 font-mono">
                        {engraveStatus === 'complete' ? 'PERMANENTLY ENGRAVED' : 'ENGRAVING PREVIEW'}
                      </span>
                      <div className="relative h-8 flex items-center">
                        <span className="text-sm font-mono font-bold tracking-wider uppercase">
                          {engravedText || ' '}
                        </span>
                        {engraveStatus === 'engraving' && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity }}
                            className="inline-block w-2 h-4 bg-amber-400 ml-1 shadow-[0_0_8px_#f59e0b]"
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom metallic code specs */}
                    <div className="flex justify-between items-end mt-2 opacity-50 text-[8px] font-mono">
                      <span>LIMIT: ${limit.toLocaleString()} USD</span>
                      <span>{theme === 'gold' ? '24K PLATED' : theme === 'burner' ? 'RECYCLABLE' : 'MATTE TITANIUM'}</span>
                    </div>

                    {/* Sealing glass-like finish sweep */}
                    {engraveStatus === 'sealing' && (
                      <motion.div
                        initial={{ left: '-100%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-y-0 w-1/4 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 pointer-events-none z-10"
                      />
                    )}
                  </div>
                </div>

                {/* Calibration Status Text */}
                <div className="mt-6 text-center space-y-1.5 w-full max-w-[280px]">
                  <div className="flex items-center justify-between text-[10px] font-mono text-gray-400 uppercase">
                    <span>
                      {engraveStatus === 'calibrating' && '🤖 Calibrating CNC Laser...'}
                      {engraveStatus === 'engraving' && '⚡ Laser Engraving Custom Metal...'}
                      {engraveStatus === 'sealing' && '💎 Applying Protective Seal...'}
                      {engraveStatus === 'complete' && '👑 Custom Alloy Complete'}
                    </span>
                    <span className="font-bold text-gold">{Math.round(engraveProgress)}%</span>
                  </div>

                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${engraveStatus === 'complete' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-gold shadow-[0_0_8px_#f59e0b]'}`}
                      style={{ width: `${engraveProgress}%` }}
                    />
                  </div>

                  <p className="text-[9px] text-gray-500 font-mono text-center pt-1.5 leading-relaxed">
                    {engraveStatus === 'calibrating' && 'Positioning solid alloy backing to mechanical laser mount...'}
                    {engraveStatus === 'engraving' && `Vaporizing surface layers to write signature "${cardHolder || 'NAME'}"`}
                    {engraveStatus === 'sealing' && 'Applying anti-scratch protective polymer overlay under high temperature...'}
                    {engraveStatus === 'complete' && 'Card alloy structured, cryptographic cold-keys mapped successfully.'}
                  </p>
                </div>
              </div>

              {/* Right Column: Elaborate Invoice or Digital Security Receipt */}
              <div className="flex-1 flex flex-col justify-between text-left">
                <div className="space-y-5">
                  <div className="flex justify-between items-start border-b border-white/10 pb-4">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-gold tracking-widest block uppercase">
                        DILOCASH DIGITAL LEDGER
                      </span>
                      <h4 className="text-white text-xl font-bold mt-1 font-sans">
                        Physical Card Receipt
                      </h4>
                    </div>
                    <div className="text-right font-mono text-[9px] text-gray-400">
                      <span>DATE: {new Date().toLocaleDateString()}</span>
                      <br />
                      <span>TIME: 14:55:00 UTC</span>
                    </div>
                  </div>

                  {/* Receipt items list */}
                  <div className="space-y-4 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">CARDHOLDER ID</span>
                      <span className="text-white font-bold text-right truncate max-w-[200px]">
                        {(cardHolder || 'ALEXANDER CHEN').toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">BASE ALLOY MATERIAL</span>
                      <span className="text-white font-bold text-right uppercase">
                        {theme === 'gold' ? '24K Gold-Plated Heavy Brass' : theme === 'burner' ? 'Rose Recyclable Carbon Fiber' : 'Solid Matte Aerospace Titanium'}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">DAILY TRANSACTION LIMIT</span>
                      <span className="text-gold font-bold text-right">
                        ${limit.toLocaleString()} USD
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">SECURITY PROTOCOL</span>
                      <span className="text-white font-bold text-right">
                        Level 1 Biometric Enclave
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">CARD TYPE</span>
                      <span className="text-white font-bold text-right uppercase">
                        {cardDetails.level}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-white/5">
                      <span className="text-gray-500">DIGITAL DEPOSIT STATUS</span>
                      <span className="text-emerald-400 font-bold text-right">
                        VERIFIED SECURE
                      </span>
                    </div>

                    {/* Detailed Invoice Fees */}
                    <div className="space-y-1 bg-white/[0.02] border border-white/5 rounded-xl p-3 mt-3 text-[11px] leading-relaxed">
                      <div className="flex justify-between">
                        <span className="text-gray-400">CNC Laser Engraving Fee</span>
                        <span className="text-white">$149.00 USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Insured FedEx Courier</span>
                        <span className="text-white">$35.00 USD</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Founders Membership Tier</span>
                        <span className="text-emerald-400">-$184.00 USD (Waived)</span>
                      </div>
                      <div className="border-t border-white/5 pt-1.5 mt-1.5 flex justify-between font-bold text-xs">
                        <span className="text-white font-sans uppercase">Total Amount Due</span>
                        <span className="text-gold font-sans">$0.00 USD</span>
                      </div>
                    </div>

                    {/* Transaction security hash */}
                    <div className="bg-[#0c0c0e] border border-white/5 rounded-xl p-3 text-[9px] text-gray-500 leading-normal space-y-1">
                      <div className="font-bold text-gray-400 uppercase">Cryptographic Signature Receipt:</div>
                      <div className="font-mono text-gray-400 break-all text-[8px]">{receiptHash}</div>
                      <div className="text-[8px] leading-relaxed">
                        The digital signature verifies that the physical card's secure hardware chips are paired dynamically with on-device biometric cold-keys.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions bottom */}
                <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setIsApplyModalOpen(false)}
                    className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-bold text-xs font-mono uppercase tracking-widest transition-all text-center cursor-pointer border border-white/5"
                  >
                    Close Preview
                  </button>
                  <button
                    type="button"
                    disabled={engraveStatus !== 'complete'}
                    onClick={handleDownloadSlip}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs font-mono uppercase tracking-widest transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                      engraveStatus === 'complete'
                        ? 'bg-gold hover:bg-gold-light text-black shadow-lg shadow-gold/10'
                        : 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Download size={13} /> Download Slip
                  </button>
                </div>
              </div>

              {/* Close corner absolute button */}
              <button
                type="button"
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              >
                <XCircle size={18} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
