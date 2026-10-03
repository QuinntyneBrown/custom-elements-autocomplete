import type { SearchResultItem } from '../autocomplete/index.js';

const image = new URL('./assets/product.svg', import.meta.url).href;
export const products: SearchResultItem[] = [
  {
    id: 1,
    name: 'Red Wine',
    image_thumb_url: image,
    image_url: image,
    price_in_cents: 1895,
    primary_category: 'Wine',
    tasting_note: 'Rich berry notes.',
    volume_in_milliliters: '750',
  },
  {
    id: 2,
    name: 'White Wine',
    image_thumb_url: null,
    image_url: null,
    price_in_cents: 1590,
    primary_category: 'Wine',
    tasting_note: 'Crisp citrus and apple.',
    volume_in_milliliters: '750',
  },
  {
    id: 3,
    name: 'Craft Beer',
    image_thumb_url: image,
    image_url: image,
    price_in_cents: 325,
    primary_category: 'Beer',
    tasting_note: 'Fresh hops and toasted malt.',
    volume_in_milliliters: '473',
  },
];
