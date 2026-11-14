import React, { useState } from 'react';
import type { GarmentPlacement } from './ProceduralHoodie';
import { ProceduralHoodie } from './ProceduralHoodie';
import { CURATED_PALETTES, HEX_GRID_SWATCHES } from '../data/palettes';
import { ImageAdjustModal } from './ImageAdjustModal';
import { InteractiveMagnetic } from './InteractiveMagnetic';
import { Upload, Check, Sliders, RefreshCw } from 'lucide-react';

interface BespokePageProps {
  onBespokeOrder: (
    concept: string,
    color: string,
    size: string,
    customImage?: string | null
  ) => void;
}

interface BespokePreset {
  id: string;
  name: string;
  colorHex: string;
  prompt: string;
  placement: GarmentPlacement;
}

const BESPOKE_PRESETS: BespokePreset[] = [
  { id: 'eva', name: 'EVA-01 BERSERK', colorHex: '#141416', prompt: 'Neon biomechanical berserker horn and geometric blood splatters', placement: 'upper-back' },
  { id: 'sukuna', name: 'SUKUNA FLAME ARROW', colorHex: '#242428', prompt: 'Fuga thermal fire bow discharged across raw cotton fibers', placement: 'center-chest' },
  { id: 'gojo', name: 'HOLLOW PURPLE', colorHex: '#d6d1c7', prompt: 'Colliding red and blue singularity event horizon vortex', placement: 'upper-back' },
  { id: 'femto', name: 'FEMTO ECLIPSE', colorHex: '#3a161b', prompt: 'Astral bird skull of despair under an ominous blood moon', placement: 'center-back' },
  { id: 'hakai', name: 'ULTRA EGO VEGETA', colorHex: '#3a312b', prompt: 'Hakai sphere of total oblivion with primal lightning arcs', placement: 'all-over' },
  { id: 'dragon', name: 'CELESTIAL SHENRON', colorHex: '#2b312a', prompt: 'Imperial golden dragon scale brush calligraphy', placement: 'upper-back' },
];

export const BespokePage: React.FC<BespokePageProps> = ({ onBespokeOrder }) => {
  const [selectedHex, setSelectedHex] = useState<string>('#141416');
  const [customHexInput, setCustomHexInput] = useState<string>('#141416');
  const [view, setView] = useState<'front' | 'back'>('back');
  const [placement, setPlacement] = useState<GarmentPlacement>('upper-back');
  const [selectedSize, setSelectedSize] = useState<string>('XL');
  const [concept, setConcept] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState<boolean>(false);
  const [blendMode, setBlendMode] = useState<'multiply' | 'normal' | 'screen'>('multiply');
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [paletteTab, setPaletteTab] = useState<'curated' | 'hexgrid'>('curated');

  // Handle Raw File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
        setIsAdjustModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Select Preset
  const handleSelectPreset = (preset: BespokePreset) => {
    setConcept(preset.prompt);
    setSelectedHex(preset.colorHex);
    setCustomHexInput(preset.colorHex);
    setPlacement(preset.placement);
    setUploadedImage(null);
  };

  // Custom Color Selection
  const handleColorChange = (hex: string) => {
    setSelectedHex(hex);
    setCustomHexInput(hex);
  };

  const handleCustomHexSubmit = (val: string) => {
    setCustomHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
      setSelectedHex(val);
    }
  };

  // AI Concept Simulator
  const handleGenerateAi = () => {
    if (!concept.trim()) return;
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() && !uploadedImage) return;
    onBespokeOrder(concept || 'Bespoke Atelier Commission', selectedHex, selectedSize, uploadedImage);
    setSubmitted(true);
  };

  const backPlacements: { id: GarmentPlacement; label: string }[] = [
    { id: 'upper-back', label: 'UPPER SPANNING' },
    { id: 'center-back', label: 'CENTER STAMP' },
    { id: 'lower-hem', label: 'LOWER SPINE' },
    { id: 'all-over', label: 'ALL-OVER CANOPY' },
  ];

  const frontPlacements: { id: GarmentPlacement; label: string }[] = [
    { id: 'center-chest', label: 'CENTER CHEST' },
    { id: 'left-chest', label: 'POCKET CREST' },
    { id: 'cowl-arch', label: 'COWL ARCH' },
    { id: 'kangaroo-pocket', label: 'KANGAROO WRAP' },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] px-6 py-10 sm:py-16 max-w-7xl mx-auto flex flex-col justify-center font-sans">
      {/* Modal for Image Adjustments */}
      {uploadedImage && (
        <ImageAdjustModal
          isOpen={isAdjustModalOpen}
          onClose={() => setIsAdjustModalOpen(false)}
          imageUrl={uploadedImage}
          onApply={(adjusted) => setUploadedImage(adjusted)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Live Garment Viewport */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-12 rounded-3xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] relative overflow-hidden">
          {/* Angle Perspective Toggle */}
          <div className="w-full flex justify-between items-center mb-6">
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase">
              STUDIO REAL-TIME VIEWPORT
            </span>
            <div className="flex space-x-2 text-xs font-sans">
              <InteractiveMagnetic
                type="button"
                onClick={() => setView('back')}
                strength={0.2}
                className={`px-3.5 py-1.5 rounded-lg transition-colors text-xs font-semibold ${
                  view === 'back'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                BACK VIEW
              </InteractiveMagnetic>
              <InteractiveMagnetic
                type="button"
                onClick={() => setView('front')}
                strength={0.2}
                className={`px-3.5 py-1.5 rounded-lg transition-colors text-xs font-semibold ${
                  view === 'front'
                    ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)]'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                FRONT VIEW
              </InteractiveMagnetic>
            </div>
          </div>

          {/* Interactive Procedural Hoodie */}
          <div className="w-full max-w-lg aspect-square flex items-center justify-center relative transition-all duration-300">
            <ProceduralHoodie
              customHex={selectedHex}
              view={view}
              placement={placement}
              blendMode={blendMode}
              customImage={uploadedImage}
              graphicType="bespoke"
              size="100%"
              showBacklight={true}
            />
          </div>

          {/* Viewport Action Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-sans">
            {uploadedImage ? (
              <InteractiveMagnetic
                type="button"
                onClick={() => setIsAdjustModalOpen(true)}
                strength={0.25}
                className="px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:border-[var(--text-primary)] text-[var(--text-primary)] flex items-center gap-2 transition-colors font-semibold"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>ADJUST / CROP / ROTATE ARTWORK</span>
              </InteractiveMagnetic>
            ) : null}

            <div className="text-[11px] font-mono text-[var(--text-secondary)] uppercase">
              BASE COLOR: <span className="text-[var(--text-primary)] font-bold">{selectedHex.toUpperCase()}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Suite */}
        <div className="lg:col-span-5 space-y-7">
          <div>
            <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[var(--text-muted)] block">
              CUSTOM HOODIE STUDIO
            </span>
            <h1 className="text-3xl font-hero font-bold tracking-tight text-[var(--text-primary)] uppercase mt-1">
              CUSTOM 1-OF-1 HOODIE
            </h1>
            <div className="mt-1 text-2xl font-mono text-[var(--text-primary)] font-bold tabular-nums">
              $260.00
            </div>
          </div>

          {/* Placement Usabilities */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase block">
              ARTWORK PLACEMENT ({view.toUpperCase()})
            </span>
            <div className="grid grid-cols-2 gap-2 font-sans">
              {(view === 'back' ? backPlacements : frontPlacements).map((p) => (
                <InteractiveMagnetic
                  key={p.id}
                  type="button"
                  onClick={() => setPlacement(p.id)}
                  strength={0.2}
                  className={`py-2 px-3 text-[11px] font-semibold tracking-wider uppercase rounded-lg border text-left transition-colors ${
                    placement === p.id
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-transparent'
                      : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-hairline)] hover:border-[var(--border-subtle)]'
                  }`}
                >
                  {p.label}
                </InteractiveMagnetic>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono tracking-wider text-[var(--text-secondary)] uppercase block">
              PRESET INSPIRATIONS
            </span>
            <div className="flex flex-wrap gap-2">
              {BESPOKE_PRESETS.map((p) => (
                <InteractiveMagnetic
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  strength={0.2}
                  className="px-3 py-1.5 text-[10px] font-sans font-semibold tracking-wider uppercase rounded-lg bg-[var(--bg-surface)] border border-[var(--border-hairline)] hover:border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  {p.name}
                </InteractiveMagnetic>
              ))}
            </div>
          </div>

          {/* Color Palettes & Hex Grid System */}
          <div className="space-y-3 p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)]">
            <div className="flex justify-between items-center text-xs uppercase font-sans">
              <span className="text-[var(--text-primary)] font-bold tracking-wider">
                FABRIC COLOR PALETTES
              </span>
              <div className="flex space-x-1 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => setPaletteTab('curated')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    paletteTab === 'curated'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  CURATED
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteTab('hexgrid')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    paletteTab === 'hexgrid'
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  HEX GRID
                </button>
              </div>
            </div>

            {paletteTab === 'curated' ? (
              <div className="space-y-3 pt-1">
                {CURATED_PALETTES.map((group) => (
                  <div key={group.name} className="space-y-1.5">
                    <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                      {group.name}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.colors.map((c) => (
                        <InteractiveMagnetic
                          key={c.id}
                          type="button"
                          onClick={() => handleColorChange(c.hex)}
                          strength={0.25}
                          ariaLabel={`Select ${c.name} (${c.hex})`}
                          className={`w-7 h-7 rounded-full border border-[var(--border-subtle)] transition-transform ${
                            selectedHex.toLowerCase() === c.hex.toLowerCase()
                              ? 'ring-2 ring-[var(--text-primary)] scale-110'
                              : 'opacity-80 hover:opacity-100'
                          }`}
                        >
                          <span className="block w-full h-full rounded-full" style={{ backgroundColor: c.hex }} />
                        </InteractiveMagnetic>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Hex Swatch Grid & Custom Picker */
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-6 gap-2">
                  {HEX_GRID_SWATCHES.map((hex) => (
                    <InteractiveMagnetic
                      key={hex}
                      type="button"
                      onClick={() => handleColorChange(hex)}
                      strength={0.2}
                      ariaLabel={`Select hex ${hex}`}
                      className={`h-7 rounded-md border border-[var(--border-hairline)] transition-all ${
                        selectedHex.toLowerCase() === hex.toLowerCase()
                          ? 'ring-2 ring-[var(--text-primary)] scale-105'
                          : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <span className="block w-full h-full rounded-[inherit]" style={{ backgroundColor: hex }} />
                    </InteractiveMagnetic>
                  ))}
                </div>

                {/* Free Custom Hex Input & Color Wheel */}
                <div className="flex items-center space-x-2 pt-2 border-t border-[var(--border-hairline)]">
                  <input
                    type="color"
                    value={selectedHex}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-[var(--border-subtle)] bg-transparent cursor-pointer"
                    title="Open Color Wheel"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={customHexInput}
                      onChange={(e) => handleCustomHexSubmit(e.target.value)}
                      placeholder="#141416"
                      className="w-full px-3 py-1.5 bg-[var(--bg-surface-elevated)] border border-[var(--border-hairline)] rounded-lg text-xs font-mono text-[var(--text-primary)] uppercase focus:outline-none focus:border-[var(--border-focus)]"
                    />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase">HEX INPUT</span>
                </div>
              </div>
            )}
          </div>

          {/* Upload Custom Image & Print Finish */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-3 font-sans">
            <div className="flex justify-between items-center text-xs uppercase font-bold">
              <span className="text-[var(--text-primary)]">CUSTOM ARTWORK FILE</span>
              {uploadedImage && (
                <button
                  type="button"
                  onClick={() => setUploadedImage(null)}
                  className="text-[10px] font-mono text-red-400 hover:text-red-300 uppercase font-normal"
                >
                  REMOVE
                </button>
              )}
            </div>

            <label className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-dashed border-[var(--border-subtle)] hover:border-[var(--text-primary)] rounded-xl cursor-pointer text-xs tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Upload className="w-4 h-4" />
              <span className="font-semibold">{uploadedImage ? 'SELECT DIFFERENT ARTWORK' : 'UPLOAD PNG / JPG'}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Print Finish / Blend Mode */}
            <div className="pt-2">
              <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block mb-1.5">
                DISCHARGE INK FINISH
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'multiply', label: 'DISCHARGE' },
                  { id: 'normal', label: 'SOLID' },
                  { id: 'screen', label: 'VINTAGE' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setBlendMode(mode.id as 'multiply' | 'normal' | 'screen')}
                    className={`py-1.5 text-[10px] font-mono uppercase font-semibold rounded border transition-colors ${
                      blendMode === mode.id
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] border-transparent'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Concept Simulator */}
          <div className="p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-hairline)] space-y-3 font-sans">
            <span className="text-xs uppercase tracking-wider text-[var(--text-primary)] font-bold block">
              AI ATELIER VISION GENERATOR
            </span>

            <div className="flex gap-2">
              <input
                type="text"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                placeholder="Describe your anime vision..."
                className="flex-1 px-3 py-2 bg-[var(--bg-surface-elevated)] border border-[var(--border-hairline)] rounded-lg text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
              />
              <InteractiveMagnetic
                type="button"
                onClick={handleGenerateAi}
                strength={0.25}
                className="px-4 py-2 bg-[var(--text-primary)] text-[var(--bg-canvas)] rounded-lg text-xs font-mono tracking-wider uppercase font-bold disabled:opacity-50 flex items-center gap-1.5 focus:outline-none"
              >
                {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'GENERATE'}
              </InteractiveMagnetic>
            </div>
          </div>

          {/* Size Matrix */}
          <div>
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[var(--text-secondary)] mb-2">
              SIZE (BOXY OVERSIZED FIT)
            </div>
            <div className="grid grid-cols-5 gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-2 text-xs font-mono tracking-wider rounded-lg transition-all ${
                    selectedSize === s
                      ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          {submitted ? (
            <div className="p-6 rounded-2xl bg-[var(--bg-surface-elevated)] border border-emerald-500/30 text-center space-y-2">
              <div className="text-sm font-mono tracking-wider text-emerald-400 uppercase font-bold flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                COMMISSION ADDED TO BAG
              </div>
              <p className="text-xs text-[var(--text-secondary)] font-sans">
                Your custom piece is packaged. Open bag to enter checkout.
              </p>
            </div>
          ) : (
            <InteractiveMagnetic
              type="button"
              onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
              strength={0.3}
              className="w-full py-4 text-xs font-mono tracking-[0.25em] uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] shadow-lg flex items-center justify-center"
            >
              <span>LOCK IN CUSTOM COMMISSION ($260)</span>
            </InteractiveMagnetic>
          )}
        </div>
      </div>
    </div>
  );
};
