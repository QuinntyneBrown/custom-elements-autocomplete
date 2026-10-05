import { addons } from 'storybook/manager-api';
import theme from './theme.js';

addons.setConfig({
  enableShortcuts: false,
  sidebar: { showRoots: true },
  showPanel: false,
  theme,
});
