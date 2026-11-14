import React, { useState } from 'react';
import type { HoodieItem } from '../data/products';
import { HOODIE_COLLECTION } from '../data/products';
import { ProceduralHoodie } from './ProceduralHoodie';
import { ArrowUpRight } from 'lucide-react';

interface CollectionsPageProps {
  onSelectHoodie: (item: HoodieItem) => void;
  onNavigateToCustom: () => void;
  products?: HoodieItem[];
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  onSelectHoodie,
  onNavigateToCustom,
  products = HOODIE_COLLECTION,
}) => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const onePieceItems = products.filter((i) => i.series === 'ONE-PIECE');
  const jjkItems = products.filter((i) => i.series === 'JJK');
  const berserkItems = products.filter((i) => i.series === 'BERSERK');
  const dbsItems = products.filter((i) => i.series === 'DBS');

  const categories = [
    {
      id: 'one-piece',
      title: 'ONE PIECE — LIBERATION ARCHIVE',
      subtitle: 'SUN GOD NIKA, STRAW HAT JOLLY ROGER & ROOM AMBUSH DISCHARGE',
      items: onePieceItems,
      desc: 'Formulations drawn from the Drums of Liberation mythos, Trafalgar Law spatial Room boundaries, and the iconic Straw Hat Jolly Roger.',
    },
    {
      id: 'jjk',
      title: 'JUJUTSU KAISEN — CURSED DOMAIN',
      subtitle: 'CURSED ENERGY DISCHARGE & VOID HORIZON SILHOUETTES',
      items: jjkItems,
      desc: 'Formulations inspired by Malevolent Shrine bone lattices, Limitless Ocular Singularity, and Sukuna thermal pyroclastic flame discharges.',
    },
    {
      id: 'berserk',
      title: 'BERSERK — ECLIPSE RELICS',
      subtitle: 'RAW BLACK IRON OXIDE & SACRIFICE BRAND BLEED ARTIFACTS',
      items: berserkItems,
      desc: 'Monumental dark fantasy silhouettes featuring Dragonslayer stenciling, Femto avian geometry, and the Brand of Sacrifice bleed sigil.',
    },
    {
      id: 'dbs',
      title: 'DRAGON BALL SUPER — HAKAI & GODHOOD',
      subtitle: 'AUTONOMOUS KI EMISSIONS & TOTAL DESTRUCTION SPHERES',
      items: dbsItems,
      desc: 'Primal aura manifestations, autonomous silver ki heat ripples, and spheres of total molecular destruction in rich violet discharge.',
    },
  ];

  const visibleCategories =
    activeTab === 'all'
      ? categories
      : categories.filter((c) => c.id === activeTab);

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-20 max-w-7xl mx-auto font-sans space-y-16 sm:space-y-24">
      {/* Editorial Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block">
          CURATED ANIME ANTHOLOGY
        </span>
        <h1 className="text-3xl sm:text-5xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
          THE ARCHIVE COLLECTIONS
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-sans leading-relaxed">
          Garments categorized by anime lore — featuring One Piece, Jujutsu Kaisen, Berserk, and Dragon Ball Super. Crafted from heavyweight 100% cotton fleece with original back and front graphics.
        </p>

        {/* Tab Filters */}
        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                : 'text-[var(--text-secondary)] border border-[var(--border-hairline)]'
            }`}
          >
            ALL ARCHIVES ({products.length})
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveTab(c.id)}
              className={`px-3 py-1.5 text-xs font-mono tracking-wider rounded-lg transition-all ${
                activeTab === c.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                  : 'text-[var(--text-secondary)] border border-[var(--border-hairline)]'
              }`}
            >
              {c.id.toUpperCase()} ({c.items.length})
            </button>
          ))}
        </div>
      </div>

      {/* Category Chapters */}
      {visibleCategories.map((cat, catIdx) => (
        <section key={cat.id} className="space-y-6 sm:space-y-8 pt-10 border-t border-[var(--border-hairline)]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-3 sm:gap-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)]">
                SERIES 0{catIdx + 1}
              </span>
              <h2 className="text-xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                {cat.title}
              </h2>
              <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider mt-1">
                {cat.subtitle}
              </p>
            </div>
            <p className="text-xs text-[var(--text-muted)] max-w-md md:text-right font-sans">
              {cat.desc}
            </p>
          </div>

          {/* Garments in this Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {cat.items.map((hoodie) => (
              <button
                key={hoodie.id}
                type="button"
                onClick={() => onSelectHoodie(hoodie)}
                className="group cursor-pointer flex flex-col items-center justify-center p-3 transition-all duration-500 text-left bg-transparent border-0 focus:outline-none"
              >
                <div className="w-full aspect-square relative flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-108">
                    <ProceduralHoodie
                      colorKey={hoodie.defaultColor}
                      graphicType={hoodie.graphicType}
                      view="back"
                      size="92%"
                      showBacklight={true}
                      hasFrontDesign={hoodie.hasFrontDesign}
                    />
                  </div>

                  {hoodie.hasFrontDesign && (
                    <span className="absolute top-2 left-2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm">
                      FRONT + BACK
                    </span>
                  )}
                </div>

                <div className="mt-4 text-center space-y-1 w-full">
                  <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase truncate">
                    {hoodie.name}
                  </h4>
                  <div className="text-xs font-mono text-[var(--text-secondary)] tabular-nums">
                    ${hoodie.price}.00
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}

      {/* Custom Hoodies Studio Banner */}
      <section className="p-6 sm:p-14 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-6 sm:gap-8">
        <div className="space-y-2 sm:space-y-3 max-w-xl text-left">
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--accent)] font-bold">
            CUSTOM HOODIES — 1-OF-1 COMMISSIONS
          </span>
          <h2 className="text-xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
            COMMISSION YOUR OWN ANIME HOODIE
          </h2>
          <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
            Upload custom artwork or create custom concepts with our curated color swatches and garment placement options.
          </p>
        </div>
        <button
          type="button"
          onClick={onNavigateToCustom}
          className="w-full md:w-auto py-3.5 sm:py-4 px-8 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs font-mono tracking-[0.25em] uppercase font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-xl whitespace-nowrap focus:outline-none"
        >
          <span>OPEN CUSTOM STUDIO</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
