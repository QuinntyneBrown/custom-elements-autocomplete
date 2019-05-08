import { html, TemplateResult, render } from "lit-html";
import { LitElement } from "@polymer/lit-element";

export class ExampleComponent extends LitElement {

  constructor() {
    super();
    
  }

  render(): TemplateResult {
    alert("WTF");
    return html`
      <h1>Example</h1>
    `;
  }
}

customElements.define(`ce-example`,ExampleComponent);
