import { lightTheme } from './themes.js';
import { tokenNames } from './tokens.js';
import type { PartialTheme, Theme } from './types.js';

export function createTheme(overrides: PartialTheme, baseTheme: Theme = lightTheme): Theme {
  return Object.freeze(
    Object.fromEntries(
      tokenNames.map((name) => [name, overrides[name] ?? baseTheme[name]]),
    ) as Theme,
  );
}

/** Apply to document.documentElement, a container, or a component host. */
export function applyTheme(element: HTMLElement, theme: Theme): void {
  for (const name of tokenNames) element.style.setProperty(`--ce-${name}`, theme[name]);
}

/** Remove all supported inline token overrides, including ones set directly with CSS. */
export function clearTheme(element: HTMLElement): void {
  for (const name of tokenNames) element.style.removeProperty(`--ce-${name}`);
}
