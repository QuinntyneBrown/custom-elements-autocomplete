// Traces to: L2-012, L2-013
import { readFileSync } from 'node:fs';
import { expect, test } from '@jest/globals';

test('manifest describes registered elements and excludes implementation details', () => {
  const manifest = JSON.parse(readFileSync('custom-elements.json', 'utf8'));
  const declarations = manifest.modules.flatMap(
    (module: {
      declarations?: { tagName?: string; members?: { name: string; privacy?: string }[] }[];
    }) => module.declarations ?? [],
  );
  const elements = declarations.filter((item: { tagName?: string }) => item.tagName);
  expect(elements.map((item: { tagName: string }) => item.tagName).sort()).toEqual([
    'ce-auto-complete',
    'ce-form-field',
    'ce-header',
    'ce-search-result-item',
    'ce-search-result-item-detail',
    'ce-search-result-items',
  ]);
  const autocomplete = elements.find(
    (item: { tagName: string }) => item.tagName === 'ce-auto-complete',
  );
  expect(
    autocomplete.members.some((member: { name: string }) => member.name === 'searchProvider'),
  ).toBe(true);
  expect(autocomplete.cssProperties).toContainEqual(
    expect.objectContaining({ name: '--ce-colorBrandStroke1', default: '#176d91' }),
  );
  const result = elements.find(
    (item: { tagName: string }) => item.tagName === 'ce-search-result-item',
  );
  expect(result.events).toContainEqual(
    expect.objectContaining({ name: 'product-select', type: { text: 'CustomEvent<number>' } }),
  );
  const field = elements.find((item: { tagName: string }) => item.tagName === 'ce-form-field');
  expect(field.slots).toContainEqual(expect.objectContaining({ name: '' }));
  for (const item of declarations) {
    for (const member of item.members ?? []) {
      expect(['private', 'protected']).not.toContain(member.privacy);
      expect([
        'provider',
        'subscription',
        'controller',
        'revision',
        'update',
        'observeInput',
        'invalidate',
        'selectedId',
      ]).not.toContain(member.name);
    }
  }
  for (const module of manifest.modules)
    expect(module.path).not.toMatch(/components-examples|stories|\.styles\./);
});
