export interface SearchResultItem {
    id: number;
    name: string;
    image_thumb_url: string;
    image_url: string;
    price_in_cents: number;
    primary_category: string;
    tasting_note: string;
    volume_in_milliliters: string;
}

export interface SearchResponseJSON {
    result: Array<SearchResultItem>;
}