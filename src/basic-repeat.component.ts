import { repeat } from "virtual-scroller/lit-html/lit-repeater.js";
import { html, render, TemplateResult } from "lit-html";

export class BasicRepeatComponent extends HTMLElement {
    constructor() {
        super()

    }

    connectedCallback() {
        this.attachShadow({mode: 'open'});

        render(this.template,this.shadowRoot);

    }

    get template() {

        const first = {};
        const num = 1;
        const items = [ { name: "Quinn" }];
        const template = this.shadowRoot;
           alert("?"); 
        return html`<ul>${repeat({ first, num, totalItems: items.length, template })}</ul>`;
    }

}

customElements.define("ce-basic-repeat", BasicRepeatComponent)