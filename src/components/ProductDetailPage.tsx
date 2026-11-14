import React, { useState, useRef } from 'react';
import type { HoodieItem } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import { ArrowLeft, Check, RotateCw } from 'lucide-react';

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
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | 'XL' | 'XXL'>('L');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    const rect = stageRef.current?.getBoundingClientRect();
    onAddToCart(hoodie, selectedColor, selectedSize, rect);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  const sizes: ('S' | 'M' | 'L' | 'XL' | 'XXL')[] = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-6 sm:py-16 max-w-7xl mx-auto flex flex-col font-sans">
      {/* Return Button */}
      <div className="mb-6 sm:mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-mono tracking-[0.2em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors uppercase flex items-center space-x-2 py-1.5 focus:outline-none"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO STORE</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center flex-1">
        {/* Left: Cardless Floating Garment Specimen Space with Backlight */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          {/* Live Hoodie Component */}
          <div
            ref={stageRef}
            className="w-full max-w-lg aspect-square flex items-center justify-center transition-transform duration-700 ease-out hover:scale-105 relative"
          >
            <ProceduralHoodie
              colorKey={selectedColor}
              graphicType={hoodie.graphicType}
              view={selectedView}
              size="100%"
              showBacklight={true}
              hasFrontDesign={hoodie.hasFrontDesign}
            />
          </div>

          {/* Perspective View Switcher */}
          <div className="mt-6 sm:mt-8 flex items-center space-x-3 font-mono text-xs tracking-[0.2em]">
            <button
              type="button"
              onClick={() => setSelectedView('back')}
              className={`px-4 py-2 rounded-full transition-all focus:outline-none flex items-center gap-1.5 ${
                selectedView === 'back'
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
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
                  ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-hairline)]'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              <span>FRONT SILHOUETTE {hoodie.hasFrontDesign ? '(CHEST EMBLEM)' : ''}</span>
            </button>
          </div>
        </div>

        {/* Right: Architectural Config Form */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 sm:space-y-10">
          <div>
            <div className="text-[11px] font-mono tracking-[0.3em] text-[var(--text-muted)] uppercase mb-2">
              {hoodie.series} COLLECTION
            </div>
            <h1 className="text-2xl sm:text-4xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              {hoodie.name}
            </h1>
            <div className="mt-2 sm:mt-3 text-xl sm:text-2xl font-mono text-[var(--text-primary)] tabular-nums font-bold">
              ${hoodie.price}.00
            </div>
            {hoodie.description && (
              <p className="mt-3 text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                {hoodie.description}
              </p>
            )}
          </div>

          {/* Live Colorway Palette */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-secondary)]">
                COLORWAY
              </span>
              <span className="text-xs font-mono tracking-widest text-[var(--text-primary)] font-bold">
                {HOODIE_COLORWAYS[selectedColor]?.name}
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
                    aria-label={`Select ${colorObj.name} colorway`}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border border-[var(--border-subtle)] focus:outline-none ${
                      isSelected
                        ? 'ring-2 ring-[var(--text-primary)] scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="block w-full h-full rounded-full flex items-center justify-center"
                      style={{ backgroundColor: colorObj.hex }}
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

          {/* Clean Size Selector */}
          <div>
            <div className="text-xs font-mono tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-3">
              SIZE (BOXY OVERSIZED FIT)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2.5 sm:py-3 text-xs font-mono tracking-wider rounded-lg transition-all focus:outline-none border ${
                    selectedSize === s
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold border-[var(--text-primary)]'
                      : 'border-[var(--border-hairline)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
            <button
              type="button"
              onClick={handleAdd}
              className={`w-full py-4 px-8 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl transition-all duration-300 focus:outline-none shadow-xl flex items-center justify-center space-x-2 ${
                addedAnimation
                  ? 'bg-emerald-500 text-black'
                  : 'bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90'
              }`}
            >
              {addedAnimation ? (
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  <span>PACKED IN BAG</span>
                </span>
              ) : (
                <span>ADD TO BAG (${hoodie.price})</span>
              )}
            </button>
            <p className="text-[11px] font-mono tracking-wider text-[var(--text-muted)] text-center uppercase">
              Heavyweight 100% Cotton Fleece • Oversized Streetwear Fit
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
