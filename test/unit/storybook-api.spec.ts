import { describe, expect, test, jest } from '@jest/globals';
import { renderAutocomplete } from '../../src/components-examples/stories/helpers.js';
import { applyStoryArgs, getStorybookHelpers } from '../../.storybook/api.js';
import '../../src/index.js';

describe('[L2-013, L2-014] manifest-backed Storybook API', () => {
  test('documents providers and events without executable controls', () => {
    expect(
      getStorybookHelpers('ce-search-result-items').argTypes.showSearchResultItemDetail.control,
    ).toBe(false);
    expect(
      getStorybookHelpers('ce-search-result-items').argTypes.showSearchResultItemDetail.table
        ?.category,
    ).toBe('methods');
    expect(getStorybookHelpers('ce-auto-complete').argTypes.searchProvider.control).toBe(false);
    expect(getStorybookHelpers('ce-search-result-item').argTypes['product-select'].control).toBe(
      false,
    );
    expect(getStorybookHelpers('ce-form-field').argTypes['slot:default'].table?.category).toBe(
      'slots',
    );
  });
  test('limits overrides to public APIs and renders slot input as text', () => {
    const header = document.createElement('ce-header');
    header.innerHTML = '<span data-story-slot></span>';
    applyStoryArgs(header, { 'slot:default': '<img src=x onerror=alert(1)>', innerHTML: 'unsafe' });
    expect(header.querySelector('img')).toBeNull();
    expect(header.textContent).toContain('<img');
    const field = document.createElement('ce-form-field');
    applyStoryArgs(field, { '--ce-colorBrandStroke1': '#663399', '--unknown': 'red' });
    expect(field.style.getPropertyValue('--ce-colorBrandStroke1')).toBe('#663399');
    expect(field.style.getPropertyValue('--unknown')).toBe('');
  });
  test('disconnecting a pending story aborts its provider and stops observing input', async () => {
    jest.useFakeTimers();
    const wrapper = renderAutocomplete({ scenario: 'loading' });
    const component = wrapper.querySelector(
      'ce-auto-complete',
    )! as import('../../src/product-autocomplete/index.js').AutoCompleteComponent;
    let signal: AbortSignal | undefined;
    const search = jest
      .fn<NonNullable<typeof component.searchProvider>['search']>()
      .mockImplementation((_query, requestSignal) => {
        signal = requestSignal;
        return new Promise(() => {});
      });
    component.searchProvider = { search };
    try {
      document.body.append(wrapper);
      const input = component.shadowRoot!.querySelector('input')!;
      input.value = 'wine';
      input.dispatchEvent(new Event('input'));
      await jest.advanceTimersByTimeAsync(200);
      expect(search).toHaveBeenCalledTimes(1);
      wrapper.remove();
      expect(signal?.aborted).toBe(true);
      input.dispatchEvent(new Event('input'));
      await jest.advanceTimersByTimeAsync(300);
      expect(search).toHaveBeenCalledTimes(1);
    } finally {
      wrapper.remove();
      jest.useRealTimers();
    }
  });
});
