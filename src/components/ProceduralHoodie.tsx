import React from 'react';
import { calculateHoodieColors } from '../utils/colorUtils';

export interface HoodieColor {
  name: string;
  hex: string;
  shadow: string;
  highlight: string;
  accent: string;
}

export const HOODIE_COLORWAYS: Record<string, HoodieColor> = {
  onyx: {
    name: 'Washed Onyx',
    hex: '#141416',
    shadow: '#09090b',
    highlight: '#2c2c30',
    accent: '#44444a',
  },
  bone: {
    name: 'Raw Bone',
    hex: '#d6d1c7',
    shadow: '#9e978a',
    highlight: '#f2ede4',
    accent: '#757066',
  },
  mud: {
    name: 'Mineral Mud',
    hex: '#3a312b',
    shadow: '#201a17',
    highlight: '#564a42',
    accent: '#6e5e54',
  },
  charcoal: {
    name: 'Pumice Charcoal',
    hex: '#242428',
    shadow: '#121215',
    highlight: '#3c3c44',
    accent: '#565660',
  },
  moss: {
    name: 'Washed Moss',
    hex: '#2b312a',
    shadow: '#161a15',
    highlight: '#434c41',
    accent: '#5a6657',
  },
  crimson: {
    name: 'Oxblood Void',
    hex: '#3a161b',
    shadow: '#1e080b',
    highlight: '#5a252c',
    accent: '#7c333c',
  },
};

export type GarmentPlacement =
  | 'upper-back'
  | 'center-back'
  | 'lower-hem'
  | 'all-over'
  | 'center-chest'
  | 'left-chest'
  | 'cowl-arch'
  | 'kangaroo-pocket';

export type HoodieSilhouette = 'oversized' | 'slimfit' | 'cropped';

interface ProceduralHoodieProps {
  colorKey?: string;
  customHex?: string;
  view?: 'front' | 'back';
  graphicType?:
    | 'jjk-shrine'
    | 'jjk-void'
    | 'berserk-brand'
    | 'berserk-relic'
    | 'dbz-instinct'
    | 'dbz-hakai'
    | 'op-sun-god'
    | 'op-straw-hat'
    | 'op-room'
    | 'bespoke'
    | string;
  customImage?: string | null;
  placement?: GarmentPlacement;
  customPosition?: { x: number; y: number; scale?: number };
  silhouette?: HoodieSilhouette;
  blendMode?: 'multiply' | 'normal' | 'screen' | 'hard-light';
  opacity?: number;
  className?: string;
  size?: number | string;
  folded?: boolean;
  showBacklight?: boolean;
  hasFrontDesign?: boolean;
}

export const ProceduralHoodie: React.FC<ProceduralHoodieProps> = ({
  colorKey = 'onyx',
  customHex,
  view = 'back',
  graphicType = 'jjk-shrine',
  customImage = null,
  placement = 'upper-back',
  customPosition,
  silhouette = 'oversized',
  blendMode = 'multiply',
  opacity = 0.88,
  className = '',
  size = '100%',
  folded = false,
  showBacklight = true,
  hasFrontDesign = true,
}) => {
  // Color calculation
  let baseColor: string;
  let shadowColor: string;
  let highlightColor: string;

  if (customHex) {
    const calc = calculateHoodieColors(customHex);
    baseColor = calc.hex;
    shadowColor = calc.shadow;
    highlightColor = calc.highlight;
  } else {
    const col = HOODIE_COLORWAYS[colorKey] || calculateHoodieColors(colorKey);
    baseColor = col.hex;
    shadowColor = col.shadow;
    highlightColor = col.highlight;
  }

  const idPrefix = React.useId().replace(/:/g, '');
  const bodyGradId = `${idPrefix}-body`;
  const hoodGradId = `${idPrefix}-hood`;
  const pocketGradId = `${idPrefix}-pocket`;
  const cuffGradId = `${idPrefix}-cuff`;
  const artClipId = `${idPrefix}-art-clip`;

  // Folded View
  if (folded) {
    return (
      <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, aspectRatio: '1/1' }}>
        <svg viewBox="0 0 400 400" className="w-full h-full" fill="none">
          <defs>
            <linearGradient id={`${bodyGradId}-f`} x1="200" y1="100" x2="200" y2="320" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={highlightColor} />
              <stop offset="60%" stopColor={baseColor} />
              <stop offset="100%" stopColor={shadowColor} />
            </linearGradient>
          </defs>
          {showBacklight && (
            <circle cx="200" cy="210" r="140" fill="currentColor" className="text-neutral-500/10 dark:text-white/10" />
          )}
          {/* Folded Body Block */}
          <rect x="100" y="110" width="200" height="190" rx="16" fill={`url(#${bodyGradId}-f)`} stroke={shadowColor} strokeWidth="2" />
          {/* Folded Hood Arc */}
          <path d="M 140 110 C 140 75 260 75 260 110 Z" fill={shadowColor} stroke={highlightColor} strokeWidth="1.5" strokeOpacity="0.3" />
          {/* Folded Sleeves Lateral Tucks */}
          <path d="M 100 130 L 160 210 L 160 300 L 100 300 Z" fill={shadowColor} opacity="0.35" />
          <path d="M 300 130 L 240 210 L 240 300 L 300 300 Z" fill={shadowColor} opacity="0.35" />
          {/* Hem Crease */}
          <line x1="100" y1="280" x2="300" y2="280" stroke={shadowColor} strokeWidth="2" strokeDasharray="3 2" />
          {/* Garment Identification Patch */}
          <rect x="160" y="160" width="80" height="42" rx="4" fill="#09090b" stroke="#333" strokeWidth="1" />
          <text x="200" y="177" textAnchor="middle" fill="#f5f2eb" fontSize="8" fontFamily="monospace" fontWeight="bold" letterSpacing="2">THE JEEXERS</text>
          <text x="200" y="191" textAnchor="middle" fill="#888" fontSize="6" fontFamily="monospace" letterSpacing="1">500GSM FLEECE</text>
        </svg>
      </div>
    );
  }

  // Placement Geometry
  const placementBoxes: Record<GarmentPlacement, { x: number; y: number; w: number; h: number; rx?: number }> = {
    'upper-back': { x: 180, y: 160, w: 240, h: 260, rx: 16 },
    'center-back': { x: 215, y: 215, w: 170, h: 180, rx: 12 },
    'lower-hem': { x: 220, y: 345, w: 160, h: 125, rx: 10 },
    'all-over': { x: 155, y: 145, w: 290, h: 325, rx: 20 },
    'center-chest': { x: 195, y: 195, w: 210, h: 210, rx: 16 },
    'left-chest': { x: 205, y: 185, w: 80, h: 80, rx: 8 },
    'cowl-arch': { x: 220, y: 135, w: 160, h: 85, rx: 12 },
    'kangaroo-pocket': { x: 215, y: 355, w: 170, h: 95, rx: 8 },
  };

  const defaultBox = placementBoxes[placement] || placementBoxes['upper-back'];
  const activeBox = customPosition
    ? {
        x: customPosition.x,
        y: customPosition.y,
        w: defaultBox.w * (customPosition.scale || 1),
        h: defaultBox.h * (customPosition.scale || 1),
        rx: defaultBox.rx || 12,
      }
    : defaultBox;

  // Distinct Silhouette Geometries (Oversized, Slimfit, Cropped)
  let torsoPath = "M 194 140 C 248 152 352 152 406 140 L 438 490 C 375 500 225 500 162 490 Z";
  let ribbingPath = "M 162 490 C 225 500 375 500 438 490 L 436 532 C 375 540 225 540 164 532 Z";
  let ribbingHighlight = "M 170 492 C 212 502 388 502 430 492";
  let leftSleeve = "M 194 140 L 68 288 C 58 308 64 338 80 358 L 104 382 C 112 390 126 388 132 378 L 204 256 Z";
  let leftSleeveSeam = "M 194 140 L 78 296";
  let rightSleeve = "M 406 140 L 532 288 C 542 308 536 338 520 358 L 496 382 C 488 390 474 388 468 378 L 396 256 Z";
  let rightSleeveSeam = "M 406 140 L 522 296";
  let frontPocket = "M 210 345 L 390 345 L 412 452 C 385 460 215 460 188 452 Z";
  let pocketH1 = "M 210 345 L 188 452";
  let pocketH2 = "M 390 345 L 412 452";

  if (silhouette === 'slimfit') {
    torsoPath = "M 205 140 C 250 148 350 148 395 140 L 412 485 C 360 492 240 492 188 485 Z";
    ribbingPath = "M 188 485 C 240 492 360 492 412 485 L 410 522 C 360 528 240 528 190 522 Z";
    ribbingHighlight = "M 194 487 C 235 494 365 494 406 487";
    leftSleeve = "M 205 140 L 96 288 C 88 306 94 332 108 350 L 128 372 C 136 380 148 378 154 368 L 214 256 Z";
    leftSleeveSeam = "M 205 140 L 106 296";
    rightSleeve = "M 395 140 L 504 288 C 512 306 506 332 492 350 L 472 372 C 464 380 452 378 446 368 L 386 256 Z";
    rightSleeveSeam = "M 395 140 L 494 296";
    frontPocket = "M 220 350 L 380 350 L 398 448 C 375 455 225 455 202 448 Z";
    pocketH1 = "M 220 350 L 202 448";
    pocketH2 = "M 380 350 L 398 448";
  } else if (silhouette === 'cropped') {
    torsoPath = "M 194 140 C 248 152 352 152 406 140 L 434 395 C 375 404 225 404 166 395 Z";
    ribbingPath = "M 166 395 C 225 404 375 404 434 395 L 432 432 C 375 440 225 440 168 432 Z";
    ribbingHighlight = "M 172 397 C 215 406 385 406 428 397";
    frontPocket = "M 215 305 L 385 305 L 402 385 C 375 392 225 392 198 385 Z";
    pocketH1 = "M 215 305 L 198 385";
    pocketH2 = "M 385 305 L 402 385";
  }

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`} style={{ width: size, height: 'auto', aspectRatio: '1/1' }}>
      {/* Backlight Halo for High Visibility in both Light and Dark Themes */}
      {showBacklight && (
        <div
          className="absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300"
          style={{
            background: 'var(--product-backlight)',
            filter: 'blur(35px)',
            transform: 'scale(1.08)',
          }}
        />
      )}

      <svg
        viewBox="0 0 600 600"
        className="relative z-10 w-full h-full transition-all duration-500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={bodyGradId} x1="300" y1="80" x2="300" y2="550" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.95" />
            <stop offset="35%" stopColor={baseColor} />
            <stop offset="100%" stopColor={shadowColor} />
          </linearGradient>

          <radialGradient id={hoodGradId} cx="300" cy="135" r="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={baseColor} />
            <stop offset="65%" stopColor={shadowColor} />
            <stop offset="100%" stopColor="#050505" stopOpacity="0.92" />
          </radialGradient>

          <linearGradient id={pocketGradId} x1="300" y1="330" x2="300" y2="475" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={highlightColor} stopOpacity="0.6" />
            <stop offset="25%" stopColor={baseColor} />
            <stop offset="100%" stopColor={shadowColor} />
          </linearGradient>

          <linearGradient id={cuffGradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={shadowColor} />
            <stop offset="100%" stopColor="#0a0a0c" />
          </linearGradient>

          <clipPath id={artClipId}>
            <rect
              x={activeBox.x}
              y={activeBox.y}
              width={activeBox.w}
              height={activeBox.h}
              rx={activeBox.rx || 12}
            />
          </clipPath>
        </defs>

        {/* ===================== SLEEVES ===================== */}
        <path
          d={leftSleeve}
          fill={`url(#${bodyGradId})`}
          stroke={shadowColor}
          strokeWidth="1.5"
        />
        <path d={leftSleeveSeam} stroke={highlightColor} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 2" />
        <path
          d="M 84 362 L 104 382 C 114 392 128 386 133 376 L 122 362 Z"
          fill={`url(#${cuffGradId})`}
          stroke={shadowColor}
          strokeWidth="1"
        />

        <path
          d={rightSleeve}
          fill={`url(#${bodyGradId})`}
          stroke={shadowColor}
          strokeWidth="1.5"
        />
        <path d={rightSleeveSeam} stroke={highlightColor} strokeWidth="1" strokeOpacity="0.35" strokeDasharray="3 2" />
        <path
          d="M 516 362 L 496 382 C 486 392 472 386 467 376 L 478 362 Z"
          fill={`url(#${cuffGradId})`}
          stroke={shadowColor}
          strokeWidth="1"
        />

        {/* ===================== TORSO BODY ===================== */}
        <path
          d={torsoPath}
          fill={`url(#${bodyGradId})`}
          stroke={shadowColor}
          strokeWidth="1.5"
        />

        {/* Waistband Ribbing */}
        <path
          d={ribbingPath}
          fill={`url(#${cuffGradId})`}
          stroke={shadowColor}
          strokeWidth="1.2"
        />
        <path d={ribbingHighlight} stroke={highlightColor} strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 2" />

        {/* ===================== VIEW LAYER ===================== */}
        {view === 'front' ? (
          <g>
            {/* Kangaroo Pocket */}
            <path
              d={frontPocket}
              fill={`url(#${pocketGradId})`}
              stroke={shadowColor}
              strokeWidth="1.5"
            />
            <path d={pocketH1} stroke={highlightColor} strokeWidth="1.5" strokeOpacity="0.4" />
            <path d={pocketH2} stroke={highlightColor} strokeWidth="1.5" strokeOpacity="0.4" />

            <path d="M 235 210 C 265 235 295 240 330 225" stroke={shadowColor} strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
            <path d="M 215 260 C 260 285 330 285 385 270" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" opacity="0.25" />

            {/* Throat Cowl Wrap Notch */}
            <path d="M 225 132 C 250 168 350 168 375 132 C 350 118 250 118 225 132 Z" fill={shadowColor} />

            {/* FRONT CUSTOM OR INBUILT DESIGN */}
            {customImage ? (
              <g clipPath={`url(#${artClipId})`}>
                <image
                  href={customImage}
                  x={activeBox.x}
                  y={activeBox.y}
                  width={activeBox.w}
                  height={activeBox.h}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ mixBlendMode: blendMode, opacity }}
                />
              </g>
            ) : hasFrontDesign ? (
              /* DISTINCT FRONT CHEST EMBLEMS */
              <g transform="translate(230, 205) scale(0.9)">
                {graphicType === 'jjk-shrine' && (
                  <g>
                    {/* Sukuna Eye Crest */}
                    <path d="M 40 40 Q 75 15 110 40 Q 75 65 40 40 Z" fill="#991b1b" stroke="#f87171" strokeWidth="2" />
                    <circle cx="75" cy="40" r="8" fill="#dc2626" />
                    <circle cx="75" cy="40" r="3" fill="#ffffff" />
                  </g>
                )}
                {graphicType === 'jjk-void' && (
                  <g>
                    {/* Satoru Gojo Blindfold & Six Eyes Sigil */}
                    <rect x="35" y="30" width="80" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                    <circle cx="75" cy="40" r="6" fill="#38bdf8" className="animate-pulse" />
                  </g>
                )}
                {graphicType === 'berserk-brand' && (
                  <g transform="scale(0.65) translate(35, 10)">
                    {/* Miniature Sacrifice Crest */}
                    <path
                      d="M 75 25 L 75 105 M 75 45 L 45 65 L 75 85 L 105 65 Z M 75 60 L 50 45 M 75 60 L 100 45"
                      stroke="#ef4444"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </g>
                )}
                {graphicType === 'berserk-relic' && (
                  <g>
                    {/* Behelit Crimson Tear Sigil */}
                    <ellipse cx="75" cy="42" rx="16" ry="24" fill="#991b1b" stroke="#7f1d1d" strokeWidth="2" />
                    <circle cx="70" cy="36" r="3" fill="#ffffff" />
                    <circle cx="80" cy="36" r="3" fill="#ffffff" />
                    <path d="M 68 50 Q 75 58 82 50" stroke="#000000" strokeWidth="2" fill="none" />
                  </g>
                )}
                {graphicType === 'dbz-instinct' && (
                  <g>
                    {/* Whis Archival Angel Sigil */}
                    <path d="M 75 20 Q 95 40 75 60 Q 55 40 75 20 Z" fill="#38bdf8" opacity="0.8" />
                    <circle cx="75" cy="40" r="4" fill="#ffffff" />
                  </g>
                )}
                {graphicType === 'dbz-hakai' && (
                  <g>
                    {/* Destruction Pride Trooper Hakai Sphere */}
                    <circle cx="75" cy="40" r="15" fill="#581c87" stroke="#a855f7" strokeWidth="2" />
                    <circle cx="75" cy="40" r="5" fill="#f3e8ff" />
                  </g>
                )}
                {graphicType === 'op-sun-god' && (
                  <g>
                    {/* Joyboy Drums of Liberation Sun Swirl */}
                    <circle cx="75" cy="40" r="18" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                    <path d="M 75 26 C 85 26 85 54 75 54 C 65 54 65 26 75 26 Z" fill="#ffffff" />
                    <circle cx="75" cy="40" r="4" fill="#f59e0b" />
                  </g>
                )}
                {graphicType === 'op-straw-hat' && (
                  <g>
                    {/* Straw Hat Silhouette */}
                    <ellipse cx="75" cy="45" rx="26" ry="8" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
                    <path d="M 60 43 C 60 30 90 30 90 43 Z" fill="#f59e0b" stroke="#92400e" strokeWidth="1.5" />
                    <rect x="61" y="39" width="28" height="3" fill="#dc2626" />
                  </g>
                )}
                {graphicType === 'op-room' && (
                  <g>
                    {/* Heart Pirates Jolly Roger & Room Sphere */}
                    <circle cx="75" cy="40" r="16" fill="none" stroke="#eab308" strokeWidth="2" />
                    <circle cx="75" cy="40" r="6" fill="#eab308" />
                    <path d="M 62 40 L 88 40 M 75 27 L 75 53" stroke="#eab308" strokeWidth="1.5" />
                  </g>
                )}
                {graphicType === 'bespoke' && (
                  <g>
                    {/* 1-of-1 Atelier Monogram */}
                    <text x="75" y="44" textAnchor="middle" fill="var(--text-primary)" fontSize="10" fontFamily="monospace" fontWeight="bold">JXR // 1-OF-1</text>
                  </g>
                )}
              </g>
            ) : null}
          </g>
        ) : (
          /* BACK VIEW */
          <g className="transition-all duration-700">
            <path d="M 210 195 C 270 210 330 210 390 195" stroke={shadowColor} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
            <path d="M 200 395 C 265 415 335 415 400 395" stroke={shadowColor} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

            {/* BACK CUSTOM UPLOADED ARTWORK */}
            {customImage ? (
              <g clipPath={`url(#${artClipId})`}>
                <image
                  href={customImage}
                  x={activeBox.x}
                  y={activeBox.y}
                  width={activeBox.w}
                  height={activeBox.h}
                  preserveAspectRatio="xMidYMid slice"
                  style={{ mixBlendMode: blendMode, opacity }}
                />
              </g>
            ) : (
              /* DYNAMIC INBUILT VECTOR GRAPHICS WITH PLACEMENT SCALING */
              <g transform={`translate(${activeBox.x - 180}, ${activeBox.y - 160}) scale(${activeBox.w / 240})`}>
                {graphicType === 'jjk-shrine' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <ellipse cx="150" cy="160" rx="135" ry="135" fill="#991b1b" fillOpacity="0.14" />
                    <path d="M 25 68 Q 150 10 275 68 L 265 84 Q 150 36 35 84 Z" fill="#b91c1c" />
                    <path d="M 45 98 Q 150 50 255 98 L 247 110 Q 150 72 53 110 Z" fill="#dc2626" opacity="0.9" />
                    <path d="M 85 85 L 85 225 L 102 225 L 102 85 Z" fill="#7f1d1d" />
                    <path d="M 198 85 L 198 225 L 215 225 L 215 85 Z" fill="#7f1d1d" />
                    <circle cx="128" cy="140" r="9" fill="#f87171" />
                    <circle cx="172" cy="140" r="9" fill="#f87171" />
                    <path d="M 112 176 Q 150 210 188 176 Q 150 188 112 176 Z" fill="#ef4444" />
                    <path d="M 40 40 L 260 260" stroke="#f87171" strokeWidth="4" strokeLinecap="round" opacity="0.75" />
                  </g>
                )}

                {graphicType === 'jjk-void' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <circle cx="150" cy="150" r="105" fill="#0f172a" opacity="0.5" />
                    <circle cx="150" cy="150" r="80" stroke="#38bdf8" strokeWidth="3" strokeDasharray="8 6" opacity="0.9" />
                    <circle cx="150" cy="150" r="50" fill="#0284c7" opacity="0.35" />
                    <circle cx="150" cy="150" r="18" fill="#f0f9ff" />
                    <path d="M 40 150 Q 150 60 260 150 Q 150 240 40 150" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.7" />
                  </g>
                )}

                {graphicType === 'berserk-brand' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <circle cx="150" cy="150" r="100" fill="#450a0a" opacity="0.5" />
                    <circle cx="136" cy="138" r="90" fill={baseColor} />
                    <path
                      d="M 150 55 L 150 245 M 150 95 L 105 135 L 150 175 L 195 135 Z M 150 120 L 115 95 M 150 120 L 185 95 M 150 150 L 105 195 M 150 150 L 195 195"
                      stroke="#ef4444"
                      strokeWidth="9"
                      strokeLinecap="round"
                    />
                  </g>
                )}

                {graphicType === 'berserk-relic' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <rect x="136" y="40" width="28" height="200" rx="3" fill="#3f3f46" stroke="#71717a" strokeWidth="2.5" />
                    <path d="M 136 240 L 150 265 L 164 240 Z" fill="#27272a" />
                    <path d="M 120 68 L 180 68 L 180 78 L 120 78 Z" fill="#52525b" />
                    <rect x="145" y="16" width="10" height="52" rx="3" fill="#18181b" />
                  </g>
                )}

                {graphicType === 'dbz-instinct' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <path d="M 150 25 Q 185 85 215 65 Q 245 135 215 155 Q 255 205 195 225 Q 150 265 115 215 Q 55 205 85 145 Q 45 95 95 75 Z" fill="#e0f2fe" opacity="0.35" />
                    <circle cx="150" cy="150" r="55" fill="#f8fafc" opacity="0.7" />
                    <path d="M 150 40 L 150 260 M 40 150 L 260 150" stroke="#38bdf8" strokeWidth="3.5" opacity="0.8" />
                  </g>
                )}

                {graphicType === 'dbz-hakai' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <circle cx="150" cy="150" r="95" fill="#581c87" opacity="0.45" />
                    <circle cx="150" cy="150" r="65" fill="#a855f7" opacity="0.65" />
                    <circle cx="150" cy="150" r="32" fill="#f3e8ff" />
                    <path d="M 85 85 L 215 215 M 215 85 L 85 215" stroke="#e9d5ff" strokeWidth="3" />
                  </g>
                )}

                {/* ONE PIECE GRAPHICS */}
                {graphicType === 'op-sun-god' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    {/* Sun God Nika Drum Spiral & Radiance */}
                    <circle cx="150" cy="150" r="110" fill="#fef08a" fillOpacity="0.15" />
                    <circle cx="150" cy="150" r="80" stroke="#f59e0b" strokeWidth="4" strokeDasharray="12 8" />
                    {/* Dynamic Cloud Sash */}
                    <path d="M 50 150 C 70 80 230 80 250 150 C 230 220 70 220 50 150 Z" fill="#ffffff" fillOpacity="0.85" />
                    <path d="M 90 150 Q 150 100 210 150 Q 150 200 90 150 Z" fill="#f59e0b" />
                    <circle cx="150" cy="150" r="24" fill="#ffffff" />
                  </g>
                )}

                {graphicType === 'op-straw-hat' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    {/* Jolly Roger Straw Hat & Crossed Bones */}
                    <path d="M 50 50 L 250 250 M 250 50 L 50 250" stroke="#f4f4f5" strokeWidth="14" strokeLinecap="round" />
                    <circle cx="150" cy="150" r="65" fill="#18181b" stroke="#f4f4f5" strokeWidth="6" />
                    {/* Crossed Hat Atop */}
                    <ellipse cx="150" cy="100" rx="75" ry="20" fill="#d97706" />
                    <path d="M 100 95 C 100 55 200 55 200 95 Z" fill="#f59e0b" />
                    <rect x="102" y="85" width="96" height="10" fill="#dc2626" />
                    {/* Grinning Skull Teeth */}
                    <rect x="135" y="180" width="8" height="15" fill="#f4f4f5" />
                    <rect x="147" y="180" width="8" height="15" fill="#f4f4f5" />
                    <rect x="159" y="180" width="8" height="15" fill="#f4f4f5" />
                  </g>
                )}

                {graphicType === 'op-room' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    {/* Trafalgar Law Room Grid & Nodachi */}
                    <circle cx="150" cy="150" r="105" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="6 4" fill="#0284c7" fillOpacity="0.1" />
                    <rect x="60" y="145" width="180" height="10" rx="2" fill="#eab308" />
                    <circle cx="150" cy="150" r="45" fill="#0f172a" stroke="#eab308" strokeWidth="3" />
                    <text x="150" y="157" textAnchor="middle" fill="#fef08a" fontSize="20" fontFamily="monospace" fontWeight="bold">DEATH</text>
                  </g>
                )}

                {graphicType === 'bespoke' && (
                  <g transform="translate(195, 175) scale(0.7)">
                    <circle cx="150" cy="150" r="90" stroke="#d97706" strokeWidth="3.5" strokeDasharray="14 7" fill="#78350f" fillOpacity="0.25" />
                    <path d="M 95 150 Q 150 70 205 150 Q 150 230 95 150" stroke="#f59e0b" strokeWidth="4.5" fill="none" />
                    <circle cx="150" cy="150" r="16" fill="#fbbf24" />
                  </g>
                )}
              </g>
            )}
          </g>
        )}

        {/* Cowl Hood */}
        <path
          d="M 218 142 C 212 45 388 45 382 142 C 342 158 258 158 218 142 Z"
          fill={`url(#${hoodGradId})`}
          stroke={shadowColor}
          strokeWidth="2"
        />
        <path d="M 238 118 C 248 62 352 62 362 118" stroke={highlightColor} strokeWidth="2" strokeOpacity="0.4" fill="none" />
      </svg>
    </div>
  );
};
