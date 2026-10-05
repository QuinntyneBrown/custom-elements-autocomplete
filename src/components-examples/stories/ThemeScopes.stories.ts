import type { Meta, StoryObj } from '@storybook/html';
import { applyTheme, darkTheme, lightTheme } from '../../theming/index.js';
import { createAutocompleteExample } from '../autocomplete-example.js';
import { createFixtureProvider } from '../fixture-search-provider.js';

const meta = {
  title: 'Theme/Independent Scopes',
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'grid';
    wrapper.style.gap = '24px';
    for (const [name, theme] of [
      ['Light', lightTheme],
      ['Dark', darkTheme],
    ] as const) {
      const scope = document.createElement('section');
      const heading = document.createElement('h2');
      heading.textContent = name;
      scope.className = 'component-preview';
      applyTheme(scope, theme);
      scope.append(heading, createAutocompleteExample(createFixtureProvider()));
      wrapper.append(scope);
    }
    return wrapper;
  },
  parameters: {
    docs: {
      description: {
        component:
          'Independent light and dark subtrees override the toolbar theme through CSS inheritance. Each provider and query is independent.',
      },
    },
  },
} satisfies Meta;
export default meta;
export const Default: StoryObj = {};
