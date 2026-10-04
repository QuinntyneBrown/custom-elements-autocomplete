import { lightTheme } from './themes.js';
import type { Theme } from './types.js';

export const tokenNames = Object.freeze(Object.keys(lightTheme) as (keyof Theme)[]);

/** References inherit through Shadow DOM and fall back to the original light appearance. */
export const tokens: Readonly<Record<keyof Theme, string>> = Object.freeze(
  Object.fromEntries(
    tokenNames.map((name) => [name, `var(--ce-${name}, ${lightTheme[name]})`]),
  ) as Record<keyof Theme, string>,
);
