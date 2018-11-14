import { render, html, TemplateResult } from "lit-html";

export class HeaderComponent extends HTMLElement {

  connectedCallback() {

    this.attachShadow({ mode: 'open' });

    render(this.template, this.shadowRoot);     
  }  
  
  public get template(): TemplateResult {
    return html`
      <style>
        :host {
          display:block;  
          padding: 0px 20px;
        }

        ::slotted(h1) {
          font-family: Montserrat;
        }
      </style>
      <slot></slot>      
    `;
  }
}

customElements.define(`ce-header`, HeaderComponent);
