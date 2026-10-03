export interface SearchResultItem {
  id: number;
  name: string;
  image_thumb_url: string | null;
  image_url: string | null;
  price_in_cents: number;
  primary_category: string;
  tasting_note: string;
  volume_in_milliliters: string;
}

export interface ProductSearchProvider {
  search(query: string, signal?: AbortSignal): Promise<SearchResultItem[]>;
}
