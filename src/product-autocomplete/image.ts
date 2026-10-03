export const fallbackImage =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="128" viewBox="0 0 96 128"><rect width="96" height="128" rx="12" fill="#e4ecf0"/><path d="M40 20h16v24l12 16v48H28V60l12-16z" fill="#6a8797"/><rect x="32" y="66" width="32" height="24" fill="#fff"/></svg>',
  );

export function useFallback(event: Event): void {
  const image = event.currentTarget as HTMLImageElement;
  if (image.src !== fallbackImage) image.src = fallbackImage;
}
