import type { Preview } from '@storybook/html';
import { useEffect } from 'storybook/preview-api';
import { action } from 'storybook/actions';
import { format } from 'prettier/standalone';
import htmlPlugin from 'prettier/plugins/html';
import babelPlugin from 'prettier/plugins/babel';
import estreePlugin from 'prettier/plugins/estree';
import typescriptPlugin from 'prettier/plugins/typescript';
import { applyTheme, createTheme, darkTheme, lightTheme } from '../src/theming/index.js';
import '../src/index.js';
import theme from './theme.js';
import './docs-root.css';
import manifest from '../custom-elements.json' with { type: 'json' };

Object.defineProperty(window, 'customElementsManifest', { value: manifest, configurable: true });

const themes = {
  light: lightTheme,
  dark: darkTheme,
  custom: createTheme({ colorBrandForeground1: '#663399', colorBrandStroke1: '#663399' }),
};

const preview: Preview = {
  tags: ['autodocs'],
  initialGlobals: { theme: 'light', dir: 'ltr' },
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Scoped component theme',
      toolbar: {
        icon: 'paintbrush',
        dynamicTitle: true,
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
          { value: 'custom', title: 'Custom Purple' },
        ],
      },
    },
    dir: {
      name: 'Direction',
      description: 'Text direction',
      toolbar: {
        icon: 'transfer',
        dynamicTitle: true,
        items: [
          { value: 'ltr', title: 'LTR' },
          { value: 'rtl', title: 'RTL' },
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'component-preview';
      const selected = context.globals.theme as keyof typeof themes;
      applyTheme(wrapper, themes[selected] ?? lightTheme);
      wrapper.dir = context.globals.dir === 'rtl' ? 'rtl' : 'ltr';
      const story = Story();
      if (typeof story === 'string') wrapper.textContent = story;
      else wrapper.append(story);
      useEffect(() => {
        const controller = new AbortController();
        wrapper.addEventListener('product-select', action('product-select'), {
          signal: controller.signal,
        });
        return () => controller.abort();
      }, [wrapper]);
      return wrapper;
    },
  ],
  parameters: {
    layout: 'fullscreen',
    controls: { expanded: true, sort: 'none' },
    viewMode: 'docs',
    previewTabs: { canvas: { hidden: true } },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Concepts',
          ['Introduction', 'Developer', ['Quick Start', 'Generic Providers']],
          'Components',
          'Theme',
        ],
      },
    },
    docs: {
      theme,
      source: {
        excludeDecorators: true,
        type: 'code',
        async transform(
          source: string,
          context: { parameters: { docs?: { source?: { language?: string } } } },
        ) {
          return format(source.replace(/<!--\/?lit\$[^>]*-->|<!--\?lit\$[^>]*-->|<!---->/g, ''), {
            parser:
              context.parameters.docs?.source?.language === 'typescript' ? 'typescript' : 'html',
            plugins: [htmlPlugin, babelPlugin, estreePlugin, typescriptPlugin],
            htmlWhitespaceSensitivity: 'ignore',
            singleQuote: true,
            printWidth: 100,
          });
        },
      },
    },
  },
};
export default preview;
