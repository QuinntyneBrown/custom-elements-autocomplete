import { html, TemplateResult, render } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./form-field.component.css")}<style>`);

export class FormFieldComponent extends HTMLElement {
  
  connectedCallback() {
    this.attachShadow({ mode: 'open' });
    render(this.template, this.shadowRoot);

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'formfield');
  }

  get template(): TemplateResult {
    return html`
      ${styles}
      <slot></slot>
    `;
  }
}

customElements.define(`ce-form-field`,FormFieldComponent);
