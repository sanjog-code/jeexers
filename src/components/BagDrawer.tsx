import React, { useState } from 'react';
import type { CartEntry } from '../types';
import { ProceduralHoodie } from './ProceduralHoodie';
import { ArrowRight, Trash2, Layers } from 'lucide-react';

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartEntry[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onProceedToCheckout: () => void;
}

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [isStackView, setIsStackView] = useState<boolean>(true);

  if (!isOpen) return null;

  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.hoodie.price * item.quantity, 0);
  
  // Safe active featured item
  const safeIndex = Math.min(selectedItemIndex, Math.max(0, cart.length - 1));
  const activeItem = cart[safeIndex] || cart[0];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      {/* Modern Cardless Atelier Drawer */}
      <div className="relative w-full max-w-lg h-full bg-[var(--bg-canvas)] border-l border-[var(--border-hairline)] z-10 flex flex-col justify-between shadow-2xl">
        {/* Drawer Header */}
        <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-[var(--border-hairline)]">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block mb-0.5">
              THE JEEXERS ATELIER
            </span>
            <h2 className="text-sm font-mono tracking-[0.25em] uppercase text-[var(--text-primary)] font-bold">
              SHOPPING BAG ({totalCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono tracking-widest text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase py-1.5 px-3 border border-[var(--border-hairline)] rounded-lg hover:border-[var(--border-subtle)] focus:outline-none transition-colors"
          >
            CLOSE [ESC]
          </button>
        </div>

        {/* ================= ATELIER GARMENT STACK & PACK VISUALIZER ================= */}
        {cart.length > 0 && activeItem && (
          <div className="px-6 sm:px-8 py-5 border-b border-[var(--border-hairline)] bg-[var(--bg-surface-subtle)]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-mono tracking-[0.25em] text-[var(--text-muted)] uppercase flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-[var(--accent)]" />
                PACKED GARMENT STACK
              </span>
              <button
                type="button"
                onClick={() => setIsStackView(!isStackView)}
                className="text-[10px] font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] uppercase underline tracking-wider"
              >
                {isStackView ? 'ISOLATE VIEW' : 'EXPAND STACK'}
              </button>
            </div>

            {/* Stage Canvas: Deep Cavity with Stacked Folded Hoodies */}
            <div className="relative h-48 w-full rounded-2xl border border-[var(--border-subtle)] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_75%)]">
              {/* Minimal Clean Tray Base with only THE JEEXERS brandmark */}
              <div className="absolute inset-x-8 bottom-3 top-3 rounded-xl border border-[var(--border-subtle)] flex items-center justify-center p-3.5 bg-[var(--bg-canvas)] shadow-2xl">
                <span className="font-logo text-lg sm:text-xl font-black tracking-[0.25em] uppercase text-[var(--text-primary)] logo-light-wave">
                  THE JEEXERS
                </span>
              </div>

              {/* DYNAMIC FOLDED GARMENT STACK: Stacks each unit vertically with 3D perspective offset */}
              <div className="relative z-10 w-36 h-36 flex items-center justify-center">
                {isStackView ? (
                  /* Render each item stack layer */
                  cart.map((entry, entryIdx) => {
                    // Stacking calculations: multiple quantities create micro layer offsets
                    const offsetIndex = entryIdx;
                    const translateY = -offsetIndex * 12 + (entryIdx === safeIndex ? -4 : 0);
                    const scale = 1 - offsetIndex * 0.04;
                    const zIndex = 30 - entryIdx;

                    return (
                      <div
                        key={entry.id}
                        onClick={() => setSelectedItemIndex(entryIdx)}
                        className="absolute inset-0 cursor-pointer transition-all duration-500 ease-out hover:scale-105"
                        style={{
                          transform: `translateY(${translateY}px) scale(${scale})`,
                          zIndex,
                        }}
                        title={`Item: ${entry.hoodie.name} (Qty: ${entry.quantity})`}
                      >
                        <ProceduralHoodie
                          colorKey={entry.color}
                          graphicType={entry.hoodie.graphicType}
                          view="back"
                          folded={true}
                          size="100%"
                          showBacklight={entryIdx === safeIndex}
                        />

                        {/* Stacking Quantity Multiplier Indicator if > 1 */}
                        {entry.quantity > 1 && (
                          <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[9px] font-mono font-bold shadow-md ring-1 ring-white/20">
                            ×{entry.quantity} STACK
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Single active item inspection */
                  <div className="w-full h-full">
                    <ProceduralHoodie
                      colorKey={activeItem.color}
                      graphicType={activeItem.hoodie.graphicType}
                      view="back"
                      folded={true}
                      size="100%"
                      showBacklight={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= ITEMS DIRECTORY LIST ================= */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
              <div className="w-12 h-12 rounded-full border border-[var(--border-subtle)] flex items-center justify-center">
                <span className="text-xs font-mono text-[var(--text-muted)]">00</span>
              </div>
              <div className="text-xs font-mono tracking-widest text-[var(--text-muted)] uppercase">
                YOUR ATELIER BAG IS EMPTY
              </div>
            </div>
          ) : (
            cart.map((item, idx) => {
              const isSelected = idx === safeIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemIndex(idx)}
                  className={`flex items-center space-x-4 p-3 rounded-xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'border-[var(--text-primary)] bg-[var(--bg-surface-elevated)]'
                      : 'border-[var(--border-hairline)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  {/* Garment Preview Thumbnail */}
                  <div className="w-14 h-14 flex-shrink-0 relative flex items-center justify-center">
                    <ProceduralHoodie
                      colorKey={item.color}
                      graphicType={item.hoodie.graphicType}
                      view="back"
                      folded={true}
                      size="100%"
                      showBacklight={false}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase truncate tracking-wider">
                      {item.hoodie.name}
                    </h4>
                    <div className="text-[10px] font-mono text-[var(--text-secondary)] uppercase mt-0.5 tracking-wider">
                      SIZE {item.size} • {item.color.toUpperCase()}
                    </div>
                    <div className="text-xs font-mono text-[var(--text-primary)] mt-1 tabular-nums font-bold">
                      ${item.hoodie.price}.00
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-[var(--text-secondary)] font-normal ml-2">
                          (Total: ${item.hoodie.price * item.quantity}.00)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end space-y-1.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center space-x-2 text-xs font-mono border border-[var(--border-subtle)] px-2 py-0.5 rounded-lg bg-[var(--bg-canvas)]">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-1 focus:outline-none"
                      >
                        -
                      </button>
                      <span className="text-[var(--text-primary)] font-bold tabular-nums px-1">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-1 focus:outline-none"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[9px] font-mono text-[var(--text-muted)] hover:text-red-400 uppercase transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-2.5 h-2.5" />
                      <span>REMOVE</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer with Checkout CTA */}
        {cart.length > 0 && (
          <div className="px-6 sm:px-8 py-5 border-t border-[var(--border-hairline)] space-y-3">
            <div className="flex justify-between items-center text-xs font-mono tracking-wider">
              <span className="text-[var(--text-secondary)] uppercase">BAG TOTAL ({totalCount} PIECES)</span>
              <span className="text-[var(--text-primary)] text-xl font-bold tabular-nums">
                ${subtotal}.00
              </span>
            </div>
            <button
              type="button"
              onClick={onProceedToCheckout}
              className="w-full py-3.5 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-all flex items-center justify-center space-x-2 focus:outline-none shadow-xl"
            >
              <span>ENTER SECURE CHECKOUT</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
