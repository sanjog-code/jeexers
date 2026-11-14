import React, { useState } from 'react';
import type { CartEntry } from '../types';
import { ProceduralHoodie } from './ProceduralHoodie';
import { ACTIVE_COUPONS } from '../data/products';
import type { CouponCode } from '../data/products';
import { ArrowLeft, CheckCircle2, Lock, ShieldCheck, Tag, Sparkles, Check, AlertCircle } from 'lucide-react';

interface CheckoutSpaceProps {
  cart: CartEntry[];
  onBack: () => void;
  onOrderSuccess: () => void;
}

export const CheckoutSpace: React.FC<CheckoutSpaceProps> = ({
  cart,
  onBack,
  onOrderSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('United States');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Coupon & Email Signup State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponCode | null>(null);
  const [couponError, setCouponError] = useState('');
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [emailUnlockedSuccess, setEmailUnlockedSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.hoodie.price * item.quantity, 0);
  const discountAmount = appliedCoupon ? Math.round((subtotal * appliedCoupon.discountPercent) / 100) : 0;
  const shipping = subtotal > 0 ? 0 : 0; // Complimentary worldwide shipping
  const total = Math.max(0, subtotal - discountAmount + shipping);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCodeInput.trim().toUpperCase();
    const found = ACTIVE_COUPONS.find((c) => c.code === clean);
    if (found) {
      setAppliedCoupon(found);
      setCouponError('');
    } else {
      setCouponError("Invalid code. Sign up below to unlock 'RELEASE15' (15% OFF)!");
    }
  };

  const handleEmailSignupUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscriberEmail.trim() || !subscriberEmail.includes('@')) return;

    // Apply the 15% discount code automatically
    const releaseCoupon = ACTIVE_COUPONS.find((c) => c.code === 'RELEASE15') || {
      code: 'RELEASE15',
      discountPercent: 15,
      description: '15% Off - Release List Subscriber Exclusive',
    };

    setAppliedCoupon(releaseCoupon);
    setCouponCodeInput('RELEASE15');
    if (!email) {
      setEmail(subscriberEmail);
    }
    setEmailUnlockedSuccess(true);
  };

  const handleFillTestCredentials = () => {
    setEmail('atelier.collector@thejeexers.com');
    setName('Sanjog Shibuya');
    setAddress('5-7-2 Minami-Aoyama, Minato-ku');
    setCity('Tokyo');
    setZip('107-0062');
    setCountry('Japan');
    setCardNumber('4242 •••• •••• 4242');
    setCardExpiry('12 / 28');
    setCardCvc('842');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsConfirmed(true);
      const generatedId = `JXR-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      onOrderSuccess();
    }, 1800);
  };

  if (isConfirmed) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-16 max-w-2xl mx-auto flex flex-col items-center justify-center text-center space-y-8 font-sans">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 font-bold">
            TRANSACTION CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-4xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
            COMMISSION REGISTERED
          </h1>
          <p className="text-xs font-mono text-[var(--text-secondary)]">
            ORDER ID: <span className="text-[var(--text-primary)] font-bold">{orderId}</span>
          </p>
        </div>

        {/* Dispatch Order Receipt */}
        <div className="w-full p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-left font-mono space-y-4 text-xs">
          <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
            <span className="text-[var(--text-secondary)] uppercase">DISPATCH TO</span>
            <span className="text-[var(--text-primary)] font-bold">{name || 'Client'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
            <span className="text-[var(--text-secondary)] uppercase">DESTINATION</span>
            <span className="text-[var(--text-primary)]">{address || '5-7-2 Minami-Aoyama'}, {city || 'Tokyo'}</span>
          </div>
          <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
            <span className="text-[var(--text-secondary)] uppercase">PAYMENT METHOD</span>
            <span className="text-emerald-400 font-bold">TEST CARD 4242 ($0 REAL CHARGED)</span>
          </div>
          <div className="flex justify-between items-center pt-1 text-sm font-bold">
            <span className="text-[var(--text-secondary)] uppercase">SETTLED TOTAL</span>
            <span className="text-[var(--text-primary)] tabular-nums">${total}.00 USD</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="py-4 px-8 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity"
        >
          RETURN TO STOREFRONT
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-16 max-w-7xl mx-auto font-sans">
      {/* Return to storefront */}
      <div className="mb-6">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-mono tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase flex items-center space-x-2 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO STORE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
        {/* Left: Clean Form */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-1">
              CHECKOUT
            </span>
            <h1 className="text-2xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              SHIPPING & PAYMENT
            </h1>
          </div>

          {/* Test Mode Notification */}
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-wider block">
                TEST DEMO SANDBOX
              </span>
              <p className="text-[11px] font-mono text-amber-200/80">
                Card charges are simulated. No actual financial transactions are created.
              </p>
            </div>
            <button
              type="button"
              onClick={handleFillTestCredentials}
              className="py-2 px-3 text-[10px] font-mono tracking-wider uppercase font-bold bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              AUTO-FILL TEST DATA
            </button>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-8">
            {/* Step 1: Shipping Destination */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold border-b border-[var(--border-hairline)] pb-2">
                01. SHIPPING ADDRESS
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="collector@domain.com"
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      FULL NAME
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      COUNTRY / REGION
                    </label>
                    <input
                      type="text"
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                    STREET ADDRESS
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Atelier Street, Suite 4B"
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      CITY
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Tokyo"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      POSTAL CODE
                    </label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder="107-0062"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Payment Protocol */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-2">
                <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold">
                  02. PAYMENT INFORMATION
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-BIT ENCRYPTION
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase">
                      CARD NUMBER
                    </label>
                    <span className="text-[9px] font-mono text-neutral-400">TEST: 4242 •••• •••• 4242</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      EXPIRATION
                    </label>
                    <input
                      type="text"
                      required
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      placeholder="MM / YY"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase mb-1">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isProcessing || cart.length === 0}
              className="w-full py-4 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2 focus:outline-none shadow-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isProcessing ? 'AUTHORIZING SIMULATED PAYMENT...' : `CONFIRM ORDER ($${total}.00)`}</span>
            </button>
          </form>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-6">
          <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold border-b border-[var(--border-hairline)] pb-3">
            BAG SUMMARY ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h3>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map((entry) => (
              <div key={entry.id} className="flex items-center space-x-3.5 pb-3 border-b border-[var(--border-hairline)]">
                <div className="w-12 h-12 flex-shrink-0 relative flex items-center justify-center">
                  <ProceduralHoodie
                    colorKey={entry.color}
                    graphicType={entry.hoodie.graphicType}
                    view="back"
                    folded={true}
                    size="100%"
                    showBacklight={false}
                  />
                </div>
                <div className="flex-1 min-w-0 text-xs font-mono">
                  <div className="font-bold text-[var(--text-primary)] uppercase truncate">
                    {entry.hoodie.name}
                  </div>
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase mt-0.5">
                    SIZE {entry.size} • {entry.color.toUpperCase()} • QTY {entry.quantity}
                  </div>
                </div>
                <div className="text-xs font-mono font-bold text-[var(--text-primary)] tabular-nums">
                  ${entry.hoodie.price * entry.quantity}.00
                </div>
              </div>
            ))}
          </div>

          {/* Coupon Code Input & Application */}
          <div className="space-y-3 pt-3 border-t border-[var(--border-hairline)] font-mono text-xs">
            <div className="flex justify-between items-center">
              <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase flex items-center gap-1">
                <Tag className="w-3 h-3 text-[var(--accent)]" />
                DISCOUNT COUPON CODE
              </span>
              {appliedCoupon && (
                <button
                  type="button"
                  onClick={() => {
                    setAppliedCoupon(null);
                    setCouponCodeInput('');
                  }}
                  className="text-[10px] text-red-400 hover:underline uppercase"
                >
                  Remove Code
                </button>
              )}
            </div>

            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => {
                  setCouponCodeInput(e.target.value);
                  setCouponError('');
                }}
                placeholder="PROMO CODE"
                className="flex-1 px-3.5 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono uppercase text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)]"
              />
              <button
                type="submit"
                className="py-2.5 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold text-xs uppercase hover:opacity-90 shrink-0"
              >
                APPLY
              </button>
            </form>

            {appliedCoupon && (
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  {appliedCoupon.code} APPLIED (-{appliedCoupon.discountPercent}%)
                </span>
                <span className="tabular-nums font-bold">-${discountAmount}.00</span>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-red-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {couponError}
              </p>
            )}
          </div>

          {/* Email Signup Exclusive Discount Banner */}
          {!appliedCoupon && (
            <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] space-y-3 font-sans">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-[var(--accent)] font-bold uppercase flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  WANT 15% OFF THIS ORDER?
                </span>
                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                  Join the <strong>Release List</strong> below to unlock code <span className="font-mono font-bold text-[var(--text-primary)]">RELEASE15</span>. Email subscribers get first access to drops, secret giveaways, and guaranteed pre-booking on upcoming anime editions.
                </p>
              </div>

              {emailUnlockedSuccess ? (
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  WELCOME! CODE 'RELEASE15' APPLIED (-15%).
                </div>
              ) : (
                <form onSubmit={handleEmailSignupUnlock} className="flex gap-2">
                  <input
                    type="email"
                    required
                    value={subscriberEmail}
                    onChange={(e) => setSubscriberEmail(e.target.value)}
                    placeholder="Enter email to unlock 15% off..."
                    className="flex-1 px-3 py-2 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="py-2 px-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-[11px] uppercase tracking-wider shrink-0 transition-colors"
                  >
                    UNLOCK 15%
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)] text-xs font-mono">
            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>SUBTOTAL</span>
              <span className="text-[var(--text-primary)] tabular-nums font-bold">${subtotal}.00</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>DISCOUNT ({appliedCoupon.code})</span>
                <span className="tabular-nums">-${discountAmount}.00</span>
              </div>
            )}

            <div className="flex justify-between text-[var(--text-secondary)]">
              <span>WORLDWIDE FREIGHT</span>
              <span className="text-emerald-400 font-bold">COMPLIMENTARY</span>
            </div>
            <div className="flex justify-between text-sm font-bold pt-2 border-t border-[var(--border-hairline)]">
              <span className="text-[var(--text-primary)]">TOTAL</span>
              <span className="text-[var(--text-primary)] tabular-nums">${total}.00 USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
