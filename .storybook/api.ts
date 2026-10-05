/**
 * Manifest-driven categories follow Fluent UI's wc-toolkit-helpers conventions.
 * Original reference: microsoft/fluentui, packages/web-components/.storybook/wc-toolkit-helpers.ts
 * Copyright (c) Microsoft Corporation. Licensed under the MIT License.
 * This implementation uses native elements and lit-html rather than FAST or full Lit.
 */
import type { ArgTypes } from '@storybook/html';
import manifest from '../custom-elements.json' with { type: 'json' };

export interface ApiEntry {
  name: string;
  description?: string;
  default?: string;
  kind?: string;
  readonly?: boolean;
  type?: { text: string };
  parsedType?: { text?: string };
}
export interface ComponentApi {
  tagName?: string;
  description?: string;
  members?: ApiEntry[];
  attributes?: ApiEntry[];
  slots?: ApiEntry[];
  cssProperties?: ApiEntry[];
  events?: ApiEntry[];
}

export function getComponentApi(tagName: string): ComponentApi {
  const declarations = (manifest.modules as { declarations?: ComponentApi[] }[]).flatMap(
    (module) => module.declarations ?? [],
  );
  const component = declarations.find((declaration) => declaration.tagName === tagName);
  if (!component) throw new Error(`Missing component manifest: ${tagName}`);
  return component;
}

export function getStorybookHelpers(tagName: string): { argTypes: ArgTypes; description: string } {
  const component = getComponentApi(tagName);
  const argTypes: ArgTypes = {};
  const categories: [string, ApiEntry[]][] = [
    ['attributes', component.attributes ?? []],
    ['properties', (component.members ?? []).filter((member) => !isMethod(member))],
    ['slots', component.slots ?? []],
    ['cssProps', component.cssProperties ?? []],
    ['methods', (component.members ?? []).filter(isMethod)],
    ['events', component.events ?? []],
  ];
  for (const [category, entries] of categories) {
    for (const entry of entries) {
      const name = category === 'slots' ? `slot:${entry.name || 'default'}` : entry.name;
      const type = entry.parsedType?.text ?? entry.type?.text ?? 'string';
      const control =
        ['methods', 'events'].includes(category) || entry.readonly || name === 'searchProvider'
          ? false
          : category === 'cssProps'
            ? name.toLowerCase().includes('color') && !name.endsWith('colorScheme')
              ? 'color'
              : 'text'
            : type.includes('boolean')
              ? 'boolean'
              : type.includes('number') && !type.includes('{')
                ? 'number'
                : type.includes('SearchResultItem')
                  ? 'object'
                  : 'text';
      argTypes[name] = {
        name,
        description: entry.description,
        control,
        table: {
          category,
          type: { summary: type },
          defaultValue: entry.default === undefined ? undefined : { summary: entry.default },
        },
      };
    }
  }
  return { argTypes, description: component.description ?? tagName };
}

/** Apply only documented tokens and writable component properties, never HTML strings. */
export function applyStoryArgs(element: HTMLElement, args: Record<string, unknown>): void {
  const component = getComponentApi(element.localName);
  for (const property of component.cssProperties ?? []) {
    const value = args[property.name];
    if (typeof value === 'string' && value) element.style.setProperty(property.name, value);
  }
  const writable = (component.members ?? []).filter(
    (member) => !isMethod(member) && !member.readonly,
  );
  for (const property of writable) {
    if (property.name !== 'searchProvider' && property.name in args)
      Reflect.set(element, property.name, args[property.name]);
  }
  for (const slot of component.slots ?? []) {
    const value = args[`slot:${slot.name || 'default'}`];
    if (typeof value === 'string') {
      const content = element.querySelector('[data-story-slot]');
      if (content) content.textContent = value;
    }
  }
}

function isMethod(member: ApiEntry): boolean {
  return member.kind === 'method' || !!member.type?.text.includes('=>');
}
