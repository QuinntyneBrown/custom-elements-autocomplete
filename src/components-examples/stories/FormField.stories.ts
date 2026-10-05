import type { Meta, StoryObj } from '@storybook/html';
import { html } from 'lit-html';
import { getStorybookHelpers } from '../../../.storybook/api.js';
import { renderComponent, type StoryArgs } from './helpers.js';

const meta = {
  title: 'Components/Form Field',
  component: 'ce-form-field',
  argTypes: getStorybookHelpers('ce-form-field').argTypes,
  render: (args: StoryArgs) =>
    renderComponent(
      html`<ce-form-field
        ><label>Search <input placeholder="Type to search" /></label
      ></ce-form-field>`,
      args,
    ),
  parameters: {
    docs: {
      source: {
        code: '<ce-form-field><label>Search <input placeholder="Type to search" /></label></ce-form-field>',
      },
    },
  },
} satisfies Meta<StoryArgs>;
export default meta;
export const Default: StoryObj<StoryArgs> = {};
