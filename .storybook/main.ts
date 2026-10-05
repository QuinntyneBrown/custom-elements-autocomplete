import type { StorybookConfig } from '@storybook/html-vite';

const config: StorybookConfig = {
  stories: [
    '../src/components-examples/stories/**/*.mdx',
    '../src/components-examples/stories/**/*.stories.ts',
  ],
  framework: {
    name: '@storybook/html-vite',
    options: { builder: { viteConfigPath: 'vite.storybook.config.ts' } },
  },
  addons: ['@storybook/addon-docs'],
  staticDirs: ['./public'],
  core: { disableTelemetry: true },
};
export default config;
