// Traces to: L2-008, L2-009, L2-011
import { describe, expect, test } from '@jest/globals';
import {
  applyTheme,
  clearTheme,
  createTheme,
  darkTheme,
  lightTheme,
  tokens,
} from '../../src/theming/index.js';

describe('theming contracts', () => {
  test('presets and references have the same complete token surface', () => {
    expect(Object.keys(darkTheme)).toEqual(Object.keys(lightTheme));
    expect(Object.keys(tokens)).toEqual(Object.keys(lightTheme));
    expect(Object.isFrozen(lightTheme)).toBe(true);
    expect(Object.isFrozen(darkTheme)).toBe(true);
    for (const key of Object.keys(lightTheme) as (keyof typeof lightTheme)[]) {
      expect(tokens[key]).toBe(`var(--ce-${key}, ${lightTheme[key]})`);
    }
  });

  test('custom themes merge without changing inputs', () => {
    const overrides = Object.freeze({ colorBrandStroke1: '#663399' });
    const custom = createTheme(overrides, darkTheme);
    expect(custom.colorBrandStroke1).toBe('#663399');
    expect(custom.colorNeutralBackground1).toBe(darkTheme.colorNeutralBackground1);
    expect(darkTheme.colorBrandStroke1).not.toBe('#663399');
    expect(createTheme({})).toEqual(lightTheme);
  });

  test('applying, replacing and clearing themes preserves unrelated styles', () => {
    const element = document.createElement('div');
    element.style.setProperty('width', '40px');
    element.style.setProperty('--unrelated', 'hello');
    applyTheme(element, darkTheme);
    expect(element.style.getPropertyValue('--ce-colorNeutralBackground1')).toBe(
      darkTheme.colorNeutralBackground1,
    );
    applyTheme(element, lightTheme);
    expect(element.style.getPropertyValue('--ce-colorNeutralBackground1')).toBe(
      lightTheme.colorNeutralBackground1,
    );
    clearTheme(element);
    for (const key of Object.keys(tokens))
      expect(element.style.getPropertyValue(`--ce-${key}`)).toBe('');
    expect(element.style.width).toBe('40px');
    expect(element.style.getPropertyValue('--unrelated')).toBe('hello');
  });

  test('built-in text and focus colors have accessible contrast', () => {
    const luminance = (hex: string): number => {
      const values = hex
        .slice(1)
        .match(/../g)!
        .map((part) => {
          const value = parseInt(part, 16) / 255;
          return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
      return values[0] * 0.2126 + values[1] * 0.7152 + values[2] * 0.0722;
    };
    const contrast = (first: string, second: string): number => {
      const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
      return (values[0] + 0.05) / (values[1] + 0.05);
    };
    for (const theme of [lightTheme, darkTheme]) {
      for (const background of [
        theme.colorNeutralBackground1,
        theme.colorNeutralBackground2,
        theme.colorNeutralBackground1Hover,
      ]) {
        for (const foreground of [
          theme.colorNeutralForeground1,
          theme.colorNeutralForeground2,
          theme.colorBrandForeground1,
        ]) {
          expect(contrast(foreground, background)).toBeGreaterThanOrEqual(4.5);
        }
        expect(contrast(theme.colorBrandStroke1, background)).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
