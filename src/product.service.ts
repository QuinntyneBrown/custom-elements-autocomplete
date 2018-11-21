
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

export class ProductService {
  public async search(query:string): Promise<SearchResultItem[]> {
    const url = `http://lcboapi.com/products?q=${query}`;    
    const key = "MDo5ZjQzZjZjYS0zYzZkLTExZTctODVjZC1lNzY5OWY5Mzg2MjE6NEp5dmw3Y3ZIdEpxU29Ka2diYlhPanBXRFZhbXJyNWVIZ3VJ";
    const response = await fetch(`${url}&access_key=${key}`);
    const json = await response.json();
    return json.result;
  }  
}
