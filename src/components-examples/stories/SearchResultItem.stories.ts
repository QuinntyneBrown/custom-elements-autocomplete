import type { Meta, StoryObj } from '@storybook/html';
import { html } from 'lit-html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { products } from '../products.js';
import { componentSource, renderComponent, type StoryArgs } from './helpers.js';

const meta = {
  title: 'Components/Search Result Item',
  component: 'ce-search-result-item',
  argTypes: getStorybookHelpers('ce-search-result-item').argTypes,
  args: { searchResultItem: products[0], isActive: false },
  render: (args: StoryArgs) =>
    renderComponent(html`<ce-search-result-item></ce-search-result-item>`, args),
  parameters: {
    docs: {
      source: {
        language: 'typescript',
        code: componentSource(
          'ce-search-result-item',
          'SearchResultItemComponent',
          'searchResultItem',
          products[1],
        ),
      },
    },
  },
} satisfies Meta<StoryArgs>;
export default meta;
type Story = StoryObj<StoryArgs>;
export const Default: Story = {};
export const Expanded: Story = { args: { isActive: true } };
export const ImageFallback: Story = { args: { searchResultItem: products[1] } };
