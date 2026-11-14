import React, { useState, useEffect, useRef } from 'react';
import type { PageView, CartEntry } from './types';
import type { HoodieItem } from './data/products';
import { HOODIE_COLLECTION } from './data/products';
import { Header } from './components/Header';
import { StorePage } from './components/StorePage';
import { CollectionsPage } from './components/CollectionsPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { BespokePage } from './components/BespokePage';
import { StudioPage } from './components/StudioPage';
import { BagDrawer } from './components/BagDrawer';
import { CheckoutSpace } from './components/CheckoutSpace';
import { Footer } from './components/Footer';
import { ProceduralHoodie } from './components/ProceduralHoodie';

interface FlyingHoodie {
  id: number;
  hoodie: HoodieItem;
  color: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
}

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('store');
  const [selectedSeries, setSelectedSeries] = useState<string>('ALL');
  const [selectedHoodie, setSelectedHoodie] = useState<HoodieItem>(HOODIE_COLLECTION[0]);
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<'obsidian' | 'alabaster'>('obsidian');

  // Hero Backpack Dynamic State Machine: 'idle' -> 'unzipping' -> 'open' -> 'zipping' -> 'impact' -> 'idle'
  const [bagAnimationState, setBagAnimationState] = useState<'idle' | 'unzipping' | 'open' | 'zipping' | 'impact'>('idle');
  const [flyingHoodie, setFlyingHoodie] = useState<FlyingHoodie | null>(null);
  const bagIconRef = useRef<HTMLButtonElement | null>(null);

  // Synchronize Theme Attribute on Document Root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'alabaster') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'obsidian' ? 'alabaster' : 'obsidian'));
  };

  // Navigate to Product Detail
  const handleSelectHoodie = (item: HoodieItem) => {
    setSelectedHoodie(item);
    setCurrentPage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add Item to Cart with Dynamic Backpack Unzip, Ingestion, Impact & Closure Choreography
  const handleAddToCart = (
    hoodie: HoodieItem,
    color: string,
    size: 'S' | 'M' | 'L' | 'XL' | 'XXL',
    customImage?: string | null,
    sourceRect?: DOMRect
  ) => {
    // 1. Calculate real coordinates from source garment to header backpack
    const bagRect = bagIconRef.current?.getBoundingClientRect();
    const startX = sourceRect ? sourceRect.left + sourceRect.width / 2 : window.innerWidth / 2;
    const startY = sourceRect ? sourceRect.top + sourceRect.height / 2 : window.innerHeight / 2;
    const targetX = bagRect ? bagRect.left + 16 : window.innerWidth - 60;
    const targetY = bagRect ? bagRect.top + 16 : 40;

    // Phase 1 (0ms): Backpack shakes and actively unzips open
    setBagAnimationState('unzipping');

    // Phase 2 (200ms): Backpack cavity is wide open, garment lifts and collapses into dot
    setTimeout(() => {
      setBagAnimationState('open');
      const flightId = Date.now();
      setFlyingHoodie({
        id: flightId,
        hoodie,
        color,
        startX,
        startY,
        targetX,
        targetY,
      });
    }, 200);

    // Phase 3 (750ms): Garment dives into cavity -> Backpack shakes violently on impact and snaps shut
    setTimeout(() => {
      setFlyingHoodie(null);
      setBagAnimationState('impact');

      // Update cart state (stacking if identical item)
      setCart((prev) => {
        const existing = prev.find(
          (entry) =>
            entry.hoodie.id === hoodie.id &&
            entry.color === color &&
            entry.size === size &&
            entry.customImage === customImage
        );
        if (existing) {
          return prev.map((entry) =>
            entry.id === existing.id
              ? { ...entry, quantity: entry.quantity + 1 }
              : entry
          );
        }
        return [
          ...prev,
          {
            id: `${hoodie.id}-${color}-${size}-${Date.now()}`,
            hoodie,
            color,
            size,
            quantity: 1,
            customImage,
          },
        ];
      });

      // Phase 4 (1150ms): Zipper tracks interlock closed
      setTimeout(() => {
        setBagAnimationState('zipping');
        setTimeout(() => {
          setBagAnimationState('idle');
        }, 300);
      }, 400);
    }, 750);
  };

  // Bespoke Order Handler
  const handleBespokeOrder = (
    concept: string,
    color: string,
    size: string,
    customImage?: string | null
  ) => {
    const bespokeItem: HoodieItem = {
      id: `bespoke-${Date.now()}`,
      name: `1-OF-1 BESPOKE: ${concept.slice(0, 16).toUpperCase()}`,
      series: 'BESPOKE',
      price: 260,
      graphicType: 'bespoke',
      defaultColor: color,
      availableColors: [color],
    };
    handleAddToCart(bespokeItem, color, size as 'S' | 'M' | 'L' | 'XL' | 'XXL', customImage);
    setTimeout(() => {
      setIsBagOpen(true);
    }, 1100);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartEntry[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden">
      {/* Product Collapsing into Dot & Flying into Backpack Opening */}
      {flyingHoodie && (
        <div
          className="fixed z-[100] pointer-events-none"
          style={{
            left: `${flyingHoodie.startX}px`,
            top: `${flyingHoodie.startY}px`,
            width: '160px',
            height: '160px',
            transform: 'translate(-50%, -50%)',
            animation: `flyProductIntoBag 0.6s cubic-bezier(0.25, 1, 0.5, 1) forwards`,
            ['--target-x' as string]: `${flyingHoodie.targetX - flyingHoodie.startX}px`,
            ['--target-y' as string]: `${flyingHoodie.targetY - flyingHoodie.startY}px`,
          }}
        >
          <div className="w-full h-full relative flex items-center justify-center">
            {/* Luminous Crimson Particle Aura */}
            <div className="absolute inset-0 rounded-full bg-red-600/40 blur-xl animate-pulse" />
            <ProceduralHoodie
              colorKey={flyingHoodie.color}
              graphicType={flyingHoodie.hoodie.graphicType}
              view="back"
              size="100%"
              showBacklight={false}
            />
          </div>
        </div>
      )}

      {/* High-Fashion Header with Hero Unzipping Backpack & Red Dot Counter */}
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={totalCartCount}
        onOpenBag={() => setIsBagOpen(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
        bagAnimationState={bagAnimationState}
        bagIconRef={bagIconRef}
      />

      {/* Dynamic Page Router */}
      <main className="flex-1 flex flex-col">
        {currentPage === 'store' && (
          <StorePage
            onSelectHoodie={handleSelectHoodie}
            selectedSeries={selectedSeries}
            onSeriesChange={setSelectedSeries}
          />
        )}

        {currentPage === 'collections' && (
          <CollectionsPage
            onSelectHoodie={handleSelectHoodie}
            onNavigateToBespoke={() => {
              setCurrentPage('bespoke');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'detail' && selectedHoodie && (
          <ProductDetailPage
            hoodie={selectedHoodie}
            onBack={() => setCurrentPage('store')}
            onAddToCart={(h, c, s, rect) => handleAddToCart(h, c, s, null, rect)}
          />
        )}

        {currentPage === 'bespoke' && (
          <BespokePage onBespokeOrder={handleBespokeOrder} />
        )}

        {currentPage === 'studio' && <StudioPage />}

        {currentPage === 'checkout' && (
          <CheckoutSpace
            cart={cart}
            onBack={() => setCurrentPage('store')}
            onOrderSuccess={() => setCart([])}
          />
        )}
      </main>

      {/* Modern Cardless Bag Drawer with Repacking Canvas Visualizer */}
      <BagDrawer
        isOpen={isBagOpen}
        onClose={() => setIsBagOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={() => {
          setIsBagOpen(false);
          setCurrentPage('checkout');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* High-Fashion Functional Footer with Working Buttons */}
      <Footer
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectSeries={(series) => {
          setSelectedSeries(series);
        }}
      />
    </div>
  );
};

export default App;
