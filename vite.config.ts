import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4200, strictPort: true },
  build: {
    outDir: 'dist/autocomplete',
    lib: {
      entry: {
        index: 'src/index.ts',
        autocomplete: 'src/autocomplete/index.ts',
        'product-autocomplete': 'src/product-autocomplete/index.ts',
        theming: 'src/theming/index.ts',
      },
      formats: ['es'],
      fileName: '[name]',
    },
    rollupOptions: {
      external: (id) =>
        id === 'lit-html' || id.startsWith('lit-html/') || id === 'rxjs' || id.startsWith('rxjs/'),
    },
  },
});
