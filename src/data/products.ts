export interface HoodieItem {
  id: string;
  name: string;
  series: 'JJK' | 'BERSERK' | 'DBS' | 'ONE-PIECE' | 'BESPOKE';
  price: number;
  graphicType:
    | 'jjk-shrine'
    | 'jjk-void'
    | 'berserk-brand'
    | 'berserk-relic'
    | 'dbz-instinct'
    | 'dbz-hakai'
    | 'op-sun-god'
    | 'op-straw-hat'
    | 'op-room'
    | 'bespoke';
  defaultColor: string;
  availableColors: string[];
  description?: string;
  hasFrontDesign?: boolean;
}

export const HOODIE_COLLECTION: HoodieItem[] = [
  // 1. Jujutsu Kaisen Series
  {
    id: 'jjk-01',
    name: 'SHRINE DOMAIN',
    series: 'JJK',
    price: 185,
    graphicType: 'jjk-shrine',
    defaultColor: 'onyx',
    availableColors: ['onyx', 'charcoal', 'mud', 'crimson', 'bone'],
    description: 'Malevolent Shrine architectural torii bone lattice brush discharge on 500GSM fleece.',
    hasFrontDesign: true,
  },
  {
    id: 'jjk-02',
    name: 'INFINITY VOID',
    series: 'JJK',
    price: 185,
    graphicType: 'jjk-void',
    defaultColor: 'charcoal',
    availableColors: ['onyx', 'charcoal', 'bone', 'moss'],
    description: 'Limitless ocular singularity vortex discharge with negative space horizon.',
    hasFrontDesign: true,
  },
  {
    id: 'jjk-03',
    name: 'SUKUNA FLAME',
    series: 'JJK',
    price: 190,
    graphicType: 'jjk-shrine',
    defaultColor: 'crimson',
    availableColors: ['crimson', 'onyx', 'mud'],
    description: 'Fuga thermal pyroclastic flame arrow brushwork spanning the spine and cowl.',
    hasFrontDesign: false,
  },
  {
    id: 'jjk-04',
    name: 'CURSED ENERGY RESIDUE',
    series: 'JJK',
    price: 180,
    graphicType: 'jjk-void',
    defaultColor: 'bone',
    availableColors: ['bone', 'onyx', 'charcoal'],
    description: 'Deep cobalt pigment spill with raw discharge edges cured at 180°C.',
    hasFrontDesign: true,
  },

  // 2. Berserk Eclipse Artifacts
  {
    id: 'berserk-01',
    name: 'ECLIPSE BRAND',
    series: 'BERSERK',
    price: 195,
    graphicType: 'berserk-brand',
    defaultColor: 'crimson',
    availableColors: ['crimson', 'onyx', 'mud', 'charcoal'],
    description: 'Brand of Sacrifice bleed sigil centered on the upper spine. Hand-mixed iron oxide.',
    hasFrontDesign: true,
  },
  {
    id: 'berserk-02',
    name: 'DRAGONSLAYER',
    series: 'BERSERK',
    price: 195,
    graphicType: 'berserk-relic',
    defaultColor: 'mud',
    availableColors: ['onyx', 'mud', 'charcoal', 'bone'],
    description: 'Raw black iron monumental slab silhouette hand-stenciled with pumice wash.',
    hasFrontDesign: false,
  },
  {
    id: 'berserk-03',
    name: 'BERSERKER ARMOR',
    series: 'BERSERK',
    price: 205,
    graphicType: 'berserk-brand',
    defaultColor: 'onyx',
    availableColors: ['onyx', 'charcoal'],
    description: 'Ominous canine jaw helm geometry with blood-red eye slit brush calligraphy.',
    hasFrontDesign: true,
  },
  {
    id: 'berserk-04',
    name: 'FEMTO ECLIPSE',
    series: 'BERSERK',
    price: 200,
    graphicType: 'berserk-relic',
    defaultColor: 'charcoal',
    availableColors: ['charcoal', 'onyx', 'crimson'],
    description: 'Corrupted avian wings wrapped around the rib cage in cracked discharge ink.',
    hasFrontDesign: false,
  },

  // 3. Dragon Ball Super Series
  {
    id: 'dbs-01',
    name: 'ULTRA INSTINCT',
    series: 'DBS',
    price: 190,
    graphicType: 'dbz-instinct',
    defaultColor: 'bone',
    availableColors: ['bone', 'onyx', 'charcoal', 'moss'],
    description: 'Autonomous silver ki heat ripples radiating from the scapula to the shoulders.',
    hasFrontDesign: true,
  },
  {
    id: 'dbs-02',
    name: 'HAKAI DESTRUCTION',
    series: 'DBS',
    price: 190,
    graphicType: 'dbz-hakai',
    defaultColor: 'onyx',
    availableColors: ['onyx', 'crimson', 'charcoal', 'bone'],
    description: 'Sphere of total molecular deletion in rich violet discharge and charcoal base.',
    hasFrontDesign: true,
  },
  {
    id: 'dbs-03',
    name: 'ULTRA EGO',
    series: 'DBS',
    price: 195,
    graphicType: 'dbz-hakai',
    defaultColor: 'mud',
    availableColors: ['mud', 'onyx', 'crimson'],
    description: 'Battle damage kinetic energy arcs and Hakai flame aura across the drape.',
    hasFrontDesign: false,
  },
  {
    id: 'dbs-04',
    name: 'SUPER SAIYAN GOD',
    series: 'DBS',
    price: 185,
    graphicType: 'dbz-instinct',
    defaultColor: 'crimson',
    availableColors: ['crimson', 'bone', 'onyx'],
    description: 'Crimson deity solar flame strokes cured with high-density mineral wash.',
    hasFrontDesign: true,
  },

  // 4. One Piece Archive (NEW)
  {
    id: 'op-01',
    name: 'SUN GOD NIKA',
    series: 'ONE-PIECE',
    price: 195,
    graphicType: 'op-sun-god',
    defaultColor: 'bone',
    availableColors: ['bone', 'onyx', 'crimson', 'moss'],
    description: 'Drums of Liberation mythic cloud spiral sash with euphoric white sun aura.',
    hasFrontDesign: true,
  },
  {
    id: 'op-02',
    name: 'STRAW HAT ARCHIVE',
    series: 'ONE-PIECE',
    price: 190,
    graphicType: 'op-straw-hat',
    defaultColor: 'mud',
    availableColors: ['mud', 'onyx', 'bone', 'charcoal'],
    description: 'Minimalist red-ribbon woven straw crest with distressed crossed skull stencils.',
    hasFrontDesign: true,
  },
  {
    id: 'op-03',
    name: 'ROOM TACT AMBUSH',
    series: 'ONE-PIECE',
    price: 200,
    graphicType: 'op-room',
    defaultColor: 'onyx',
    availableColors: ['onyx', 'charcoal', 'bone'],
    description: 'Surgeon of Death spatial spherical boundary matrix and nodachi strike lines.',
    hasFrontDesign: true,
  },
  {
    id: 'op-04',
    name: 'GEAR 5 FREEDOM',
    series: 'ONE-PIECE',
    price: 210,
    graphicType: 'op-sun-god',
    defaultColor: 'charcoal',
    availableColors: ['charcoal', 'bone', 'onyx'],
    description: 'Cartoon physics kinetic rubberized impact ripple discharge in pigment cream.',
    hasFrontDesign: false,
  },

  // 5. Archival & Bespoke Artifacts
  {
    id: 'arch-01',
    name: 'SUKUNA KING OF CURSES',
    series: 'JJK',
    price: 210,
    graphicType: 'jjk-shrine',
    defaultColor: 'onyx',
    availableColors: ['onyx', 'bone', 'crimson'],
    description: 'Complete bodily cursed tattoo iconography etched directly into loopback fleece.',
    hasFrontDesign: true,
  },
  {
    id: 'arch-02',
    name: 'SKULL KNIGHT TALISMAN',
    series: 'BERSERK',
    price: 215,
    graphicType: 'berserk-relic',
    defaultColor: 'bone',
    availableColors: ['bone', 'charcoal', 'mud'],
    description: 'Thorny rose and skeletal equine crest stamped with oxidized graphite pigment.',
    hasFrontDesign: true,
  },
  {
    id: 'arch-03',
    name: 'SHENRON CELESTIAL',
    series: 'DBS',
    price: 210,
    graphicType: 'dbz-instinct',
    defaultColor: 'moss',
    availableColors: ['moss', 'onyx', 'bone'],
    description: 'Imperial emerald dragon scale brush strokes spiraling around the cowl hood.',
    hasFrontDesign: false,
  },
  {
    id: 'arch-04',
    name: '1-OF-1 BESPOKE COMMISSION',
    series: 'BESPOKE',
    price: 260,
    graphicType: 'bespoke',
    defaultColor: 'mud',
    availableColors: ['onyx', 'bone', 'mud', 'charcoal', 'moss', 'crimson'],
    description: 'Client commission crafted with custom artwork, placement and hand-mixed dyes.',
    hasFrontDesign: true,
  },
];
