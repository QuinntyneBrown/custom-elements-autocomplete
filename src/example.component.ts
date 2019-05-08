import { LitElement, html, customElement} from "@polymer/lit-element";

@customElement(<any>"ce-example")
export class ExampleComponent extends LitElement {
  
  render(): any {
    return html`
      <h1>Example</h1>
    `;
  }
}
