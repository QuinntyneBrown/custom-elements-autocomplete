import type { lightTheme } from './themes.js';

/** Semantic token values; CSS units are supplied as part of each string. */
export type Theme = { readonly [Key in keyof typeof lightTheme]: string };
export type PartialTheme = Partial<Theme>;
