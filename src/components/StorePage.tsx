import React, { useState, useMemo } from 'react';
import type { HoodieItem } from '../data/products';
import { HOODIE_COLLECTION } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import { SlidersHorizontal, Sparkles, Compass, Search, X, Tag, Layers } from 'lucide-react';

interface StorePageProps {
  onSelectHoodie: (item: HoodieItem) => void;
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
  products?: HoodieItem[];
}

export const StorePage: React.FC<StorePageProps> = ({
  onSelectHoodie,
  selectedSeries,
  onSeriesChange,
  products = HOODIE_COLLECTION,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSilhouette, setSelectedSilhouette] = useState<string>('ALL');
  const [selectedColor, setSelectedColor] = useState<string>('ALL');
  const [priceSort, setPriceSort] = useState<'default' | 'low-high' | 'high-low'>('default');

  // Dynamic Series Tabs based on active catalog
  const seriesTabs = useMemo(() => {
    const seriesSet = new Set(products.map((p) => p.series));
    return ['ALL', ...Array.from(seriesSet)];
  }, [products]);

  const colorOptions = ['ALL', 'onyx', 'bone', 'mud', 'charcoal', 'moss', 'crimson'];

  // Filter & Search Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // 1. Series Filter
        if (selectedSeries !== 'ALL' && item.series !== selectedSeries) return false;

        // 2. Silhouette Filter
        if (selectedSilhouette !== 'ALL' && item.silhouette !== selectedSilhouette) return false;

        // 3. Color Filter
        if (selectedColor !== 'ALL' && !item.availableColors.includes(selectedColor)) return false;

        // 4. Search Query (Matches Name, Series, Description, Tags)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchesName = item.name.toLowerCase().includes(q);
          const matchesSeries = item.series.toLowerCase().includes(q);
          const matchesDesc = (item.description || '').toLowerCase().includes(q);
          const matchesTags = item.tags && item.tags.some((t) => t.toLowerCase().includes(q));
          const matchesSilhouette = (item.silhouette || '').toLowerCase().includes(q);

          if (!matchesName && !matchesSeries && !matchesDesc && !matchesTags && !matchesSilhouette) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (priceSort === 'low-high') return a.price - b.price;
        if (priceSort === 'high-low') return b.price - a.price;
        return 0;
      });
  }, [products, selectedSeries, selectedSilhouette, selectedColor, searchQuery, priceSort]);

  // First 16 items for 4x4 Grid
  const grid16 = filteredProducts.slice(0, 16);
  // Showcase Pieces
  const showcasePieces = products.slice(0, 2);
  // Post-Showcase Items (items 16+)
  const postShowcasePieces = filteredProducts.slice(16);

  const quickSearchTags = ['oversized', 'cropped', 'slimfit', 'nika', 'gojo', 'shrine', 'brand'];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-16 max-w-7xl mx-auto font-sans space-y-12 sm:space-y-20">
      {/* ===================== TAG DISCOVERY SEARCH BAR ===================== */}
      <div className="w-full max-w-3xl mx-auto space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-4 top-3.5 sm:top-4 text-[var(--text-muted)]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by anime, design, tag, or silhouette (e.g. 'gojo', 'nika', 'cropped', 'oversized')..."
            className="w-full pl-11 sm:pl-12 pr-10 py-3.5 sm:py-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] shadow-sm transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 sm:top-4 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Quick Tag Recommendations */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase shrink-0 flex items-center gap-1">
            <Tag className="w-3 h-3" />
            TAGS:
          </span>
          {quickSearchTags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSearchQuery(t)}
              className={`px-2.5 py-1 rounded-full border transition-all shrink-0 ${
                searchQuery.toLowerCase() === t
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)] font-bold'
                  : 'bg-[var(--bg-surface)] border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== FILTER MATRIX BAR ===================== */}
      <div className="space-y-4 pb-6 border-b border-[var(--border-hairline)]">
        {/* Row 1: Series Filter */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3 h-3" />
              SERIES:
            </span>
            {seriesTabs.map((series) => (
              <button
                key={series}
                type="button"
                onClick={() => onSeriesChange(series)}
                className={`px-3 py-1.5 text-[11px] sm:text-xs font-mono tracking-wider rounded-lg transition-all shrink-0 ${
                  selectedSeries === series
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)] hover:border-[var(--border-subtle)]'
                }`}
              >
                {series}
              </button>
            ))}
          </div>

          {/* Color & Pricing Order */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start w-full md:w-auto gap-4 text-xs font-mono">
            {/* Colorway Swatches */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase mr-1">
                COLOR:
              </span>
              {colorOptions.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                    selectedColor === c
                      ? 'ring-2 ring-[var(--text-primary)] scale-110 border-transparent'
                      : 'border-[var(--border-subtle)] opacity-70 hover:opacity-100'
                  }`}
                  title={c.toUpperCase()}
                >
                  {c === 'ALL' ? (
                    <span className="text-[9px] font-bold text-[var(--text-primary)]">A</span>
                  ) : (
                    <span
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: HOODIE_COLORWAYS[c]?.hex || '#444' }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Price Sort */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                PRICE:
              </span>
              <select
                value={priceSort}
                onChange={(e) => setPriceSort(e.target.value as any)}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs font-mono text-[var(--text-primary)] focus:outline-none"
              >
                <option value="default">CURATED</option>
                <option value="low-high">LOW → HIGH</option>
                <option value="high-low">HIGH → LOW</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Silhouette Selection Tabs (Slimfit, Oversized, Cropped) */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none text-xs font-mono">
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
            <Layers className="w-3 h-3" />
            SILHOUETTE:
          </span>
          {[
            { id: 'ALL', label: 'ALL SILHOUETTES' },
            { id: 'oversized', label: 'OVERSIZED (BOXY)' },
            { id: 'slimfit', label: 'SLIM FIT (TAPERED)' },
            { id: 'cropped', label: 'CROPPED (HIGH WAIST)' },
          ].map((sil) => (
            <button
              key={sil.id}
              type="button"
              onClick={() => setSelectedSilhouette(sil.id)}
              className={`px-3 py-1 rounded-md text-[11px] uppercase tracking-wider transition-all shrink-0 ${
                selectedSilhouette === sil.id
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                  : 'text-[var(--text-secondary)] border border-[var(--border-hairline)] hover:border-[var(--border-subtle)]'
              }`}
            >
              {sil.label}
            </button>
          ))}
        </div>
      </div>

      {/* ===================== 4x4 ARCHITECTURAL GRID ===================== */}
      <div>
        <div className="flex justify-between items-end mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-1">
              CURATED MATRIX
            </span>
            <h2 className="text-xl sm:text-2xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              THE 4×4 COLLECTION
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            SHOWING {filteredProducts.length} DESIGNS
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] space-y-3">
            <div className="text-sm font-mono text-[var(--text-primary)] uppercase font-bold">
              NO DESIGNS FOUND MATCHING YOUR CRITERIA
            </div>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Try adjusting your search query, clearing silhouette filters, or switching anime series.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSilhouette('ALL');
                setSelectedColor('ALL');
                onSeriesChange('ALL');
              }}
              className="py-2 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs font-mono uppercase font-bold"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {grid16.map((hoodie, idx) => (
              <button
                key={hoodie.id}
                type="button"
                onClick={() => onSelectHoodie(hoodie)}
                className="group cursor-pointer relative flex flex-col items-center justify-center p-3 transition-all duration-500 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] text-left w-full bg-transparent border-0"
                aria-label={`Inspect ${hoodie.name} specimen 0${idx + 1}`}
              >
                {/* Silhouette Shape & Graphic View */}
                <div className="w-full aspect-square relative flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108">
                    <ProceduralHoodie
                      colorKey={hoodie.defaultColor}
                      graphicType={hoodie.graphicType as any}
                      customImage={hoodie.customArtworkUrl}
                      silhouette={hoodie.silhouette || 'oversized'}
                      customPosition={hoodie.graphicPosition}
                      view="back"
                      size="92%"
                      showBacklight={true}
                      hasFrontDesign={hoodie.hasFrontDesign}
                    />
                  </div>

                  {/* Top Badges: Silhouette + Dual-Sided */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                    <span className="text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm font-semibold">
                      {hoodie.silhouette || 'OVERSIZED'}
                    </span>
                    {hoodie.hasFrontDesign && (
                      <span className="text-[8px] font-mono tracking-wider uppercase px-1.5 py-0.5 rounded-full border border-[var(--border-hairline)] text-[var(--text-secondary)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm">
                        FRONT + BACK
                      </span>
                    )}
                  </div>
                </div>

                {/* Minimalist Product Label */}
                <div className="mt-4 text-center space-y-1 w-full">
                  <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    {hoodie.series}
                  </div>
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
        )}
      </div>

      {/* ===================== 2 BIG SHOWCASE PIECES ===================== */}
      <div className="pt-12 border-t border-[var(--border-hairline)] space-y-8 sm:space-y-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--accent)] font-bold">
            MONUMENTAL SHOWCASE EDITIONS
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-14">
          {showcasePieces.map((showcase, index) => (
            <div
              key={showcase.id}
              onClick={() => onSelectHoodie(showcase)}
              className="cursor-pointer group flex flex-col sm:flex-row items-center p-6 sm:p-12 rounded-3xl border border-[var(--border-hairline)] hover:border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-elevated)] transition-all duration-500"
            >
              <div className="w-full sm:w-1/2 aspect-square flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                <ProceduralHoodie
                  colorKey={showcase.defaultColor}
                  graphicType={showcase.graphicType as any}
                  customImage={showcase.customArtworkUrl}
                  silhouette={showcase.silhouette || 'oversized'}
                  customPosition={showcase.graphicPosition}
                  view="back"
                  size="100%"
                  showBacklight={true}
                  hasFrontDesign={showcase.hasFrontDesign}
                />
              </div>

              <div className="w-full sm:w-1/2 sm:pl-8 mt-6 sm:mt-0 space-y-3 sm:space-y-4 text-left">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)]">
                  FLAGSHIP PIECE 0{index + 1} • {showcase.silhouette?.toUpperCase() || 'OVERSIZED'}
                </div>
                <h3 className="text-xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  {showcase.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed line-clamp-3">
                  {showcase.description || 'Heavyweight 100% cotton fleece with high-density original graphic.'}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-mono text-[var(--text-primary)] font-bold tabular-nums">
                    ${showcase.price}.00
                  </span>
                  <span className="text-xs font-mono text-[var(--accent)] uppercase font-bold tracking-wider group-hover:underline">
                    INSPECT PIECE →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== POST-SHOWCASE EXTENSION: ADDITIONAL EDITIONS ===================== */}
      {postShowcasePieces.length > 0 && (
        <div className="pt-12 border-t border-[var(--border-hairline)] space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-1">
                LORE EXPANSION
              </span>
              <h2 className="text-xl sm:text-2xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-2">
                <Compass className="w-5 h-5 text-[var(--accent)]" />
                ADDITIONAL ATELIER EDITIONS
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {postShowcasePieces.length} ADDITIONAL PIECES
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
            {postShowcasePieces.map((hoodie) => (
              <button
                key={hoodie.id}
                type="button"
                onClick={() => onSelectHoodie(hoodie)}
                className="group cursor-pointer relative flex flex-col items-center justify-center p-3 transition-all duration-500 text-left w-full bg-transparent border-0 focus:outline-none"
                aria-label={`Inspect ${hoodie.name}`}
              >
                <div className="w-full aspect-square relative flex items-center justify-center">
                  <div className="w-full h-full flex items-center justify-center transition-transform duration-700 group-hover:scale-108">
                    <ProceduralHoodie
                      colorKey={hoodie.defaultColor}
                      graphicType={hoodie.graphicType as any}
                      customImage={hoodie.customArtworkUrl}
                      silhouette={hoodie.silhouette || 'oversized'}
                      customPosition={hoodie.graphicPosition}
                      view="back"
                      size="92%"
                      showBacklight={true}
                      hasFrontDesign={hoodie.hasFrontDesign}
                    />
                  </div>

                  <span className="absolute top-2 left-2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm font-semibold">
                    {hoodie.silhouette || 'OVERSIZED'}
                  </span>
                </div>

                <div className="mt-4 text-center space-y-1 w-full">
                  <div className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    {hoodie.series}
                  </div>
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
        </div>
      )}
    </div>
  );
};
