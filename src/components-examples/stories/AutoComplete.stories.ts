import type { Meta, StoryObj } from '@storybook/html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { createAutocompleteExample } from '../autocomplete-example.js';
import { createFixtureProvider } from '../fixture-search-provider.js';
import { renderAutocomplete, providerSource, type StoryArgs } from './helpers.js';

const helpers = getStorybookHelpers('ce-auto-complete');
const meta = {
  title: 'Components/Auto Complete',
  component: 'ce-auto-complete',
  render: renderAutocomplete,
  args: { scenario: 'normal', query: '' },
  argTypes: {
    ...helpers.argTypes,
    scenario: {
      control: 'select',
      options: ['normal', 'loading', 'empty', 'error', 'slow', 'stale', 'unconfigured'],
      table: { category: 'examples' },
    },
    query: { control: 'text', table: { category: 'examples' } },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A debounced product search with an injected provider, accessible status, and expandable details.',
      },
      source: { code: providerSource, language: 'typescript' },
    },
  },
} satisfies Meta<StoryArgs>;
export default meta;
type Story = StoryObj<StoryArgs>;
export const Default: Story = {};
export const ResultsAndImageFallback: Story = { args: { query: 'wine' } };
export const Loading: Story = { args: { scenario: 'loading', query: 'wine' } };
export const Empty: Story = { args: { scenario: 'empty', query: 'nothing' } };
export const FailureAndRecovery: Story = {
  args: { scenario: 'error', query: 'wine' },
  parameters: {
    docs: { description: { story: 'Wine fails; type beer to recover with the same provider.' } },
  },
};
export const Unconfigured: Story = { args: { scenario: 'unconfigured' } };
export const IndependentInstances: Story = {
  render: () => {
    const wrapper = document.createElement('div');
    wrapper.append(
      createAutocompleteExample(createFixtureProvider()),
      createAutocompleteExample(createFixtureProvider()),
    );
    return wrapper;
  },
};
