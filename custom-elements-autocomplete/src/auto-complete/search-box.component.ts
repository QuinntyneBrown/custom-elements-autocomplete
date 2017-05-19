/// <reference path="auto-complete.d.ts" />

export class SearchBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.fetchResults = this.fetchResults.bind(this);
    }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    private get _inputHTMLElement() { return this.querySelector("input"); }

    private get _resultsHTMLElement() { return this.querySelector(".results"); }

    public set showProduct(value: Product) {
        let productItems = this.querySelectorAll("ce-product-item");
        
        for (let i = 0; i < productItems.length; i++) {
            (productItems[i] as any).showProduct = value;
        }
    }

    connectedCallback() {
        this.innerHTML = require("./search-box.component.html");
        this._setEventListeners();
    }

    //TODO: implement debounce
    private _setEventListeners() { this._inputHTMLElement.addEventListener("keyup", this.fetchResults); }

    disconnectedCallback() { this._inputHTMLElement.removeEventListener("keyup", this.fetchResults); }

    private async fetchResults() {
        let results = await fetch(`http://lcboapi.com/products?access_key=${this.apiKey}&q=${this._inputHTMLElement.value}`);
        this.products = (await results.json() as GetProductsResponseJSON).result;
    }      

    public set products(value:Array<Product>) {
        this._resultsHTMLElement.innerHTML = "";
        for (let i = 0; i < value.length; i++) {
            let el = document.createElement("ce-product-item") as any;
            el.product = value[i];
            this._resultsHTMLElement.appendChild(el);
        }   
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }  

    public apiKey: string;
}

customElements.define(`ce-search-box`,SearchBoxComponent);
