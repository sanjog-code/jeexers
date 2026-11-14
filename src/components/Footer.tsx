import React, { useState } from 'react';
import type { PageView } from '../types';
import { ArrowUpRight, Check, X, Shield, Truck, RefreshCw, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSelectSeries?: (series: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectSeries }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modalTopic, setModalTopic] = useState<{ title: string; content: string } | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  const handleSeriesClick = (series: string) => {
    if (onSelectSeries) {
      onSelectSeries(series);
    }
    onNavigate('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openInfoModal = (title: string, content: string) => {
    setModalTopic({ title, content });
  };

  return (
    <footer className="w-full bg-[var(--bg-canvas)] border-t border-[var(--border-hairline)] pt-16 sm:pt-20 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
        {/* Top Section: Newsletter Dispatch */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-end pb-12 border-b border-[var(--border-hairline)]">
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block">
              NEWSLETTER
            </span>
            <h2 className="text-2xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase leading-snug">
              JOIN THE RELEASE LIST.
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans max-w-xl leading-relaxed">
              Get notified when new anime drops and custom hoodie commissions open. No spam, ever.
            </p>
          </div>

          <div className="lg:col-span-5">
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="flex-1 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors"
              />
              <button
                type="submit"
                className="py-3 px-5 sm:px-6 text-xs font-mono uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 focus:outline-none shrink-0"
              >
                {subscribed ? (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Check className="w-3.5 h-3.5" />
                    <span>SUBSCRIBED</span>
                  </span>
                ) : (
                  <span>SUBSCRIBE</span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Directory Grid with 100% Functional Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-xs font-sans">
          {/* Column 1: Anime Series Direct Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              ANIME SERIES
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() => handleSeriesClick('ONE-PIECE')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>One Piece Collection</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSeriesClick('JJK')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Jujutsu Kaisen</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSeriesClick('BERSERK')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Berserk Eclipse</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleSeriesClick('DBS')}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center justify-between w-full"
                >
                  <span>Dragon Ball Super</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('bespoke');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center justify-between w-full text-[var(--accent)] font-semibold pt-1"
                >
                  <span>Custom Bespoke Lab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Navigation Pages */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              EXPLORE
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('store');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Storefront (4×4 Vault)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('collections');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Curated Collections
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('bespoke');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Design Custom Hoodie
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('studio');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-[var(--text-primary)] transition-colors text-left"
                >
                  Studio & Craft Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Quality & Sizing Info (Interactive Modals) */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              PRODUCT QUALITY
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      '500 GSM Heavyweight French Terry',
                      'Our hoodies are constructed from custom-milled 500 GSM 100% organic cotton loopback French terry. This provides substantial warmth, a structured boxy drape, and longevity without synthetic polyester blends.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  500 GSM Heavyweight Fabric
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Garment Dye & Enzyme Wash',
                      'Each piece is dyed in small batches and enzyme-washed for a broken-in, vintage drape and velvety softness from the first wear. Pre-shrunk to prevent size loss in standard cold washing.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  Pigment Dye & Soft Wash
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Cowl Hood & Oversized Fit',
                      'Featuring a double-layered seamless cowl hood that stands structured around the neck, drop shoulders, and an oversized boxy drape designed after modern streetwear proportions.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  Boxy Oversized Fit Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Thermal Print Permanence',
                      'Discharge printing and high-density screen inks are thermally cured at 180°C. The graphic becomes part of the cotton weave, resisting cracking, peeling, and fading through repeated wash cycles.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  Print Durability & Care
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Customer Care & Shipping Policies */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              CUSTOMER SUPPORT
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Worldwide Express Shipping',
                      'All orders include complimentary express worldwide tracking via DHL / FedEx. Orders are prepared and dispatched within 2-3 business days with live email tracking updates.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <Truck className="w-3 h-3 text-emerald-400" />
                  <span>Free Express Shipping</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      '14-Day Returns & Exchanges',
                      'If the size or drape is not ideal, you can initiate a hassle-free exchange or return within 14 days of delivery. Garments must be unworn and in original condition with tags intact.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>14-Day Fit Guarantee</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Secure Encrypted Checkout',
                      'All transactions use industry-standard 256-bit TLS encryption. In demo mode, our simulated sandbox allows you to test the full ordering flow safely without any real monetary charges.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3 h-3 text-emerald-400" />
                  <span>Secure 256-Bit Checkout</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Frequently Asked Questions',
                      'Q: How does sizing fit?\nA: True to oversized streetwear fit. If you prefer a regular fit, consider sizing down.\n\nQ: How do I wash my hoodie?\nA: Wash inside-out in cold water and hang dry to preserve fabric weight and pigment vibrancy.\n\nQ: Are bespoke hoodies returnable?\nA: Custom 1-of-1 bespoke creations are crafted to order and covered by our quality guarantee.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5 text-[var(--accent)] font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Help & FAQ</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase pt-8 border-t border-[var(--border-hairline)]">
          <div>
            © 2026 THE JEEXERS. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6 text-[var(--text-secondary)]">
            <span>PREMIUM HEAVYWEIGHT HOODIES</span>
            <span>SHIPPED WORLDWIDE</span>
          </div>
        </div>
      </div>

      {/* Interactive Information & FAQ Modal */}
      {modalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalTopic(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-lg bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 z-10 space-y-4 shadow-2xl">
            <div className="flex justify-between items-start">
              <h3 className="text-base sm:text-lg font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                {modalTopic.title}
              </h3>
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="p-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed whitespace-pre-line border-t border-[var(--border-hairline)] pt-4">
              {modalTopic.content}
            </div>
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setModalTopic(null)}
                className="py-2 px-5 text-xs font-mono uppercase font-bold rounded-lg bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90"
              >
                GOT IT
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
