export interface SearchProvider<T> {
  search(query: string, signal?: AbortSignal): Promise<T[]>;
}
