import { defineConfig } from 'vite';

// Deliberately separate from the library-mode build and the demo server on port 4200.
export default defineConfig({
  build: { outDir: 'dist/storybook' },
});
