export interface CalculatedHoodieColors {
  hex: string;
  shadow: string;
  highlight: string;
  accent: string;
}

// Convert hex to rgb
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleanHex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Convert rgb to hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  return `#${((1 << 24) + (clamp(r) << 16) + (clamp(g) << 8) + clamp(b))
    .toString(16)
    .slice(1)}`;
}

// Generate realistic fabric lighting shaders from any custom hex
export function calculateHoodieColors(hex: string): CalculatedHoodieColors {
  try {
    const { r, g, b } = hexToRgb(hex);

    // Deep fabric shadow (darkened by ~48%)
    const shadow = rgbToHex(r * 0.52, g * 0.52, b * 0.52);

    // Natural textile specular highlight (lightened by ~28% + ambient lift)
    const highlight = rgbToHex(
      Math.min(255, r * 1.25 + 24),
      Math.min(255, g * 1.25 + 24),
      Math.min(255, b * 1.25 + 24)
    );

    // Complementary accent
    const accent = rgbToHex(
      Math.min(255, r * 1.4 + 40),
      Math.min(255, g * 1.4 + 40),
      Math.min(255, b * 1.4 + 40)
    );

    return { hex, shadow, highlight, accent };
  } catch {
    return {
      hex: '#141416',
      shadow: '#09090b',
      highlight: '#2c2c30',
      accent: '#44444a',
    };
  }
}
