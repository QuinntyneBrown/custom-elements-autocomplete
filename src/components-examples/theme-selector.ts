import { applyTheme, clearTheme, createTheme, darkTheme, lightTheme } from '../theming/index.js';

const exampleThemes = {
  light: lightTheme,
  dark: darkTheme,
  custom: createTheme({ colorBrandForeground1: '#663399', colorBrandStroke1: '#663399' }),
};

/** Example-only controls; production components depend solely on inherited CSS variables. */
export function addThemeSelector(
  controls: HTMLElement,
  target: HTMLElement = document.documentElement,
  scoped = false,
): void {
  const label = document.createElement('label');
  label.textContent = scoped ? 'First instance theme' : 'Theme';
  const select = document.createElement('select');
  select.id = scoped ? 'instance-theme' : 'theme';
  label.htmlFor = select.id;
  if (scoped) select.add(new Option('Inherit page theme', 'inherit'));
  select.add(new Option('Light', 'light'));
  select.add(new Option('Dark', 'dark'));
  select.add(new Option('Custom purple', 'custom'));
  const update = (): void => {
    if (select.value === 'inherit') clearTheme(target);
    else applyTheme(target, exampleThemes[select.value as keyof typeof exampleThemes]);
  };
  select.addEventListener('change', update);
  controls.append(label, select);
  update();
}
