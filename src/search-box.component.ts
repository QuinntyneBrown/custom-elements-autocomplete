import { render, TemplateResult, html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./search-box.component.css")}</style>`);

export class SearchBoxComponent extends HTMLElement {

  public get template():TemplateResult {
    return html`
      ${styles}
      <input type="text" placeholder="Search For..." />
    `;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'searchbox');

    render(this.template, this.shadowRoot);
  }

  public get value() { return this.shadowRoot.querySelector("input").value; }
}

customElements.define(`ce-search-box`,SearchBoxComponent);
