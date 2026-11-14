import type { HoodieItem } from './data/products';

export type PageView = 'store' | 'collections' | 'detail' | 'bespoke' | 'studio' | 'checkout' | 'admin';

export interface CartEntry {
  id: string;
  hoodie: HoodieItem;
  color: string;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  customImage?: string | null;
}
