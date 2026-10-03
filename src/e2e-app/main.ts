import '../components-examples/example.css';
import { createAutocompleteExample } from '../components-examples/autocomplete-example.js';
import {
  createFixtureProvider,
  fixtureScenarios,
  type FixtureScenario,
} from '../components-examples/fixture-search-provider.js';

const scenario = new URLSearchParams(location.search).get('scenario') ?? 'normal';
const requests: string[] = [];
const provider =
  scenario === 'unconfigured'
    ? undefined
    : createFixtureProvider(
        fixtureScenarios.includes(scenario as FixtureScenario)
          ? (scenario as FixtureScenario)
          : 'normal',
        (query) => {
          requests.push(query);
          document.querySelector('[data-testid="requests"]')!.textContent =
            JSON.stringify(requests);
        },
      );
const first = createAutocompleteExample(provider, 'first');
const primary = document.querySelector('#primary')!;
primary.append(first);
document
  .querySelector('#secondary')!
  .append(createAutocompleteExample(createFixtureProvider(), 'second'));
document.querySelector('#disconnect')!.addEventListener('click', () => first.remove());
document.querySelector('#reconnect')!.addEventListener('click', () => {
  if (!first.isConnected) primary.append(first);
});
