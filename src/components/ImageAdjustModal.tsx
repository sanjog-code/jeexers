import React, { useState, useRef, useEffect } from 'react';
import { RotateCw, RotateCcw, Sliders, Check, X } from 'lucide-react';

interface ImageAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  onApply: (adjustedDataUrl: string) => void;
}

export const ImageAdjustModal: React.FC<ImageAdjustModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  onApply,
}) => {
  const [rotation, setRotation] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const [offsetX, setOffsetX] = useState<number>(0);
  const [offsetY, setOffsetY] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [invert, setInvert] = useState<boolean>(false);
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '4:3' | 'circle'>('1:1');
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const imageObjRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (imageUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      img.onload = () => {
        imageObjRef.current = img;
      };
    }
  }, [imageUrl]);

  if (!isOpen) return null;

  const handleRotate = (delta: number) => {
    setRotation((prev) => (prev + delta) % 360);
  };

  const handleReset = () => {
    setRotation(0);
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setInvert(false);
    setAspectRatio('1:1');
  };

  const handleApplyChanges = () => {
    setIsExporting(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx || !imageObjRef.current) {
      onApply(imageUrl);
      onClose();
      setIsExporting(false);
      return;
    }

    const img = imageObjRef.current;
    const outputSize = 800;
    canvas.width = outputSize;
    canvas.height = outputSize;

    ctx.save();
    ctx.clearRect(0, 0, outputSize, outputSize);

    // Apply Filters
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${
      invert ? 'invert(100%)' : ''
    }`;

    // Center and transform
    ctx.translate(outputSize / 2 + offsetX * 2, outputSize / 2 + offsetY * 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(scale, scale);

    // Draw image centered
    const aspect = img.width / img.height;
    let drawWidth = outputSize;
    let drawHeight = outputSize / aspect;
    if (aspect < 1) {
      drawHeight = outputSize;
      drawWidth = outputSize * aspect;
    }

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    // Mask shape if circle
    if (aspectRatio === 'circle') {
      const circleCanvas = document.createElement('canvas');
      circleCanvas.width = outputSize;
      circleCanvas.height = outputSize;
      const cCtx = circleCanvas.getContext('2d');
      if (cCtx) {
        cCtx.beginPath();
        cCtx.arc(outputSize / 2, outputSize / 2, outputSize / 2 - 10, 0, Math.PI * 2);
        cCtx.closePath();
        cCtx.clip();
        cCtx.drawImage(canvas, 0, 0);
        const result = circleCanvas.toDataURL('image/png');
        onApply(result);
        setIsExporting(false);
        onClose();
        return;
      }
    }

    const result = canvas.toDataURL('image/png');
    onApply(result);
    setIsExporting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-md" />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-3xl p-6 sm:p-8 z-10 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-4">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[var(--text-primary)]" />
            <span className="text-xs font-mono tracking-[0.25em] text-[var(--text-primary)] font-bold uppercase">
              ARTWORK CROP, ROTATE & TONAL CALIBRATION
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase p-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive Preview Frame */}
          <div className="md:col-span-6 flex flex-col items-center justify-center p-6 rounded-2xl bg-[var(--bg-canvas)] border border-[var(--border-subtle)] overflow-hidden">
            <div
              className={`relative overflow-hidden flex items-center justify-center transition-all bg-black/20 ${
                aspectRatio === 'circle'
                  ? 'rounded-full w-64 h-64 border-2 border-dashed border-[var(--text-primary)]/40'
                  : aspectRatio === '3:4'
                  ? 'rounded-xl w-56 h-72 border border-[var(--border-focus)]'
                  : aspectRatio === '4:3'
                  ? 'rounded-xl w-72 h-56 border border-[var(--border-focus)]'
                  : 'rounded-xl w-64 h-64 border border-[var(--border-focus)]'
              }`}
            >
              <img
                src={imageUrl}
                alt="Crop preview"
                className="max-w-none transition-transform duration-100 object-contain pointer-events-none"
                style={{
                  transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${scale})`,
                  filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${
                    invert ? 'invert(100%)' : ''
                  }`,
                  width: '100%',
                  height: '100%',
                }}
              />
            </div>
            <span className="text-[10px] font-mono tracking-widest text-[var(--text-muted)] uppercase mt-4">
              CANVAS CROPPING BOUNDARY ({aspectRatio.toUpperCase()})
            </span>
          </div>

          {/* Right: Fine-Grain Controls */}
          <div className="md:col-span-6 space-y-5 text-xs font-mono">
            {/* Aspect Ratio Framing */}
            <div>
              <span className="block text-[10px] tracking-wider text-[var(--text-secondary)] uppercase mb-2">
                FRAMING RATIO
              </span>
              <div className="grid grid-cols-4 gap-2">
                {(['1:1', '3:4', '4:3', 'circle'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-2 text-[10px] tracking-wider uppercase rounded-lg border transition-colors ${
                      aspectRatio === ratio
                        ? 'bg-[var(--text-primary)] text-[var(--bg-canvas)] font-bold border-transparent'
                        : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Rotation Control */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-[10px] text-[var(--text-secondary)] uppercase">
                <span>ROTATION</span>
                <span className="text-[var(--text-primary)] font-bold">{rotation}°</span>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => handleRotate(-90)}
                  className="p-2 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-hairline)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
                  title="Rotate -90°"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="-180"
                  max="180"
                  value={rotation}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="flex-1 accent-[var(--text-primary)]"
                />
                <button
                  type="button"
                  onClick={() => handleRotate(90)}
                  className="p-2 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-hairline)] hover:text-[var(--text-primary)] text-[var(--text-secondary)]"
                  title="Rotate +90°"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Zoom / Scale Control */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-[10px] text-[var(--text-secondary)] uppercase">
                <span>MAGNIFICATION / ZOOM</span>
                <span className="text-[var(--text-primary)] font-bold">{scale.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="w-full accent-[var(--text-primary)]"
              />
            </div>

            {/* Position Pan Sliders */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  <span>PAN X</span>
                  <span>{offsetX}px</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={offsetX}
                  onChange={(e) => setOffsetX(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  <span>PAN Y</span>
                  <span>{offsetY}px</span>
                </div>
                <input
                  type="range"
                  min="-80"
                  max="80"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
            </div>

            {/* Tonal Filters: Contrast & Brightness */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  <span>CONTRAST</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-[var(--text-secondary)] uppercase mb-1">
                  <span>BRIGHTNESS</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-[var(--text-primary)]"
                />
              </div>
            </div>

            {/* Quick Filters: Invert & Saturation */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setInvert(!invert)}
                className={`py-1.5 px-3 rounded-lg border text-[10px] tracking-wider uppercase transition-colors ${
                  invert
                    ? 'bg-amber-400 text-black font-bold border-amber-400'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                }`}
              >
                {invert ? 'INVERT INK (ACTIVE)' : 'INVERT INK COLORS'}
              </button>

              <button
                type="button"
                onClick={() => setSaturation((prev) => (prev === 0 ? 100 : 0))}
                className={`py-1.5 px-3 rounded-lg border text-[10px] tracking-wider uppercase transition-colors ${
                  saturation === 0
                    ? 'bg-neutral-200 text-black font-bold border-white'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] border-[var(--border-hairline)]'
                }`}
              >
                {saturation === 0 ? 'B&W MANGA (ACTIVE)' : 'B&W MONOCHROME'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center pt-4 border-t border-[var(--border-hairline)]">
          <button
            type="button"
            onClick={handleReset}
            className="text-[10px] font-mono tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] uppercase"
          >
            RESET TO DEFAULT
          </button>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 text-xs font-mono uppercase rounded-xl border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleApplyChanges}
              disabled={isExporting}
              className="py-2.5 px-6 text-xs font-mono uppercase font-bold rounded-xl bg-[var(--text-primary)] text-[var(--bg-canvas)] hover:opacity-90 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>APPLY TO HOODIE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
