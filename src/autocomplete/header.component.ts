import { html, render } from 'lit-html';

/**
 * A header wrapper.
 * @slot - Heading and supporting content.
 */
export class HeaderComponent extends HTMLElement {
  connectedCallback(): void {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    render(
      html`<style>
          :host {
            display: block;
          }</style
        ><slot></slot>`,
      root,
    );
  }
}
if (!customElements.get('ce-header')) customElements.define('ce-header', HeaderComponent);
