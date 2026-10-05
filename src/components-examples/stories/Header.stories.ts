import type { Meta, StoryObj } from '@storybook/html';
import { html } from 'lit-html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { renderComponent, type StoryArgs } from './helpers.js';

const meta = {
  title: 'Components/Header',
  component: 'ce-header',
  argTypes: getStorybookHelpers('ce-header').argTypes,
  args: { 'slot:default': 'Product search' },
  render: (args: StoryArgs) =>
    renderComponent(html`<ce-header><h1 data-story-slot>Product search</h1></ce-header>`, args),
  parameters: { docs: { source: { code: '<ce-header><h1>Product search</h1></ce-header>' } } },
} satisfies Meta<StoryArgs>;
export default meta;
export const Default: StoryObj<StoryArgs> = {};
