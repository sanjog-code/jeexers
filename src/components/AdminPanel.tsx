import React, { useState, useRef, useEffect } from 'react';
import type { HoodieItem, HoodieSilhouette } from '../data/products';
import { HOODIE_COLLECTION, createDefaultInventory, saveActiveCatalog } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import { CURATED_PALETTES, HEX_GRID_SWATCHES } from '../data/palettes';
import {
  Lock,
  Plus,
  Trash2,
  Check,
  Eye,
  Upload,
  RefreshCw,
  AlertCircle,
  Move,
  RotateCw,
  Sliders,
  Tag,
  Hash,
  Boxes,
  Sparkles,
  Layers,
  Search
} from 'lucide-react';

interface AdminPanelProps {
  catalog: HoodieItem[];
  onUpdateCatalog: (newCatalog: HoodieItem[]) => void;
  onExit: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  catalog,
  onUpdateCatalog,
  onExit,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('jeexers_admin_auth') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'create' | 'inventory'>('create');

  // ===================== PRODUCT FORM STATE =====================
  const [name, setName] = useState('');
  const [seriesSelect, setSeriesSelect] = useState<string>('ONE-PIECE');
  const [customSeriesInput, setCustomSeriesInput] = useState('');
  const [isCustomSeries, setIsCustomSeries] = useState(false);
  const [price, setPrice] = useState<number>(195);
  const [description, setDescription] = useState('');
  const [silhouette, setSilhouette] = useState<HoodieSilhouette>('oversized');
  const [view, setView] = useState<'front' | 'back'>('back');
  const [hasFrontDesign, setHasFrontDesign] = useState(true);

  // Color Configuration & Hex Palette
  const [paletteTab, setPaletteTab] = useState<'curated' | 'hexgrid'>('curated');
  const [selectedHex, setSelectedHex] = useState<string>('#141416');
  const [customHexInput, setCustomHexInput] = useState<string>('#141416');
  const [defaultColor, setDefaultColor] = useState<string>('onyx');
  const [availableColors, setAvailableColors] = useState<string[]>(['onyx', 'bone', 'charcoal']);

  // Graphic, Positioning & Upload
  const [graphicType, setGraphicType] = useState<string>('op-sun-god');
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);
  const [graphicScale, setGraphicScale] = useState<number>(1);
  const [graphicPosition, setGraphicPosition] = useState<{ x: number; y: number }>({ x: 180, y: 160 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Tag System
  const [tags, setTags] = useState<string[]>(['heavyweight', 'anime', 'oversized']);
  const [tagInput, setTagInput] = useState('');

  // Inventory Matrix (color -> size -> qty)
  const [inventoryMatrix, setInventoryMatrix] = useState<
    Record<string, Record<'S' | 'M' | 'L' | 'XL' | 'XXL', number>>
  >(() => createDefaultInventory(['onyx', 'bone', 'charcoal'], 15));

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [inventorySearch, setInventorySearch] = useState('');

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === 'jeexers2026' || passkeyInput === 'admin' || passkeyInput === 'jeexers') {
      setIsAuthenticated(true);
      sessionStorage.setItem('jeexers_admin_auth', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('jeexers_admin_auth');
    onExit();
  };

  // Sync inventory matrix when available colors change
  useEffect(() => {
    setInventoryMatrix((prev) => {
      const next = { ...prev };
      availableColors.forEach((c) => {
        if (!next[c]) {
          next[c] = { S: 15, M: 15, L: 15, XL: 15, XXL: 15 };
        }
      });
      return next;
    });
  }, [availableColors]);

  // Color Selection Handlers
  const handleColorSelect = (hex: string, key?: string) => {
    setSelectedHex(hex);
    setCustomHexInput(hex);
    const colorKey = key || Object.keys(HOODIE_COLORWAYS).find((k) => HOODIE_COLORWAYS[k].hex === hex) || 'onyx';
    setDefaultColor(colorKey);
    if (!availableColors.includes(colorKey)) {
      setAvailableColors([...availableColors, colorKey]);
    }
  };

  const toggleAvailableColor = (c: string) => {
    if (availableColors.includes(c)) {
      if (availableColors.length > 1) {
        const remaining = availableColors.filter((col) => col !== c);
        setAvailableColors(remaining);
        if (defaultColor === c) setDefaultColor(remaining[0]);
      }
    } else {
      setAvailableColors([...availableColors, c]);
    }
  };

  // Image Upload Handler
  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedArtwork(result);
        setGraphicType('custom-upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag to Reposition Graphic with Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    dragStartRef.current = { x: e.clientX, y: e.clientY };

    setGraphicPosition((prev) => ({
      x: Math.round(Math.max(50, Math.min(320, prev.x + dx * 0.9))),
      y: Math.round(Math.max(80, Math.min(380, prev.y + dy * 0.9))),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Tag Management
  const handleAddTag = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = tagInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Inventory Cell Update
  const updateInventoryQty = (color: string, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', value: number) => {
    setInventoryMatrix((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        [size]: Math.max(0, value),
      },
    }));
  };

  const setAllInventory = (qty: number) => {
    setInventoryMatrix(() => {
      const next: Record<string, Record<'S' | 'M' | 'L' | 'XL' | 'XXL', number>> = {};
      availableColors.forEach((c) => {
        next[c] = { S: qty, M: qty, L: qty, XL: qty, XXL: qty };
      });
      return next;
    });
  };

  // Publish Hoodie Live Directly to Storefront
  const handlePublishHoodie = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const finalSeries = isCustomSeries && customSeriesInput.trim()
      ? customSeriesInput.trim().toUpperCase()
      : seriesSelect;

    const newId = `${finalSeries.toLowerCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`;
    const newItem: HoodieItem = {
      id: newId,
      name: name.trim().toUpperCase(),
      series: finalSeries,
      price: Number(price) || 195,
      graphicType,
      defaultColor,
      availableColors,
      description: description.trim() || 'Heavyweight 100% cotton fleece with original graphic.',
      hasFrontDesign,
      customArtworkUrl: uploadedArtwork || undefined,
      silhouette,
      tags: tags.length > 0 ? tags : [finalSeries.toLowerCase(), silhouette],
      graphicPosition: {
        x: graphicPosition.x,
        y: graphicPosition.y,
        scale: graphicScale,
      },
      inventory: inventoryMatrix,
    };

    const updated = [newItem, ...catalog];
    onUpdateCatalog(updated);
    saveActiveCatalog(updated);

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    // Reset Form
    setName('');
    setDescription('');
    setUploadedArtwork(null);
  };

  // Delete Item from Catalog
  const handleDeleteProduct = (id: string) => {
    if (confirm('Delete this hoodie from the store?')) {
      const updated = catalog.filter((item) => item.id !== id);
      onUpdateCatalog(updated);
      saveActiveCatalog(updated);
    }
  };

  // Update Stock Directly from Inventory List
  const handleUpdateItemStock = (hoodieId: string, color: string, size: 'S' | 'M' | 'L' | 'XL' | 'XXL', newQty: number) => {
    const updated = catalog.map((item) => {
      if (item.id === hoodieId) {
        const currentInv = item.inventory || createDefaultInventory(item.availableColors, 12);
        return {
          ...item,
          inventory: {
            ...currentInv,
            [color]: {
              ...(currentInv[color] || { S: 10, M: 10, L: 10, XL: 10, XXL: 10 }),
              [size]: Math.max(0, newQty),
            },
          },
        };
      }
      return item;
    });
    onUpdateCatalog(updated);
    saveActiveCatalog(updated);
  };

  // Reset to Factory Default
  const handleResetCatalog = () => {
    if (confirm('Reset entire catalog to default items? Custom listings will be cleared.')) {
      onUpdateCatalog(HOODIE_COLLECTION);
      localStorage.removeItem('jeexers_catalog_live');
      localStorage.removeItem('jeexers_custom_catalog');
    }
  };

  // Filtered inventory list
  const filteredCatalog = catalog.filter((item) => {
    const q = inventorySearch.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.series.toLowerCase().includes(q) ||
      (item.tags && item.tags.some((t) => t.toLowerCase().includes(q)))
    );
  });

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-20 max-w-md mx-auto flex flex-col justify-center font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-red-500 font-bold">
              RESTRICTED ACCESS
            </span>
            <h1 className="text-xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              ATELIER ADMIN PANEL
            </h1>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Enter master access key to design, price, and publish new hoodies directly to the live store.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                required
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Access Key (Default: jeexers2026)"
                className="w-full px-4 py-3 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--text-primary)] transition-colors text-center"
              />
              {authError && (
                <p className="text-[11px] font-mono text-red-400 mt-2 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Invalid access key. Try 'jeexers2026'
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 text-xs font-mono uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity"
            >
              UNLOCK ADMIN STUDIO
            </button>
          </form>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={onExit}
              className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase transition-colors"
            >
              ← RETURN TO STORE
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Unlocked Full Admin Studio
  return (
    <div
      className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-14 max-w-7xl mx-auto font-sans space-y-8 select-none"
      onMouseUp={handleMouseUp}
    >
      {/* Top Bar with Live Indicator */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-emerald-400 font-bold">
              LIVE ATELIER CONNECTION ACTIVE
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-3">
            <span>HOODIE STUDIO &amp; INVENTORY COMMAND</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onExit}
            className="py-2.5 px-4 text-xs font-mono uppercase font-bold rounded-lg border border-[var(--border-subtle)] text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>VIEW LIVE STORE</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="py-2.5 px-4 text-xs font-mono uppercase font-bold rounded-lg bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 transition-colors"
          >
            LOCK ADMIN
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-hairline)] pb-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('create')}
          className={`py-2.5 px-5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'create'
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>DESIGN &amp; PUBLISH HOODIE</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`py-2.5 px-5 rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold shadow-md'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>INVENTORY &amp; STOCK MATRIX ({catalog.length})</span>
        </button>
      </div>

      {/* ===================== TAB 1: DESIGN & PUBLISH ===================== */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Interactive Live Preview with Draggable Graphic */}
          <div
            ref={previewContainerRef}
            className="lg:col-span-5 sticky top-24 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 flex flex-col items-center space-y-6"
            onMouseMove={handleMouseMove}
          >
            {/* View & Silhouette Controls */}
            <div className="w-full flex justify-between items-center border-b border-[var(--border-hairline)] pb-3 text-xs font-mono">
              <span className="text-[10px] tracking-widest text-[var(--text-muted)] uppercase">
                STUDIO REAL-TIME VIEWPORT
              </span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setView('back')}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-colors ${
                    view === 'back'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                      : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
                  }`}
                >
                  BACK VIEW
                </button>
                <button
                  type="button"
                  onClick={() => setView('front')}
                  className={`px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-colors flex items-center gap-1 ${
                    view === 'front'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                      : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] border border-[var(--border-hairline)]'
                  }`}
                >
                  <RotateCw className="w-2.5 h-2.5" />
                  FRONT VIEW
                </button>
              </div>
            </div>

            {/* Live Interactive Garment Canvas with Draggable Graphic */}
            <div className="w-full aspect-square relative flex items-center justify-center p-2">
              <ProceduralHoodie
                colorKey={defaultColor}
                customHex={selectedHex}
                graphicType={graphicType as any}
                customImage={uploadedArtwork}
                view={view}
                silhouette={silhouette}
                customPosition={{
                  x: graphicPosition.x,
                  y: graphicPosition.y,
                  scale: graphicScale,
                }}
                size="100%"
                showBacklight={true}
                hasFrontDesign={hasFrontDesign}
              />

              {/* Draggable Bounding Indicator on Hover / Drag */}
              <div
                onMouseDown={handleMouseDown}
                className={`absolute cursor-grab active:cursor-grabbing border-2 rounded-xl transition-colors flex items-center justify-center ${
                  isDragging
                    ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20'
                    : 'border-dashed border-white/40 hover:border-red-400/80 hover:bg-white/5'
                }`}
                style={{
                  left: `${(graphicPosition.x / 600) * 100}%`,
                  top: `${(graphicPosition.y / 600) * 100}%`,
                  width: `${(240 * graphicScale) / 6}%`,
                  height: `${(260 * graphicScale) / 6}%`,
                  transform: 'translate(-10%, -10%)',
                }}
                title="Left click and drag to reposition graphic"
              >
                <span className="p-1.5 rounded-full bg-black/60 text-white/90 backdrop-blur-sm pointer-events-none">
                  <Move className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Position & Scale Fine-Tuning Slider */}
            <div className="w-full space-y-3 pt-2 border-t border-[var(--border-hairline)] text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase flex items-center gap-1">
                  <Move className="w-3 h-3" />
                  GRAPHIC POSITION: X={graphicPosition.x}, Y={graphicPosition.y}
                </span>
                <button
                  type="button"
                  onClick={() => setGraphicPosition({ x: 180, y: 160 })}
                  className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                >
                  CENTER
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[var(--text-secondary)] uppercase shrink-0">
                  SCALE: {Math.round(graphicScale * 100)}%
                </span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={graphicScale}
                  onChange={(e) => setGraphicScale(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
            </div>

            {/* Garment Preview Metadata */}
            <div className="w-full text-center space-y-1 pt-1">
              <div className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase truncate">
                {name || 'UNTITLED SPECIMEN'}
              </div>
              <div className="text-xs font-mono text-[var(--text-secondary)]">
                ${price}.00 USD • {silhouette.toUpperCase()} FIT • {availableColors.length} COLORWAYS
              </div>
            </div>
          </div>

          {/* Right Column: Custom Tools & Specifications Form */}
          <form onSubmit={handlePublishHoodie} className="lg:col-span-7 space-y-6">
            {/* 1. Identity & Series */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3">
                <Sparkles className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  01. IDENTITY &amp; ANIME SERIES
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    PRODUCT NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. GEAR 5 DRUMS OF LIBERATION"
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                      SERIES / FRANCHISE
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCustomSeries(!isCustomSeries)}
                      className="text-[10px] font-mono text-[var(--accent)] hover:underline uppercase"
                    >
                      {isCustomSeries ? '← Pick Existing' : '+ New Series'}
                    </button>
                  </div>

                  {isCustomSeries ? (
                    <input
                      type="text"
                      required
                      value={customSeriesInput}
                      onChange={(e) => setCustomSeriesInput(e.target.value)}
                      placeholder="e.g. NARUTO, BLEACH, VINLAND"
                      className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-red-500/50 rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                    />
                  ) : (
                    <select
                      value={seriesSelect}
                      onChange={(e) => setSeriesSelect(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                    >
                      <option value="ONE-PIECE">ONE PIECE</option>
                      <option value="JJK">JUJUTSU KAISEN (JJK)</option>
                      <option value="BERSERK">BERSERK</option>
                      <option value="DBS">DRAGON BALL SUPER (DBS)</option>
                      <option value="CUSTOM">CUSTOM HOODIES</option>
                    </select>
                  )}
                </div>
              </div>

              {/* Price & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    PRICE ($ USD)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="999"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    DESCRIPTION
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Heavyweight cotton fleece with high-density original graphic."
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-sans text-[var(--text-primary)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Three Silhouettes (Slimfit, Oversized, Cropped) */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3">
                <Layers className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  02. SILHOUETTE &amp; CUT
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'oversized' as HoodieSilhouette, title: 'OVERSIZED', desc: 'Boxy drop-shoulder relaxed cut' },
                  { id: 'slimfit' as HoodieSilhouette, title: 'SLIM FIT', desc: 'Tapered athletic waist & fitted sleeves' },
                  { id: 'cropped' as HoodieSilhouette, title: 'CROPPED', desc: 'High-waist cut with ribbed snug hem' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSilhouette(s.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      silhouette === s.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-[var(--text-primary)] shadow-md'
                        : 'bg-[var(--bg-canvas)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:border-[var(--text-primary)]'
                    }`}
                  >
                    <div className="text-xs font-mono font-bold uppercase">{s.title}</div>
                    <div className={`text-[10px] mt-1 leading-snug ${silhouette === s.id ? 'opacity-85' : 'text-[var(--text-muted)]'}`}>
                      {s.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Graphic Artwork & Custom Upload */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3">
                <Upload className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  03. GRAPHIC ARTWORK (UPLOAD OR PRESET)
                </h2>
              </div>

              {/* Upload Graphic */}
              <div className="p-4 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase">
                    UPLOAD GRAPHIC TO REPLACE PLACEHOLDER
                  </div>
                  <p className="text-[11px] text-[var(--text-muted)] font-sans">
                    Upload transparent PNG, SVG, or high-contrast artwork. It renders directly on the hoodie preview.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="cursor-pointer py-2.5 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity text-xs font-mono uppercase font-bold flex items-center gap-1.5 shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>CHOOSE FILE</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtworkUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedArtwork && (
                    <button
                      type="button"
                      onClick={() => setUploadedArtwork(null)}
                      className="p-2 text-xs font-mono text-red-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Inbuilt Graphic Presets */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                  OR SELECT ANIME VECTOR PRESET
                </label>
                <select
                  value={graphicType}
                  onChange={(e) => {
                    setGraphicType(e.target.value);
                    setUploadedArtwork(null);
                  }}
                  className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                >
                  <option value="op-sun-god">One Piece — Sun God Nika Drum Spirals</option>
                  <option value="op-straw-hat">One Piece — Straw Hat Jolly Roger</option>
                  <option value="op-room">One Piece — Trafalgar Law Room Sphere</option>
                  <option value="jjk-shrine">JJK — Malevolent Torii Bone Lattice</option>
                  <option value="jjk-void">JJK — Limitless Ocular Singularity</option>
                  <option value="berserk-brand">Berserk — Sacrifice Brand Bleed Sigil</option>
                  <option value="berserk-relic">Berserk — Dragonslayer Stencil</option>
                  <option value="dbz-instinct">DBS — Autonomous Silver Ki Heat</option>
                  <option value="dbz-hakai">DBS — Hakai Oblivion Sphere</option>
                  <option value="bespoke">Custom Atelier Monogram</option>
                </select>
              </div>

              {/* Front Design Toggle */}
              <label className="flex items-center space-x-3 p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasFrontDesign}
                  onChange={(e) => setHasFrontDesign(e.target.checked)}
                  className="rounded border-[var(--border-subtle)] text-red-600 focus:ring-0"
                />
                <span className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold">
                  INCLUDE DUAL-SIDED DESIGN (FRONT CHEST EMBLEM + MONUMENTAL BACK PRINT)
                </span>
              </label>
            </div>

            {/* 4. Hex Color Grid & Colorways */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-5">
              <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[var(--accent)]" />
                  <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                    04. COLORWAYS &amp; HEX PALETTE
                  </h2>
                </div>
                <div className="flex space-x-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setPaletteTab('curated')}
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold ${
                      paletteTab === 'curated'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                        : 'text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    Curated
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaletteTab('hexgrid')}
                    className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold ${
                      paletteTab === 'hexgrid'
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                        : 'text-[var(--text-secondary)] border border-[var(--border-subtle)]'
                    }`}
                  >
                    Hex Grid
                  </button>
                </div>
              </div>

              {/* Active Base Color Preview & Hex Input */}
              <div className="flex items-center gap-4 p-3 bg-[var(--bg-canvas)] rounded-2xl border border-[var(--border-subtle)]">
                <span
                  className="w-10 h-10 rounded-xl border border-white/20 shadow-inner"
                  style={{ backgroundColor: selectedHex }}
                />
                <div className="flex-1 space-y-0.5">
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">
                    ACTIVE COLORWAY HEX
                  </span>
                  <input
                    type="text"
                    value={customHexInput}
                    onChange={(e) => {
                      setCustomHexInput(e.target.value);
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value) || /^#[0-9A-Fa-f]{3}$/.test(e.target.value)) {
                        handleColorSelect(e.target.value);
                      }
                    }}
                    className="w-32 px-2 py-1 bg-[var(--bg-surface)] border border-[var(--border-hairline)] rounded text-xs font-mono font-bold text-[var(--text-primary)] uppercase"
                  />
                </div>
              </div>

              {/* Curated or Hex Grid */}
              {paletteTab === 'curated' ? (
                <div className="space-y-4">
                  {CURATED_PALETTES.map((group) => (
                    <div key={group.name} className="space-y-1.5">
                      <span className="text-[9px] font-mono uppercase text-[var(--text-muted)] tracking-wider">
                        {group.name}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {group.colors.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => handleColorSelect(c.hex, c.id)}
                            className={`w-8 h-8 rounded-full border transition-all ${
                              selectedHex === c.hex ? 'ring-2 ring-[var(--text-primary)] scale-110' : 'opacity-80 hover:opacity-100'
                            }`}
                            style={{ backgroundColor: c.hex }}
                            title={`${c.name} (${c.hex})`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  <span className="text-[9px] font-mono uppercase text-[var(--text-muted)] tracking-wider">
                    SPECTRUM SWATCHES (40 SHADES)
                  </span>
                  <div className="grid grid-cols-10 gap-1.5 p-2 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-subtle)]">
                    {HEX_GRID_SWATCHES.map((hex) => (
                      <button
                        key={hex}
                        type="button"
                        onClick={() => handleColorSelect(hex)}
                        className={`aspect-square rounded border transition-all ${
                          selectedHex === hex ? 'ring-2 ring-white scale-115 z-10' : 'opacity-80 hover:opacity-100'
                        }`}
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available Colors for this Product */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                  AVAILABLE INVENTORY COLORWAYS (CHECK ALL THAT APPLY)
                </span>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(HOODIE_COLORWAYS).map((colorKey) => {
                    const col = HOODIE_COLORWAYS[colorKey];
                    const isAvailable = availableColors.includes(colorKey);
                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => toggleAvailableColor(colorKey)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
                          isAvailable
                            ? 'bg-[var(--bg-canvas)] border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-50'
                        }`}
                      >
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.hex }} />
                        <span>{col.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 5. Custom Tags for Store Searchbar */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-3">
                <Tag className="w-4 h-4 text-[var(--accent)]" />
                <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                  05. SEARCH TAGS (DISCOVERY ENGINE)
                </h2>
              </div>

              <p className="text-xs text-[var(--text-secondary)] font-sans">
                Add specific tags (characters, moments, aesthetics) so shoppers can find this design instantly in the storefront search bar.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="w-3.5 h-3.5 absolute left-3 top-3 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                    placeholder="e.g. luffy, gojo, nika, berserk, cropped"
                    className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="py-2.5 px-4 rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] text-xs font-mono uppercase font-bold"
                >
                  ADD TAG
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-full text-xs font-mono text-[var(--text-primary)] flex items-center gap-1.5"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="text-[var(--text-muted)] hover:text-red-400 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Inventory Allocation Matrix for this piece */}
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
                <div className="flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[var(--accent)]" />
                  <h2 className="text-sm font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
                    06. INVENTORY MATRIX (COLOR × SIZE)
                  </h2>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAllInventory(20)}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
                  >
                    Set All 20
                  </button>
                  <button
                    type="button"
                    onClick={() => setAllInventory(0)}
                    className="text-[10px] font-mono text-red-400 hover:underline"
                  >
                    Zero Out
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[var(--border-hairline)] text-[10px] text-[var(--text-muted)] uppercase">
                      <th className="py-2 pr-3">Colorway</th>
                      <th className="py-2 px-2 text-center">S</th>
                      <th className="py-2 px-2 text-center">M</th>
                      <th className="py-2 px-2 text-center">L</th>
                      <th className="py-2 px-2 text-center">XL</th>
                      <th className="py-2 px-2 text-center">XXL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availableColors.map((colKey) => (
                      <tr key={colKey} className="border-b border-[var(--border-hairline)]">
                        <td className="py-2.5 pr-3 uppercase font-bold text-[var(--text-primary)] flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: HOODIE_COLORWAYS[colKey]?.hex || '#444' }}
                          />
                          <span>{HOODIE_COLORWAYS[colKey]?.name || colKey}</span>
                        </td>
                        {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => (
                          <td key={sz} className="py-2 px-1 text-center">
                            <input
                              type="number"
                              min="0"
                              max="999"
                              value={inventoryMatrix[colKey]?.[sz] ?? 15}
                              onChange={(e) => updateInventoryQty(colKey, sz, Number(e.target.value))}
                              className="w-14 px-2 py-1 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded text-center text-xs font-mono text-[var(--text-primary)] focus:outline-none"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Direct Publish CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-4 text-xs font-mono uppercase tracking-[0.25em] font-bold rounded-2xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>PUBLISH HOODIE DIRECTLY TO STOREFRONT</span>
              </button>
              {saveSuccess && (
                <p className="text-xs font-mono text-emerald-400 mt-2 text-center animate-pulse flex items-center justify-center gap-1 font-bold">
                  <Check className="w-4 h-4" />
                  LIVE ON STOREFRONT! Refresh or browse the store to see it instantly.
                </p>
              )}
            </div>
          </form>
        </div>
      )}

      {/* ===================== TAB 2: INVENTORY & STOCK MANAGEMENT ===================== */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
              <input
                type="text"
                value={inventorySearch}
                onChange={(e) => setInventorySearch(e.target.value)}
                placeholder="Search catalog by title, series, or tag..."
                className="w-full pl-9 pr-4 py-2.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleResetCatalog}
              className="py-2 px-3 text-[11px] font-mono uppercase text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RESET CATALOG TO FACTORY DEFAULT</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredCatalog.map((item) => {
              const currentInv = item.inventory || createDefaultInventory(item.availableColors, 12);
              const totalStock = Object.values(currentInv).reduce(
                (acc, sizeMap) => acc + Object.values(sizeMap).reduce((sAcc, q) => sAcc + q, 0),
                0
              );

              return (
                <div
                  key={item.id}
                  className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[var(--border-hairline)] pb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0">
                        <ProceduralHoodie
                          colorKey={item.defaultColor}
                          graphicType={item.graphicType as any}
                          customImage={item.customArtworkUrl}
                          silhouette={item.silhouette || 'oversized'}
                          view="back"
                          size="100%"
                          showBacklight={false}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-[var(--accent)] font-bold uppercase">
                            {item.series}
                          </span>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-[var(--text-muted)] uppercase">
                            {item.silhouette || 'oversized'}
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400 font-bold">
                            {totalStock} PIECES IN STOCK
                          </span>
                        </div>
                        <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase">
                          {item.name}
                        </h3>
                        <div className="text-xs font-mono text-[var(--text-secondary)]">
                          ${item.price}.00 USD
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(item.id)}
                        className="py-1.5 px-3 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>

                  {/* Stock Grid per Size */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase block">
                      STOCK PER COLORWAY &amp; SIZE:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.availableColors.map((col) => (
                        <div
                          key={col}
                          className="p-3 bg-[var(--bg-canvas)] rounded-xl border border-[var(--border-hairline)] space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs font-mono uppercase font-bold text-[var(--text-primary)]">
                            <span className="flex items-center gap-1.5">
                              <span
                                className="w-2.5 h-2.5 rounded-full"
                                style={{ backgroundColor: HOODIE_COLORWAYS[col]?.hex || '#444' }}
                              />
                              {HOODIE_COLORWAYS[col]?.name || col}
                            </span>
                          </div>

                          <div className="grid grid-cols-5 gap-1.5">
                            {(['S', 'M', 'L', 'XL', 'XXL'] as const).map((sz) => {
                              const qty = currentInv[col]?.[sz] ?? 0;
                              return (
                                <div key={sz} className="text-center space-y-1">
                                  <span className="text-[9px] font-mono text-[var(--text-muted)] block">
                                    {sz}
                                  </span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={qty}
                                    onChange={(e) =>
                                      handleUpdateItemStock(item.id, col, sz, Number(e.target.value))
                                    }
                                    className={`w-full py-1 text-center text-xs font-mono rounded border ${
                                      qty === 0
                                        ? 'border-red-500/50 bg-red-500/10 text-red-400 font-bold'
                                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)]'
                                    }`}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
