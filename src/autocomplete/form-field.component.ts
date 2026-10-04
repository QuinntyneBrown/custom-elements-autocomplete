import { html, render } from 'lit-html';
import styles from './form-field.component.styles.js';

export class FormFieldComponent extends HTMLElement {
  connectedCallback(): void {
    const root = this.shadowRoot ?? this.attachShadow({ mode: 'open' });
    render(
      html`<style>
          ${styles}</style
        ><slot></slot>`,
      root,
    );
  }
}
if (!customElements.get('ce-form-field'))
  customElements.define('ce-form-field', FormFieldComponent);
