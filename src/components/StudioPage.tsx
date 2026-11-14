import React from 'react';

export const StudioPage: React.FC = () => {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-20 max-w-4xl mx-auto flex flex-col justify-center text-center space-y-12">
      <div className="space-y-4">
        <span className="text-xs font-mono tracking-[0.3em] uppercase text-[var(--text-muted)]">
          STUDIO PHILOSOPHY
        </span>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] uppercase leading-tight">
          SCULPTURAL DRAPE. <br />HAND-PAINTED REVERENCE.
        </h1>
      </div>

      <div className="max-w-2xl mx-auto space-y-6 text-sm sm:text-base text-[var(--text-secondary)] font-sans leading-relaxed">
        <p>
          Each hoodie is constructed from custom-milled 500GSM Japanese loopback French terry. We design for an exaggerated boxy drape, seamless drop shoulders, and a heavy double-layered cowl hood.
        </p>
        <p>
          Original anime iconography is hand-brushed onto the garment using custom discharge inks and mineral pigments, ensuring the artwork breathes with the cotton fibers rather than sitting as a stiff plastic transfer.
        </p>
      </div>

      <div className="pt-6 grid grid-cols-3 gap-8 max-w-lg mx-auto border-t border-[var(--border-hairline)] font-mono text-xs uppercase tracking-widest text-[var(--text-muted)]">
        <div>500GSM COTTON</div>
        <div>TOKYO ATELIER</div>
        <div>PERMANENT CURE</div>
      </div>
    </div>
  );
};
