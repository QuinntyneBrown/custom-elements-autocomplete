declare interface Product {
    id: number;
    name: string;
    image_thumb_url: string;
    image_url: string;
    price_price_in_cents: number;
    primary_category: string;
}

declare interface GetProductsResponseJSON {
    result: Array<Product>;
}