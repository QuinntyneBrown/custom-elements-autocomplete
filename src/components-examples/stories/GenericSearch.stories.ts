import type { Meta, StoryObj } from '@storybook/html';
import { html, type TemplateResult } from 'lit-html';
import { SearchAutocompleteElement } from '../../autocomplete/index.js';

class CitySearch extends SearchAutocompleteElement<string> {
  protected override renderResults(cities: string[]): TemplateResult {
    return html`<ul>
      ${cities.map((city) => html`<li>${city}</li>`)}
    </ul>`;
  }
}
if (!customElements.get('example-city-search'))
  customElements.define('example-city-search', CitySearch);

const meta = {
  title: 'Concepts/Developer/Generic Search',
  render: () => {
    const search = document.createElement('example-city-search') as CitySearch;
    search.searchProvider = {
      async search(query, signal) {
        signal?.throwIfAborted();
        return ['Toronto', 'Montreal'].filter((city) =>
          city.toLowerCase().includes(query.toLowerCase()),
        );
      },
    };
    return search;
  },
  parameters: {
    docs: {
      description: {
        component:
          'A live string provider. Search Toronto or Montreal. See Generic Providers for the complete implementation.',
      },
    },
  },
} satisfies Meta;
export default meta;
export const Default: StoryObj = {};
