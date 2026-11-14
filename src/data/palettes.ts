export interface PaletteColor {
  id: string;
  name: string;
  hex: string;
}

export interface ColorPaletteGroup {
  name: string;
  colors: PaletteColor[];
}

export const CURATED_PALETTES: ColorPaletteGroup[] = [
  {
    name: 'EARTH & MINERALS',
    colors: [
      { id: 'onyx', name: 'Washed Onyx', hex: '#141416' },
      { id: 'bone', name: 'Raw Bone', hex: '#d6d1c7' },
      { id: 'mud', name: 'Mineral Mud', hex: '#3a312b' },
      { id: 'charcoal', name: 'Pumice Charcoal', hex: '#242428' },
      { id: 'moss', name: 'Washed Moss', hex: '#2b312a' },
      { id: 'sand', name: 'Desert Dune', hex: '#b5a58e' },
      { id: 'clay', name: 'Terracotta Wash', hex: '#58362b' },
      { id: 'basalt', name: 'Volcanic Ash', hex: '#1c1b19' },
    ],
  },
  {
    name: 'ANIME VOID & NEONS',
    colors: [
      { id: 'crimson', name: 'Oxblood Void', hex: '#3a161b' },
      { id: 'eva-violet', name: 'Eva-01 Violet', hex: '#2d1b4e' },
      { id: 'acid-lime', name: 'Cursed Lime', hex: '#233a1e' },
      { id: 'infinity-blue', name: 'Void Azure', hex: '#152e4a' },
      { id: 'hakai-magenta', name: 'Hakai Magenta', hex: '#3d1436' },
      { id: 'solar-ochre', name: 'Super Saiyan Gold', hex: '#4a3712' },
      { id: 'blood-vermillion', name: 'Berserk Vermillion', hex: '#521414' },
      { id: 'cyber-cyan', name: 'Shibuya Cyan', hex: '#103942' },
    ],
  },
  {
    name: 'VINTAGE ACID WASHES',
    colors: [
      { id: 'enzyme-grey', name: 'Enzyme Pumice', hex: '#383840' },
      { id: 'denim-faded', name: 'Bleached Indigo', hex: '#28323c' },
      { id: 'weathered-rose', name: 'Dusty Crimson', hex: '#442d32' },
      { id: 'ghost-chalk', name: 'Ghost Mineral', hex: '#e8e4dc' },
      { id: 'sage-wash', name: 'Sun-Faded Sage', hex: '#343a32' },
      { id: 'sepia-film', name: '35mm Sepia', hex: '#3a2d24' },
    ],
  },
];

// 36-Tile Hex Swatch Grid for Free Exploration
export const HEX_GRID_SWATCHES: string[] = [
  '#09090b', '#18181b', '#27272a', '#3f3f46', '#52525b', '#71717a',
  '#2a1f1b', '#3d2b24', '#523a2f', '#6c4e3f', '#866351', '#a37c67',
  '#19231a', '#243326', '#314434', '#415a45', '#55765a', '#6f9775',
  '#15222e', '#1f3244', '#2c455d', '#3d5e7d', '#527da5', '#6b9ecf',
  '#2a1622', '#3d1d31', '#542643', '#703159', '#8e3e70', '#b04e8b',
  '#2a1515', '#3d1c1c', '#572424', '#752e2e', '#963a3a', '#b84848',
];
