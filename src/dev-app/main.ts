import '../components-examples/example.css';
import '../product-autocomplete/index.js';
import { addThemeSelector } from '../components-examples/theme-selector.js';
import { createAutocompleteExample } from '../components-examples/autocomplete-example.js';
import {
  createFixtureProvider,
  type FixtureScenario,
} from '../components-examples/fixture-search-provider.js';

const first = createAutocompleteExample(createFixtureProvider(), 'first');
document.querySelector('#primary')!.append(first);
const controls = document.querySelector<HTMLElement>('.controls')!;
addThemeSelector(controls);
addThemeSelector(controls, first, true);
document
  .querySelector('#secondary')!
  .append(createAutocompleteExample(createFixtureProvider(), 'second'));
document.querySelector<HTMLSelectElement>('#scenario')!.addEventListener('change', (event) => {
  first.searchProvider = createFixtureProvider(
    (event.target as HTMLSelectElement).value as FixtureScenario,
  );
});
