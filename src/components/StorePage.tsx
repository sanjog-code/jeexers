import React, { useMemo } from 'react';
import type { HoodieItem } from '../data/products';
import { HOODIE_COLLECTION } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import { SlidersHorizontal, Sparkles, Compass } from 'lucide-react';

interface StorePageProps {
  onSelectHoodie: (item: HoodieItem) => void;
  selectedSeries: string;
  onSeriesChange: (series: string) => void;
}

export const StorePage: React.FC<StorePageProps> = ({
  onSelectHoodie,
  selectedSeries,
  onSeriesChange,
}) => {
  const [selectedColor, setSelectedColor] = React.useState<string>('ALL');
  const [priceSort, setPriceSort] = React.useState<'default' | 'low-high' | 'high-low'>('default');

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    return HOODIE_COLLECTION.filter((item) => {
      if (selectedSeries !== 'ALL' && item.series !== selectedSeries) return false;
      if (selectedColor !== 'ALL' && !item.availableColors.includes(selectedColor)) return false;
      return true;
    }).sort((a, b) => {
      if (priceSort === 'low-high') return a.price - b.price;
      if (priceSort === 'high-low') return b.price - a.price;
      return 0;
    });
  }, [selectedSeries, selectedColor, priceSort]);

  // First 16 items for 4x4 Grid
  const grid16 = filteredProducts.slice(0, 16);
  // 2 Big Monumental Showcase Pieces
  const showcasePieces = HOODIE_COLLECTION.slice(0, 2);
  // Post-Showcase Archival & One Piece Expansion Pieces (items 16+)
  const postShowcasePieces = HOODIE_COLLECTION.slice(16);

  const seriesTabs = ['ALL', 'ONE-PIECE', 'JJK', 'BERSERK', 'DBS', 'BESPOKE'];
  const colorOptions = ['ALL', 'onyx', 'bone', 'mud', 'charcoal', 'moss', 'crimson'];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-16 max-w-7xl mx-auto font-sans space-y-16 sm:space-y-24">
      {/* ===================== FILTER MATRIX BAR (MOBILE OPTIMIZED) ===================== */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6 pb-6 border-b border-[var(--border-hairline)]">
        {/* Anime / Series Filter */}
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

        {/* Color & Pricing Filters */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start w-full md:w-auto gap-4 text-xs font-mono">
          {/* Colorway Filter Swatches */}
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

          {/* Pricing Order Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
              PRICE:
            </span>
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as 'default' | 'low-high' | 'high-low')}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg px-2 py-1 text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
            >
              <option value="default">CURATED</option>
              <option value="low-high">LOW → HIGH</option>
              <option value="high-low">HIGH → LOW</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===================== 4x4 ARCHITECTURAL GRID ===================== */}
      <div>
        <div className="flex justify-between items-end mb-6 sm:mb-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-1">
              SPECIMEN MATRIX
            </span>
            <h2 className="text-xl sm:text-2xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              THE 4×4 GARMENT VAULT
            </h2>
          </div>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            SHOWING {grid16.length} OF {HOODIE_COLLECTION.length}
          </span>
        </div>

        {/* Responsive Grid: 1 col on xs mobile, 2 col on sm, 3 col on md, 4 col on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-10">
          {grid16.map((hoodie, idx) => (
            <button
              key={hoodie.id}
              type="button"
              onClick={() => onSelectHoodie(hoodie)}
              className="group cursor-pointer relative flex flex-col items-center justify-center p-3 transition-all duration-500 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] text-left w-full bg-transparent border-0"
              aria-label={`Inspect ${hoodie.name} specimen 0${idx + 1}`}
            >
              {/* Product Hoodie Silhouette */}
              <div className="w-full aspect-square relative flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108">
                  <ProceduralHoodie
                    colorKey={hoodie.defaultColor}
                    graphicType={hoodie.graphicType}
                    view="back"
                    size="92%"
                    showBacklight={true}
                    hasFrontDesign={hoodie.hasFrontDesign}
                  />
                </div>

                {/* Badge if item has front design */}
                {hoodie.hasFrontDesign && (
                  <span className="absolute top-2 left-2 text-[9px] font-mono tracking-wider uppercase px-2 py-0.5 rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] bg-[var(--bg-canvas)]/80 backdrop-blur-sm">
                    FRONT + BACK
                  </span>
                )}
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
              {/* Giant Left Showcase Silhouette */}
              <div className="w-full sm:w-1/2 aspect-square flex items-center justify-center transition-transform duration-700 ease-out group-hover:scale-105">
                <ProceduralHoodie
                  colorKey={showcase.defaultColor}
                  graphicType={showcase.graphicType}
                  view="back"
                  size="100%"
                  showBacklight={true}
                  hasFrontDesign={showcase.hasFrontDesign}
                />
              </div>

              {/* Right Architectural Detail */}
              <div className="w-full sm:w-1/2 sm:pl-8 mt-6 sm:mt-0 space-y-3 sm:space-y-4 text-left">
                <div className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)]">
                  FLAGSHIP SPECIMEN 0{index + 1}
                </div>
                <h3 className="text-xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  {showcase.name}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed line-clamp-3">
                  {showcase.description || '500GSM custom-milled loopback French terry. Hand-brushed discharge ink cured at 180°C.'}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-mono text-[var(--text-primary)] font-bold tabular-nums">
                    ${showcase.price}.00
                  </span>
                  <span className="text-xs font-mono text-[var(--accent)] uppercase font-bold tracking-wider group-hover:underline">
                    INSPECT SPECIMEN →
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== POST-SHOWCASE EXTENSION: ONE PIECE & NEW PIECES ===================== */}
      {postShowcasePieces.length > 0 && (
        <div className="pt-12 border-t border-[var(--border-hairline)] space-y-8 sm:space-y-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-1">
                LORE EXPANSION // GRAND LINE ARCHIVE
              </span>
              <h2 className="text-xl sm:text-2xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-2">
                <Compass className="w-5 h-5 text-[var(--accent)]" />
                ONE PIECE & NEW COMMISSIONS
              </h2>
            </div>
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              {postShowcasePieces.length} ADDITIONAL ATELIER PIECES
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
