import {
  AutoCompleteComponent,
  type ProductSearchProvider,
} from '../product-autocomplete/index.js';

export function createAutocompleteExample(
  provider?: ProductSearchProvider,
  id?: string,
): AutoCompleteComponent {
  const component = document.createElement('ce-auto-complete') as AutoCompleteComponent;
  if (id) component.id = id;
  component.searchProvider = provider;
  return component;
}
