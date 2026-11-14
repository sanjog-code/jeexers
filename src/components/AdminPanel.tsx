import React, { useState } from 'react';
import type { HoodieItem } from '../data/products';
import { HOODIE_COLLECTION } from '../data/products';
import { ProceduralHoodie, HOODIE_COLORWAYS } from './ProceduralHoodie';
import {
  Lock,
  Plus,
  Trash2,
  Download,
  Copy,
  Check,
  Eye,
  Upload,
  Package,
  RefreshCw,
  AlertCircle
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

  const [activeTab, setActiveTab] = useState<'add' | 'manage' | 'export'>('add');

  // Form State for New Hoodie
  const [name, setName] = useState('');
  const [series, setSeries] = useState<HoodieItem['series']>('ONE-PIECE');
  const [price, setPrice] = useState<number>(195);
  const [description, setDescription] = useState('');
  const [defaultColor, setDefaultColor] = useState('onyx');
  const [availableColors, setAvailableColors] = useState<string[]>(['onyx', 'bone', 'charcoal']);
  const [graphicType, setGraphicType] = useState<HoodieItem['graphicType']>('op-sun-god');
  const [hasFrontDesign, setHasFrontDesign] = useState(true);
  const [uploadedArtwork, setUploadedArtwork] = useState<string | null>(null);

  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret access key: jeexers2026
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

  // Image Upload Handler
  const handleArtworkUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedArtwork(result);
        setGraphicType('custom-upload' as any);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleColor = (c: string) => {
    if (availableColors.includes(c)) {
      if (availableColors.length > 1) {
        setAvailableColors(availableColors.filter((col) => col !== c));
        if (defaultColor === c) {
          const remaining = availableColors.filter((col) => col !== c);
          setDefaultColor(remaining[0]);
        }
      }
    } else {
      setAvailableColors([...availableColors, c]);
    }
  };

  // Add Product to Live Storefront
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `${series.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newItem: HoodieItem = {
      id: newId,
      name: name.trim().toUpperCase(),
      series,
      price: Number(price) || 195,
      graphicType,
      defaultColor,
      availableColors,
      description: description.trim() || 'Heavyweight 100% cotton fleece with original artwork.',
      hasFrontDesign,
      customArtworkUrl: uploadedArtwork || undefined,
    };

    const updated = [newItem, ...catalog];
    onUpdateCatalog(updated);

    // Save to localStorage for automatic reload
    try {
      localStorage.setItem('jeexers_custom_catalog', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);

    // Reset Form
    setName('');
    setDescription('');
    setUploadedArtwork(null);
  };

  // Delete Product
  const handleDeleteProduct = (id: string) => {
    if (confirm('Are you sure you want to remove this hoodie from the store?')) {
      const updated = catalog.filter((item) => item.id !== id);
      onUpdateCatalog(updated);
      try {
        localStorage.setItem('jeexers_custom_catalog', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }
    }
  };

  // Reset to original default collection
  const handleResetCatalog = () => {
    if (confirm('Reset entire catalog to original default items? Custom uploads will be cleared.')) {
      onUpdateCatalog(HOODIE_COLLECTION);
      localStorage.removeItem('jeexers_custom_catalog');
    }
  };

  // Copy TypeScript code for permanent inclusion in products.ts
  const handleCopyTS = () => {
    const code = `export const HOODIE_COLLECTION: HoodieItem[] = ${JSON.stringify(catalog, null, 2)};`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  // Download JSON
  const handleDownloadJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catalog, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'jeexers_products.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-20 max-w-md mx-auto flex flex-col justify-center font-sans">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-2">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)]">
              RESTRICTED ACCESS
            </span>
            <h1 className="text-xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              ATELIER ADMIN PANEL
            </h1>
            <p className="text-xs text-[var(--text-secondary)] font-sans">
              Enter the master access key to manage hoodie inventory and upload new pieces.
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
              UNLOCK ADMIN PORTAL
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

  // 2. Authenticated Admin Dashboard
  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-4 sm:px-6 py-8 sm:py-16 max-w-7xl mx-auto font-sans space-y-10">
      {/* Top Bar with Navigation & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-[var(--border-hairline)]">
        <div>
          <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-red-500 font-bold block mb-1">
            SECRET ADMIN DASHBOARD
          </span>
          <h1 className="text-2xl sm:text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase flex items-center gap-3">
            <span>HOODIE CATALOG MANAGER</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-normal">
              {catalog.length} HOODIES LIVE
            </span>
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

      {/* Navigation Tabs */}
      <div className="flex space-x-2 border-b border-[var(--border-hairline)] pb-4 text-xs font-mono">
        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className={`py-2 px-4 rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'add'
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>UPLOAD NEW HOODIE</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('manage')}
          className={`py-2 px-4 rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'manage'
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>INVENTORY LIST ({catalog.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('export')}
          className={`py-2 px-4 rounded-lg uppercase tracking-wider transition-all flex items-center gap-2 ${
            activeTab === 'export'
              ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>EXPORT & SYNC CODE</span>
        </button>
      </div>

      {/* TAB 1: UPLOAD NEW HOODIE */}
      {activeTab === 'add' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left: Configuration Form */}
          <form onSubmit={handleAddProduct} className="lg:col-span-7 space-y-6">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase border-b border-[var(--border-hairline)] pb-3">
                GARMENT SPECIFICATIONS
              </h2>

              {/* Title & Anime Series */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    HOODIE TITLE / NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. ZORO NINE SWORD ASHURA"
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    ANIME SERIES / CATEGORY
                  </label>
                  <select
                    value={series}
                    onChange={(e) => setSeries(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  >
                    <option value="ONE-PIECE">ONE PIECE</option>
                    <option value="JJK">JUJUTSU KAISEN (JJK)</option>
                    <option value="BERSERK">BERSERK</option>
                    <option value="DBS">DRAGON BALL SUPER (DBS)</option>
                    <option value="CUSTOM">CUSTOM HOODIES</option>
                  </select>
                </div>
              </div>

              {/* Price & Front Design Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    RETAIL PRICE ($ USD)
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="999"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    PRINT PLACEMENT
                  </label>
                  <label className="flex items-center space-x-3 p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-canvas)] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFrontDesign}
                      onChange={(e) => setHasFrontDesign(e.target.checked)}
                      className="rounded border-[var(--border-subtle)] text-red-600 focus:ring-0"
                    />
                    <span className="text-xs font-mono uppercase text-[var(--text-primary)]">
                      INCLUDES FRONT CHEST EMBLEM
                    </span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                  DESCRIPTION / LORE
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Heavyweight cotton fleece with high-density back artwork and front chest crest."
                  className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-sans text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                />
              </div>

              {/* Graphic Silhouette / Preset */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                  ARTWORK STYLE / GRAPHIC PRESET
                </label>
                <select
                  value={graphicType}
                  onChange={(e) => setGraphicType(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-canvas)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--text-primary)]"
                >
                  <option value="op-sun-god">ONE PIECE — Sun God Nika Drum Spirals</option>
                  <option value="op-straw-hat">ONE PIECE — Straw Hat Jolly Roger Crest</option>
                  <option value="op-room">ONE PIECE — Trafalgar Law Room Spheres</option>
                  <option value="jjk-shrine">JJK — Malevolent Torii Bone Lattice</option>
                  <option value="jjk-void">JJK — Limitless Ocular Singularity</option>
                  <option value="berserk-brand">BERSERK — Sacrifice Brand Bleed Sigil</option>
                  <option value="berserk-relic">BERSERK — Dragonslayer Iron Slab</option>
                  <option value="dbz-instinct">DBS — Autonomous Silver Ki Ripples</option>
                  <option value="dbz-hakai">DBS — Hakai Oblivion Sphere</option>
                  <option value="bespoke">CUSTOM — Atelier Geometric Vector</option>
                </select>
              </div>

              {/* Custom Image / Artwork File Upload */}
              <div className="space-y-2 pt-2 border-t border-[var(--border-hairline)]">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                    OR UPLOAD CUSTOM GRAPHIC / ARTWORK (PNG, SVG, JPG)
                  </label>
                  {uploadedArtwork && (
                    <button
                      type="button"
                      onClick={() => setUploadedArtwork(null)}
                      className="text-[10px] font-mono text-red-400 hover:underline"
                    >
                      REMOVE IMAGE
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer py-2.5 px-4 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--text-primary)] bg-[var(--bg-canvas)] transition-all flex items-center gap-2 text-xs font-mono text-[var(--text-primary)]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>CHOOSE FILE...</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleArtworkUpload}
                      className="hidden"
                    />
                  </label>
                  {uploadedArtwork ? (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      Artwork loaded into garment preview!
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">
                      Transparent PNG or high-contrast graphics look best.
                    </span>
                  )}
                </div>
              </div>

              {/* Colorways Config */}
              <div className="space-y-3 pt-2 border-t border-[var(--border-hairline)]">
                <label className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-secondary)] block">
                  AVAILABLE COLORWAYS (CHECK ALL THAT APPLY)
                </label>
                <div className="flex flex-wrap gap-2">
                  {Object.keys(HOODIE_COLORWAYS).map((colorKey) => {
                    const col = HOODIE_COLORWAYS[colorKey];
                    const isAvailable = availableColors.includes(colorKey);
                    const isDefault = defaultColor === colorKey;

                    return (
                      <button
                        key={colorKey}
                        type="button"
                        onClick={() => toggleColor(colorKey)}
                        className={`py-1.5 px-3 rounded-lg text-xs font-mono flex items-center gap-2 border transition-all ${
                          isAvailable
                            ? 'bg-[var(--bg-canvas)] border-[var(--text-primary)] text-[var(--text-primary)] font-bold'
                            : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-muted)] opacity-60'
                        }`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-black/20"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        {isDefault && (
                          <span className="text-[9px] px-1 bg-red-600 text-white rounded">DEFAULT</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-4 text-xs font-mono uppercase tracking-[0.25em] font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-xl"
                >
                  <Plus className="w-4 h-4" />
                  <span>PUBLISH HOODIE TO STOREFRONT</span>
                </button>
                {saveSuccess && (
                  <p className="text-xs font-mono text-emerald-400 mt-2 text-center animate-pulse flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    HOODIE PUBLISHED! Visible in store immediately.
                  </p>
                )}
              </div>
            </div>
          </form>

          {/* Right: Live Real-Time Garment Preview */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-8 space-y-6 flex flex-col items-center">
            <div className="w-full flex justify-between items-center border-b border-[var(--border-hairline)] pb-3">
              <span className="text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
                LIVE STOREFRONT PREVIEW
              </span>
              <span className="text-xs font-mono font-bold text-[var(--accent)] uppercase">
                {series}
              </span>
            </div>

            <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
              <ProceduralHoodie
                colorKey={defaultColor}
                graphicType={graphicType}
                view="back"
                size="100%"
                showBacklight={true}
                hasFrontDesign={hasFrontDesign}
              />
              {/* If user uploaded custom artwork file, render overlay */}
              {uploadedArtwork && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-16">
                  <img
                    src={uploadedArtwork}
                    alt="Custom Upload Artwork"
                    className="max-w-[120px] max-h-[140px] object-contain opacity-85 mix-blend-multiply drop-shadow"
                  />
                </div>
              )}
            </div>

            <div className="text-center space-y-1 w-full border-t border-[var(--border-hairline)] pt-4">
              <h3 className="text-sm font-mono font-bold text-[var(--text-primary)] uppercase truncate">
                {name || 'UNTITLED HOODIE SPECIMEN'}
              </h3>
              <div className="text-xs font-mono text-[var(--text-secondary)]">
                ${price}.00 USD • {HOODIE_COLORWAYS[defaultColor]?.name || defaultColor}
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-sans line-clamp-2 pt-1">
                {description || 'Heavyweight cotton fleece with original artwork.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY LIST & MANAGEMENT */}
      {activeTab === 'manage' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-[var(--text-secondary)]">
              TOTAL PRODUCTS: {catalog.length}
            </span>
            <button
              type="button"
              onClick={handleResetCatalog}
              className="py-1.5 px-3 text-[11px] font-mono uppercase text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>RESET TO DEFAULT CATALOG</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {catalog.map((hoodie, idx) => (
              <div
                key={hoodie.id}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col justify-between space-y-3 relative group"
              >
                <div className="flex justify-between items-start">
                  <span className="text-[9px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
                    0{idx + 1} // {hoodie.series}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(hoodie.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                    title="Remove from store"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-full aspect-square relative flex items-center justify-center">
                  <ProceduralHoodie
                    colorKey={hoodie.defaultColor}
                    graphicType={hoodie.graphicType}
                    view="back"
                    size="85%"
                    showBacklight={false}
                    hasFrontDesign={hoodie.hasFrontDesign}
                  />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-mono font-bold text-[var(--text-primary)] uppercase truncate">
                    {hoodie.name}
                  </h4>
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[var(--text-secondary)]">${hoodie.price}.00</span>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase">
                      {hoodie.availableColors.length} COLORS
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT & SYNC FOR GITHUB / VERCEL */}
      {activeTab === 'export' && (
        <div className="max-w-3xl mx-auto space-y-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl p-6 sm:p-10">
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block">
              DEPLOYMENT & PERSISTENCE
            </span>
            <h2 className="text-xl sm:text-2xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase">
              SYNC CATALOG WITH PRODUCTION REPO
            </h2>
            <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
              When you upload hoodies through this panel, they are instantly stored in your browser's persistent storage and rendered live in the store. To permanently deploy new hoodies so all visitors globally see them on <strong>jeexers.vercel.app</strong>, copy the updated TypeScript code below into <code className="text-[var(--text-primary)]">src/data/products.ts</code> and push to GitHub.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <button
              type="button"
              onClick={handleCopyTS}
              className="py-3 px-6 text-xs font-mono uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg"
            >
              {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCode ? 'CODE COPIED TO CLIPBOARD!' : 'COPY CODE FOR PRODUCTS.TS'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJSON}
              className="py-3 px-6 text-xs font-mono uppercase font-bold rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-elevated)] transition-colors flex items-center gap-2 text-[var(--text-primary)]"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD JSON</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-canvas)] border border-[var(--border-hairline)] text-xs font-mono text-[var(--text-secondary)] space-y-2">
            <div className="text-[var(--text-primary)] font-bold uppercase">QUICK REPO COMMIT INSTRUCTIONS:</div>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-[var(--text-muted)]">
              <li>Click <strong>COPY CODE FOR PRODUCTS.TS</strong> above.</li>
              <li>Paste the contents into <code className="text-[var(--text-primary)]">src/data/products.ts</code>.</li>
              <li>Run <code className="text-[var(--text-primary)]">git commit -am "Update catalog" &amp;&amp; git push</code> or let the AI commit it for you.</li>
              <li>Vercel automatically builds and deploys your new hoodies to <strong>jeexers.vercel.app</strong> in seconds!</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
