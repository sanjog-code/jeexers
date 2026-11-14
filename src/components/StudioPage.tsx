import React from 'react';
import { ShieldCheck, Sparkles, Feather, ArrowUpRight } from 'lucide-react';

interface StudioPageProps {
  onNavigateToCustom?: () => void;
}

export const StudioPage: React.FC<StudioPageProps> = ({ onNavigateToCustom }) => {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-12 sm:py-20 max-w-4xl mx-auto flex flex-col font-sans space-y-16">
      {/* Hero Header */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block">
          ABOUT THE JEEXERS
        </span>
        <h1 className="text-3xl sm:text-5xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase leading-tight">
          BUILT FOR ANIME CULTURE. <br />CRAFTED TO LAST.
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed pt-2">
          THE JEEXERS is an independent apparel label founded on a simple principle: anime apparel should be as thoughtfully designed and well-constructed as luxury streetwear.
        </p>
      </div>

      {/* Core Pillars: Important & Only Important Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 pt-4">
        {/* Pillar 1 */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)]">
            <Feather className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-mono font-bold uppercase text-[var(--text-primary)]">
            HEAVYWEIGHT COTTON FLEECE
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            Constructed from pure 100% heavyweight cotton fleece. Designed with an oversized boxy silhouette, dropped shoulders, and a structured double-layer hood that stands tall.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-mono font-bold uppercase text-[var(--text-primary)]">
            PERMANENT SOFT-FEEL PRINTING
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            We reject stiff, glossy plastic vinyl transfers. Our original artwork is applied with soft discharge inks and high-density screen pigmentation that breathes with the fabric and will not crack or peel.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] flex items-center justify-center text-[var(--text-primary)]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-mono font-bold uppercase text-[var(--text-primary)]">
            1-OF-1 CUSTOM COMMISSIONS
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            Beyond our curated anime collections, our Custom Studio allows you to commission personal custom hoodies with your chosen artwork, specific placements, and tailored colorways.
          </p>
        </div>
      </div>

      {/* Practical Garment Care & Longevity */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-4">
        <h3 className="text-xs font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold">
          GARMENT CARE & SIZING ESSENTIALS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
          <div className="space-y-2">
            <div className="font-mono text-[11px] text-[var(--text-primary)] uppercase font-semibold">
              WASH & PRESERVATION PROTOCOL
            </div>
            <p>
              Machine wash inside-out in cold water with similar colors. Hang dry in shade. Avoid high-heat tumble dryers to maintain the rich garment drape and fabric softness over years.
            </p>
          </div>
          <div className="space-y-2">
            <div className="font-mono text-[11px] text-[var(--text-primary)] uppercase font-semibold">
              FIT & SIZING RECOMMENDATION
            </div>
            <p>
              Engineered with a relaxed, modern streetwear boxy fit. Order your standard size for the intended oversized look, or size down if you prefer a classic tailored fit.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Commission Call to Action */}
      {onNavigateToCustom && (
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-hero font-bold uppercase text-[var(--text-primary)]">
              WANT A CUSTOM 1-OF-1 ANIME HOODIE?
            </h4>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Work with our custom studio to bring your own artwork or favorite scene to life.
            </p>
          </div>
          <button
            type="button"
            onClick={onNavigateToCustom}
            className="py-3 px-6 text-xs font-mono uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity flex items-center gap-1.5 shrink-0"
          >
            <span>OPEN CUSTOM STUDIO</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Contact & Support Sign-off */}
      <div className="pt-6 border-t border-[var(--border-hairline)] text-center space-y-2">
        <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] block">
          DIRECT INQUIRIES & SUPPORT
        </span>
        <div className="text-xs font-mono text-[var(--text-primary)]">
          support@thejeexers.com • bespoke@thejeexers.com
        </div>
      </div>
    </div>
  );
};
