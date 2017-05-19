/// <reference path="app.d.ts" />

export class ProductDetailComponent extends HTMLElement {
    constructor() {
        super();
    }

    private _product: Product;

    private get nameHTMLElement() { return this.querySelector(".product-detail-name"); }

    private get fullImageHTMLElement() { return this.querySelector("img"); }

    private get priceHTMLElement() { return this.querySelector(".product-detail-price"); }

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
        if (this._product) {
            this.nameHTMLElement.innerHTML = this._product.name;
            this.fullImageHTMLElement.src = this._product.image_url;
            this.priceHTMLElement.innerHTML = `$${this._product.price_in_cents / 100}`;
        }
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
