import React, { useRef, useState, useCallback } from 'react';

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number; // How strong the pull is (default 0.3)
  spotlight?: boolean; // Whether to render interactive mouse spotlight
  onClick?: (e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>) => void;
  type?: 'button' | 'div';
  ariaLabel?: string;
}

export const InteractiveMagnetic: React.FC<MagneticProps> = ({
  children,
  className = '',
  strength = 0.28,
  spotlight = true,
  onClick,
  type = 'button',
  ariaLabel,
}) => {
  const containerRef = useRef<HTMLDivElement | HTMLButtonElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;
    setPosition({ x: deltaX, y: deltaY });

    // Local coordinate within element for spotlight
    const localX = e.clientX - rect.left;
    const localY = e.clientY - rect.top;
    setSpotlightPos({ x: localX, y: localY });
  }, [strength]);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setPosition({ x: 0, y: 0 });
  };

  const style: React.CSSProperties = {
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
    transition: isHovered
      ? 'transform 0.12s cubic-bezier(0.25, 1, 0.5, 1)'
      : 'transform 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  if (type === 'div') {
    return (
      <div
        ref={containerRef as React.RefObject<HTMLDivElement>}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        style={style}
        className={`relative overflow-hidden ${className}`}
      >
        {spotlight && isHovered && (
          <div
            className="absolute pointer-events-none -inset-px rounded-[inherit] transition-opacity duration-300"
            style={{
              background: `radial-gradient(140px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.18), transparent 70%)`,
            }}
          />
        )}
        {children}
      </div>
    );
  }

  return (
    <button
      ref={containerRef as React.RefObject<HTMLButtonElement>}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={style}
      aria-label={ariaLabel}
      className={`relative overflow-hidden ${className}`}
    >
      {spotlight && isHovered && (
        <div
          className="absolute pointer-events-none -inset-px rounded-[inherit] transition-opacity duration-300"
          style={{
            background: `radial-gradient(140px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(255, 255, 255, 0.22), transparent 70%)`,
          }}
        />
      )}
      {children}
    </button>
  );
};
