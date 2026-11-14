import React, { useState } from 'react';
import type { PageView } from '../types';
import { ArrowUpRight, Check, X, Shield, Truck, RefreshCw, HelpCircle, Cookie } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageView) => void;
  onSelectSeries?: (series: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSelectSeries, onOpenAdmin }) => {
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

  // Privacy Policy Content
  const privacyPolicyContent = `PRIVACY POLICY
Last updated: November 2026

At THE JEEXERS, we value your privacy and are committed to protecting your personal information.

1. INFORMATION WE COLLECT
When you purchase or commission a custom hoodie, we collect:
• Contact information (such as your name and email address)
• Shipping address for physical delivery
• Order specifications (size, color, chosen artwork)
• Payment details (processed securely via encrypted payment gateways; we do not store raw card credentials)

2. HOW WE USE YOUR INFORMATION
We only use your information to:
• Process, pack, and dispatch your order
• Provide live tracking updates and customer support
• Notify you of drops or order milestones if you opted into our release list

3. THIRD-PARTY SHARING
We never sell, rent, or trade your personal data. We share information only with trusted fulfillment carriers (such as DHL/FedEx) strictly to complete delivery.

4. DATA SECURITY & RETENTION
We maintain industry-standard physical and electronic safeguards to protect customer records. You may request data deletion or an export of your information at any time by contacting support.

5. CONTACT
For questions about our privacy practices, email support@thejeexers.com.`;

  // Cookie Policy Content
  const cookiePolicyContent = `COOKIE POLICY
Last updated: November 2026

THE JEEXERS uses minimal, essential cookies and browser local storage to provide a seamless browsing experience.

1. ESSENTIAL FUNCTIONALITY COOKIES
• Shopping Bag State: Storing your selected hoodies, colorways, and sizes so your cart is preserved between visits.
• Theme Preference: Remembering your preference for Obsidian (Dark) or Alabaster (Light) mode.
• Session Security: Maintaining authentication state during checkout or admin sessions.

2. ANALYTICS & PERFORMANCE
We may use lightweight, privacy-focused analytics to understand page loading performance, popular collections, and device compatibility. No cross-site advertising tracking cookies are deployed.

3. MANAGING YOUR PREFERENCES
You can clear or block cookies and local storage anytime through your browser settings. Note that disabling essential storage may reset your shopping bag and theme preferences.

4. CONTACT
For inquiries regarding our use of cookies, contact support@thejeexers.com.`;

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

        {/* Minimal Directory Grid: Clean 3-Column Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-xs font-sans">
          {/* Column 1: Anime Series Direct Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              ANIME COLLECTIONS
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
                  <span>Berserk</span>
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
                  <span>Custom Hoodies Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Customer Care & Sizing */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              CUSTOMER CARE & SIZING
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Boxy Oversized Fit & Sizing',
                      'All hoodies feature a boxy, modern streetwear silhouette with dropped shoulders and a structured double-layer hood.\n\n• True to size for a relaxed, oversized look.\n• For a standard or fitted look, we recommend sizing down one size.\n• Sizes available from S to XXL.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  Sizing & Fit Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Garment Care Instructions',
                      'To maintain garment shape and print clarity over years of wear:\n\n• Machine wash cold inside-out.\n• Use gentle detergent; avoid bleach or harsh fabric softeners.\n• Hang dry in shade. Avoid high-heat tumble drying.\n• If ironing is needed, iron inside-out on low heat and never directly over printed artwork.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left underline-offset-4 hover:underline"
                >
                  Garment Care Instructions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Worldwide Shipping & Delivery',
                      '• We offer tracked worldwide shipping on all orders.\n• Standard orders are dispatched within 2-3 business days.\n• Custom hoodie commissions are individually crafted and dispatched within 5-7 business days.\n• Live tracking numbers are emailed as soon as the package is handed to the courier.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <Truck className="w-3 h-3 text-emerald-400" />
                  <span>Shipping & Delivery</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      '14-Day Return & Exchange Policy',
                      'We want you to love your hoodie.\n\n• Returns or size exchanges are accepted within 14 days of delivery for unworn, unwashed items in original condition.\n• For custom 1-of-1 pieces, we review any fit or quality concerns directly to ensure you are 100% satisfied.\n• Reach out to support@thejeexers.com to start an exchange.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3 text-emerald-400" />
                  <span>14-Day Returns & Exchanges</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Support */}
          <div className="space-y-4">
            <h4 className="font-mono text-[10px] tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              LEGAL & SUPPORT
            </h4>
            <ul className="space-y-2.5 text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() => openInfoModal('Privacy Policy', privacyPolicyContent)}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => openInfoModal('Cookie Policy', cookiePolicyContent)}
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5"
                >
                  <Cookie className="w-3 h-3 text-[var(--text-muted)]" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() =>
                    openInfoModal(
                      'Frequently Asked Questions & Contact',
                      'CUSTOMER SUPPORT & INQUIRIES\n\n• Email: support@thejeexers.com\n• Hours: Monday – Friday, 9:00 AM – 6:00 PM\n• Custom Inquiries: bespoke@thejeexers.com\n\nWe respond to all order queries and custom requests within 24 hours.'
                    )
                  }
                  className="hover:text-[var(--text-primary)] transition-colors text-left flex items-center gap-1.5 text-[var(--accent)] font-medium"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Contact & Support</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase pt-8 border-t border-[var(--border-hairline)]">
          <div className="flex items-center gap-2">
            <span>© 2026 THE JEEXERS. ALL RIGHTS RESERVED.</span>
            {/* Subtle invisible admin shortcut for the store owner */}
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="opacity-0 hover:opacity-100 transition-opacity text-[8px] text-[var(--text-muted)] px-1"
                title="Atelier Admin"
              >
                [ADMIN]
              </button>
            )}
          </div>
          <div className="flex space-x-6 text-[var(--text-secondary)]">
            <span>PREMIUM HEAVYWEIGHT HOODIES</span>
            <span>SHIPPED WORLDWIDE</span>
          </div>
        </div>
      </div>

      {/* Interactive Modal for Policies & Care Guides */}
      {modalTopic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setModalTopic(null)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 z-10 space-y-4 shadow-2xl">
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
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
