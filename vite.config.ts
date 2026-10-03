import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: '127.0.0.1', port: 4200, strictPort: true },
  build: {
    outDir: 'dist/autocomplete',
    lib: { entry: 'src/autocomplete/index.ts', formats: ['es'], fileName: 'autocomplete' },
    rollupOptions: {
      external: (id) =>
        id === 'lit-html' || id.startsWith('lit-html/') || id === 'rxjs' || id.startsWith('rxjs/'),
    },
  },
});
