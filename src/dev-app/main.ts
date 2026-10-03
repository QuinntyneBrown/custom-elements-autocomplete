import '../components-examples/example.css';
import '../autocomplete/index.js';
import { createAutocompleteExample } from '../components-examples/autocomplete-example.js';
import {
  createFixtureProvider,
  type FixtureScenario,
} from '../components-examples/fixture-search-provider.js';

const first = createAutocompleteExample(createFixtureProvider());
document.querySelector('#primary')!.append(first);
document.querySelector('#secondary')!.append(createAutocompleteExample(createFixtureProvider()));
document.querySelector<HTMLSelectElement>('#scenario')!.addEventListener('change', (event) => {
  first.searchProvider = createFixtureProvider(
    (event.target as HTMLSelectElement).value as FixtureScenario,
  );
});
