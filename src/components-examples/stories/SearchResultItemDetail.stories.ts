import type { Meta, StoryObj } from '@storybook/html';
import { html } from 'lit-html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { products } from '../products.js';
import { componentSource, renderComponent, type StoryArgs } from './helpers.js';

const meta = {
  title: 'Components/Search Result Item Detail',
  component: 'ce-search-result-item-detail',
  argTypes: getStorybookHelpers('ce-search-result-item-detail').argTypes,
  args: { searchResultItem: products[0] },
  parameters: {
    docs: {
      source: {
        language: 'typescript',
        code: componentSource(
          'ce-search-result-item-detail',
          'SearchResultItemDetailComponent',
          'searchResultItem',
          products[1],
        ),
      },
    },
  },
  render: (args: StoryArgs) =>
    renderComponent(html`<ce-search-result-item-detail></ce-search-result-item-detail>`, args),
} satisfies Meta<StoryArgs>;
export default meta;
export const Default: StoryObj<StoryArgs> = {};
export const ImageFallback: StoryObj<StoryArgs> = { args: { searchResultItem: products[1] } };
