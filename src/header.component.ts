import { render, html, TemplateResult } from "lit-html";

export class HeaderComponent extends HTMLElement {
    connectedCallback() {

        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        render(this.template, this.shadowRoot);       
    }    

    public get template(): TemplateResult {
        return html`
            <style>
                :host {
                    display:block;    
                    padding: 0px 20px;
                }
            </style>
            <h1>
                <slot></slot>
            </h1>
        `;
    }
}

customElements.define(`ce-header`, HeaderComponent);