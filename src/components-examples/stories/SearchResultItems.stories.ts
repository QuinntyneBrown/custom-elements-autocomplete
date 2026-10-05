import type { Meta, StoryObj } from '@storybook/html';
import { html } from 'lit-html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { products } from '../products.js';
import { componentSource, renderComponent, type StoryArgs } from './helpers.js';

const meta = {
  title: 'Components/Search Result Items',
  component: 'ce-search-result-items',
  argTypes: getStorybookHelpers('ce-search-result-items').argTypes,
  args: { searchResultItems: products },
  parameters: {
    docs: {
      source: {
        language: 'typescript',
        code: componentSource(
          'ce-search-result-items',
          'SearchResultItemsComponent',
          'searchResultItems',
          [products[1]],
        ),
      },
    },
  },
  render: (args: StoryArgs) =>
    renderComponent(html`<ce-search-result-items></ce-search-result-items>`, args),
} satisfies Meta<StoryArgs>;
export default meta;
export const Default: StoryObj<StoryArgs> = {};
export const Empty: StoryObj<StoryArgs> = { args: { searchResultItems: [] } };
