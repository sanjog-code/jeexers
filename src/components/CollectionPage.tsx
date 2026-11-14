import React from 'react';
import type { HoodieItem } from '../data/products';
import { HOODIE_COLLECTION } from '../data/products';
import { ProceduralHoodie } from './ProceduralHoodie';

interface CollectionPageProps {
  onSelectHoodie: (item: HoodieItem) => void;
}

export const CollectionPage: React.FC<CollectionPageProps> = ({ onSelectHoodie }) => {
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-12 sm:py-20 max-w-7xl mx-auto font-sans">
      {/* Boundless Architectural Garment Matrix - Pure Specimen Floating Space */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-20">
        {HOODIE_COLLECTION.map((hoodie, idx) => (
          <button
            key={hoodie.id}
            type="button"
            onClick={() => onSelectHoodie(hoodie)}
            className="group cursor-pointer relative flex flex-col items-center justify-center p-4 transition-all duration-500 ease-out focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] text-left w-full bg-transparent border-0"
            aria-label={`Inspect ${hoodie.name} specimen 0${idx + 1}`}
          >
            {/* Pure Ambient Backlight Halo & Hoodie with subtle zoom on hover */}
            <div className="w-full aspect-square relative flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-108">
                <ProceduralHoodie
                  colorKey={hoodie.defaultColor}
                  graphicType={hoodie.graphicType}
                  view="back"
                  size="94%"
                  showBacklight={true}
                />
              </div>
            </div>

            {/* Minimal Sub-Identity Hint on Hover */}
            <div className="mt-5 flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[10px] tracking-[0.35em] font-mono uppercase text-[var(--text-secondary)]">
                SPECIMEN 0{idx + 1} — VIEW DETAILS
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
