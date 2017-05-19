/// <reference path="app.d.ts" />

export class ProductDetailComponent extends HTMLElement {
    constructor() {
        super();
    }

    private _product: Product;

    private get nameHTMLElement() { return this.querySelector("h3"); }

    private get fullImageHTMLElement() { return this.querySelector("img"); }

    private get priceHTMLElement() { return this.querySelector("h3"); }

    static get observedAttributes () {
        return [
            "product"
        ];
    }

    connectedCallback() {
        this.innerHTML = require("./product-detail.component.html");
        this._bind();
    }

    private async _bind() {

    }
    
    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "product":
                this._product = JSON.parse(newValue);

                if (this.parentNode)
                    this._bind();
                break;
        }
    }
}

customElements.define(`ce-product-detail`,ProductDetailComponent);
