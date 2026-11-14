import React from 'react';

interface BackpackIconProps {
  animationState?: 'idle' | 'unzipping' | 'open' | 'zipping' | 'impact';
  isUnzipped?: boolean;
  className?: string;
  theme?: 'obsidian' | 'alabaster';
}

export const BackpackIcon: React.FC<BackpackIconProps> = ({
  animationState = 'idle',
  isUnzipped = false,
  className = 'w-6 h-6',
}) => {
  const isOpen = isUnzipped || animationState === 'unzipping' || animationState === 'open';
  const isImpact = animationState === 'impact';
  const isZipping = animationState === 'zipping';

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full h-full overflow-visible transition-transform ${
          isOpen ? 'scale-115' : isImpact ? 'scale-120' : 'scale-100'
        }`}
      >
        <defs>
          <radialGradient id="backpack-interior-void" cx="16" cy="11" r="9" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#ef4444" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#991b1b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#18181b" stopOpacity="0.98" />
          </radialGradient>
        </defs>

        {/* Top Carry Loop Handle */}
        <path
          d="M 12 7 C 12 3 20 3 20 7"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* Lateral Ergonomic Straps */}
        <path
          d="M 7 11 C 5.5 14 5.5 20 7 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 2"
          opacity="0.6"
        />
        <path
          d="M 25 11 C 26.5 14 26.5 20 25 24"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="2 2"
          opacity="0.6"
        />

        {/* Main Backpack Monocoque Shell */}
        <path
          d="M 8 13 C 8 8 11 6.5 16 6.5 C 21 6.5 24 8 24 13 L 24.5 24 C 24.5 26.5 22.5 28 16 28 C 9.5 28 7.5 26.5 7.5 24 Z"
          fill="var(--bg-canvas)"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Front Modular Utility Pocket */}
        <path
          d="M 10 18 C 10 16.5 11.5 16 16 16 C 20.5 16 22 16.5 22 18 L 22 24 C 22 25.5 20.5 26 16 26 C 11.5 26 10 25.5 10 24 Z"
          fill="var(--bg-surface)"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* Front Horizontal Pocket Zipper Line */}
        <line
          x1="12"
          y1="18.5"
          x2="20"
          y2="18.5"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="1.5 1"
          opacity="0.75"
        />

        {/* ================= DYNAMIC DUAL-SLIDER ZIPPER CHOREOGRAPHY ================= */}
        {isOpen ? (
          /* UNZIPPED & WIDE OPEN CAVITY: Sliders split to the sides, mouth stretches open with glowing void */
          <g className="transition-all duration-300">
            {/* Expanded Interior Void Cavity */}
            <path
              d="M 8.5 13 C 9.5 5 22.5 5 23.5 13 C 21 16.5 11 16.5 8.5 13 Z"
              fill="url(#backpack-interior-void)"
              stroke="#ef4444"
              strokeWidth="1.5"
            />

            {/* Separated Teeth Lines Pulled to Left and Right */}
            <path
              d="M 8.5 13 C 9.5 7 11.5 5 13.5 4.5"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeDasharray="1.5 1"
            />
            <path
              d="M 23.5 13 C 22.5 7 20.5 5 18.5 4.5"
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeDasharray="1.5 1"
            />

            {/* Left Hardware Slider Pulled to Base */}
            <circle cx="8" cy="13" r="1.6" fill="#ef4444" />
            <line x1="8" y1="13" x2="6.8" y2="15.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />

            {/* Right Hardware Slider Pulled to Base */}
            <circle cx="24" cy="13" r="1.6" fill="#ef4444" />
            <line x1="24" y1="13" x2="25.2" y2="15.5" stroke="#ef4444" strokeWidth="1.3" strokeLinecap="round" />

            {/* Luminous Intake Vacuum Core */}
            <ellipse cx="16" cy="10.5" rx="4.5" ry="2.5" fill="#ffffff" opacity="0.95" className="animate-pulse" />
          </g>
        ) : isZipping ? (
          /* ZIPPING IN PROGRESS: Sliders meeting in center */
          <g className="transition-all duration-200">
            <path
              d="M 9.5 12.5 C 10.5 9 13 8 16 8 C 19 8 21.5 9 22.5 12.5"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeDasharray="2 1.5"
            />
            <circle cx="14" cy="8.2" r="1.4" fill="#ef4444" />
            <circle cx="18" cy="8.2" r="1.4" fill="#ef4444" />
          </g>
        ) : (
          /* ZIPPED SHUT RESTING STATE: Clean continuous teeth track & single interlocked centered runner */
          <g className="transition-all duration-300">
            <path
              d="M 9.5 12.5 C 10.5 9 13 8 16 8 C 19 8 21.5 9 22.5 12.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeDasharray="2 1.5"
            />
            {/* Center Interlocked Metal Runner & Pull Tab */}
            <circle cx="16" cy="8" r="1.3" fill="var(--text-primary)" />
            <line x1="16" y1="8" x2="16" y2="10.8" stroke="var(--text-primary)" strokeWidth="1.2" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};
