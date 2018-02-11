import { render, TemplateResult, html } from "lit-html";
import { unsafeHTML } from "../../node_modules/lit-html/lib/unsafe-html.js";

const styles = unsafeHTML(`<style>${require("./header.component.css")}</style>`);

export class HeaderComponent extends HTMLElement {
    connectedCallback() {
        if(!this.shadowRoot) this.attachShadow({ mode: 'open' });
        render(this.template, this.shadowRoot);       
    }    

    public get template() {
        return html`
            <h1>Auto Complete using Custom Elements v1</h1>
        `;
    }
}

customElements.define(`ce-header`,HeaderComponent);