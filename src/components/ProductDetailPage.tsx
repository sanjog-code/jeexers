import React, { useState, useRef } from 'react';
import type { HoodieItem } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import { ArrowLeft, Check, RotateCw, AlertTriangle, Layers, Camera, Sparkles, Eye } from 'lucide-react';

interface ProductDetailPageProps {
  hoodie: HoodieItem;
  onBack: () => void;
  onAddToCart: (
    hoodie: HoodieItem,
    color: string,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    sourceRect?: DOMRect
  ) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  hoodie,
  onBack,
  onAddToCart,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>(hoodie.defaultColor);
  const [selectedView, setSelectedView] = useState<'front' | 'back'>(
    hoodie.hasFrontDesign ? 'back' : 'back'
  );
  const [specimenMode, setSpecimenMode] = useState<'cad' | 'onbody' | 'texture'>('cad');
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  // Helper to determine the on-body editorial image for this item
  const getLookbookImage = () => {
    const s = hoodie.series.toLowerCase();
    const id = hoodie.id.toLowerCase();
    if (s.includes('piece') || id.includes('op')) {
      return id.includes('straw') ? '/images/lookbook/model-05-night.jpg' : '/images/lookbook/model-01-shibuya.jpg';
    }
    if (s.includes('jujutsu') || s.includes('jjk') || id.includes('jjk')) {
      return '/images/lookbook/model-02-cowl.jpg';
    }
    if (s.includes('berserk') || id.includes('berserk') || id.includes('brs')) {
      return '/images/lookbook/model-06-brutalist.jpg';
    }
    if (s.includes('dragon') || s.includes('dbs') || s.includes('dbz') || id.includes('dbz')) {
      return '/images/lookbook/model-03-bone.jpg';
    }
    return '/images/lookbook/model-04-cropped.jpg';
  };

  // Stock check for currently chosen color and size
  const stock = hoodie.inventory?.[selectedColor]?.[selectedSize] ?? 12;
  const isOutOfStock = stock === 0;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const rect = stageRef.current?.getBoundingClientRect();
    onAddToCart(hoodie, selectedColor, selectedSize, rect);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];
  const silhouetteLabel =
    hoodie.silhouette === 'slimfit'
      ? 'SLIM FIT (TAPERED)'
      : hoodie.silhouette === 'cropped'
      ? 'CROPPED (HIGH WAIST)'
      : 'OVERSIZED (BOXY)';

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-6 sm:py-16 max-w-7xl mx-auto flex flex-col font-sans">
      {/* Return Button */}
      <div className="mb-6 sm:mb-8 flex justify-between items-center">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-mono tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase flex items-center space-x-2 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </button>

        {/* Silhouette Tag */}
        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border border-[var(--border-subtle)] text-[var(--accent)] font-semibold flex items-center gap-1.5">
          <Layers className="w-3 h-3" />
          <span>{silhouetteLabel}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1">
        {/* Left: Cardless Floating Garment Specimen Space with Backlight */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Specimen View Mode Selector */}
          <div className="w-full max-w-lg mb-4 flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 font-mono text-[10px] tracking-widest text-[var(--text-muted)]">
            <span className="uppercase flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-[var(--accent)]" />
              SPECIMEN VIEW
            </span>
            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => setSpecimenMode('cad')}
                className={`px-2.5 py-1 rounded transition-colors uppercase ${
                  specimenMode === 'cad'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                CAD FLAT
              </button>
              <button
                type="button"
                onClick={() => setSpecimenMode('onbody')}
                className={`px-2.5 py-1 rounded transition-colors uppercase ${
                  specimenMode === 'onbody'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                ON-BODY
              </button>
              <button
                type="button"
                onClick={() => setSpecimenMode('texture')}
                className={`px-2.5 py-1 rounded transition-colors uppercase ${
                  specimenMode === 'texture'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                    : 'hover:text-[var(--text-primary)]'
                }`}
              >
                FABRIC MACRO
              </button>
            </div>
          </div>

          {/* Garment Stage Container */}
          <div
            ref={stageRef}
            className="w-full max-w-lg aspect-square flex items-center justify-center transition-transform duration-700 ease-out relative overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-card)]/40 backdrop-blur-sm"
          >
            {specimenMode === 'cad' && (
              <div className="w-full h-full flex items-center justify-center p-4">
                <ProceduralHoodie
                  colorKey={selectedColor}
                  graphicType={hoodie.graphicType as any}
                  customImage={hoodie.customArtworkUrl}
                  silhouette={hoodie.silhouette || 'oversized'}
                  customPosition={hoodie.graphicPosition}
                  view={selectedView}
                  size="100%"
                  showBacklight={true}
                  hasFrontDesign={hoodie.hasFrontDesign}
                />
              </div>
            )}

            {specimenMode === 'onbody' && (
              <div className="w-full h-full relative group overflow-hidden">
                <img
                  src={getLookbookImage()}
                  alt={`${hoodie.name} on-body editorial`}
                  className="w-full h-full object-cover object-center atelier-editorial-img"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)]/90 via-transparent to-black/30 pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-[10px] font-mono tracking-widest text-[var(--text-muted)] pointer-events-none">
                  <div>
                    <span className="text-[var(--accent)] font-semibold uppercase">ARCHIVAL EDITORIAL</span>
                    <div className="text-[var(--text-primary)] font-bold uppercase">{hoodie.series} // SPECIMEN 01</div>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-[var(--border-subtle)] bg-[var(--bg-canvas)]/60 backdrop-blur-sm text-[var(--text-secondary)]">
                    35MM FILM
                  </span>
                </div>
              </div>
            )}

            {specimenMode === 'texture' && (
              <div className="w-full h-full relative group overflow-hidden">
                <img
                  src="/images/textures/cotton-loopback-macro.jpg"
                  alt="Raw cotton loopback weave texture"
                  className="w-full h-full object-cover object-center scale-110 group-hover:scale-125 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-canvas)]/90 via-[var(--bg-canvas)]/20 to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 text-[10px] font-mono tracking-widest text-[var(--text-secondary)] pointer-events-none">
                  <div className="flex items-center gap-1.5 text-[var(--accent)] font-bold uppercase mb-1">
                    <Sparkles className="w-3 h-3" />
                    CROSS-KNIT LOOPBACK TERRY
                  </div>
                  <div className="text-[var(--text-primary)] text-xs font-semibold uppercase">
                    500-THREAD RING-SPUN COTTON
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] mt-1">
                    Double-needle safety lockstitch · Low-tension knit · Zero pill fleece
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Perspective View Switcher (Only active when in CAD flat view) */}
          {specimenMode === 'cad' ? (
            <div className="mt-6 sm:mt-8 flex items-center space-x-3 font-mono text-xs tracking-[0.2em]">
              <button
                type="button"
                onClick={() => setSelectedView('back')}
                className={`px-4 py-2 rounded-full transition-all focus:outline-none flex items-center gap-1.5 ${
                  selectedView === 'back'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold shadow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
                }`}
              >
                <span>BACK ARTWORK</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedView('front')}
                className={`px-4 py-2 rounded-full transition-all focus:outline-none flex items-center gap-1.5 ${
                  selectedView === 'front'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold shadow'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
                }`}
              >
                <RotateCw className="w-3 h-3" />
                <span>FRONT SILHOUETTE {hoodie.hasFrontDesign ? '(CHEST EMBLEM)' : ''}</span>
              </button>
            </div>
          ) : (
            <div className="mt-6 sm:mt-8 text-[11px] font-mono tracking-widest text-[var(--text-muted)] uppercase flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>ATELIER ARCHIVE // ON-LOCATION SPECIMEN ARCHITECTURE</span>
            </div>
          )}
        </div>

        {/* Right: Architectural Config Form */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-8">
          <div>
            <div className="text-[11px] font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">
              {hoodie.series} COLLECTION
            </div>
            <h1 className="text-2xl sm:text-4xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              {hoodie.name}
            </h1>
            <div className="mt-2 text-xl sm:text-2xl font-mono text-[var(--text-primary)] tabular-nums font-bold">
              ${hoodie.price}.00
            </div>
            {hoodie.description && (
              <p className="mt-3 text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {hoodie.description}
              </p>
            )}

            {/* Tags */}
            {hoodie.tags && hoodie.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hoodie.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-[var(--border-hairline)] text-[var(--text-muted)] bg-[var(--bg-surface)]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Live Colorway Palette */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-secondary)]">
                COLORWAY
              </span>
              <span className="text-xs font-mono tracking-widest text-[var(--text-primary)] font-bold">
                {HOODIE_COLORWAYS[selectedColor]?.name || selectedColor}
              </span>
            </div>
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {hoodie.availableColors.map((colorKey) => {
                const colorObj = HOODIE_COLORWAYS[colorKey];
                const isSelected = selectedColor === colorKey;
                return (
                  <button
                    key={colorKey}
                    type="button"
                    onClick={() => setSelectedColor(colorKey)}
                    aria-label={`Select ${colorObj?.name || colorKey} colorway`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border border-[var(--border-subtle)] focus:outline-none ${
                      isSelected
                        ? 'ring-2 ring-[var(--text-primary)] scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colorObj?.hex || '#333' }}
                    >
                      {isSelected && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: colorKey === 'bone' ? '#111' : '#fff',
                          }}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Size Selector with Live Stock Status */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-secondary)]">
                SIZE ({silhouetteLabel})
              </span>
              {/* Dynamic Stock Indicator */}
              <span className="text-[11px] font-mono">
                {isOutOfStock ? (
                  <span className="text-red-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    OUT OF STOCK
                  </span>
                ) : stock <= 3 ? (
                  <span className="text-amber-400 font-semibold">
                    ONLY {stock} LEFT IN STOCK
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    IN STOCK ({stock} PIECES)
                  </span>
                )}
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {sizes.map((s) => {
                const szStock = hoodie.inventory?.[selectedColor]?.[s] ?? 10;
                const szOos = szStock === 0;

                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`py-2.5 sm:py-3 text-xs font-mono tracking-wider rounded-lg transition-all focus:outline-none border relative ${
                      selectedSize === s
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold border-[var(--text-primary)] shadow'
                        : 'border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
                    } ${szOos ? 'opacity-40' : ''}`}
                  >
                    <span>{s}</span>
                    {szOos && (
                      <span className="block text-[8px] text-red-400 uppercase font-bold leading-none mt-0.5">
                        OOS
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
            <button
              type="button"
              disabled={isOutOfStock}
              onClick={handleAdd}
              className={`w-full py-4 px-8 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl transition-all duration-300 focus:outline-none shadow-xl flex items-center justify-center space-x-2 ${
                isOutOfStock
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30 cursor-not-allowed'
                  : addedAnimation
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 cursor-pointer'
              }`}
            >
              {isOutOfStock ? (
                <span>SIZE / COLORWAY OUT OF STOCK</span>
              ) : addedAnimation ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>PACKED IN BAG</span>
                </span>
              ) : (
                <span>ADD TO BAG (${hoodie.price})</span>
              )}
            </button>

            <p className="text-[11px] font-mono tracking-wider text-[var(--text-muted)] text-center uppercase">
              Heavyweight 100% Cotton Fleece • {silhouetteLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
