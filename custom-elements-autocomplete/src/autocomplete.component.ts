/// <reference path="app.d.ts" />

export class AutoCompleteComponent extends HTMLElement {
    constructor() {
        super();
        this.fetchResults = this.fetchResults.bind(this);
    }

    private get _inputHTMLElement() { return this.querySelector("input"); }

    private get _resultsHTMLElement() { return this.querySelector(".results"); }

    connectedCallback() {
        this.innerHTML = require("./autocomplete.component.html");
        this._setEventListeners();
    }
    
    private _setEventListeners() { this._inputHTMLElement.addEventListener("keyup", this.fetchResults); }

    disconnectedCallback() { this._inputHTMLElement.removeEventListener("keyup", this.fetchResults); }

    private async fetchResults() {        
        var results = await fetch(`http://lcboapi.com/products?access_key=${this._apiKey}&q=${this._inputHTMLElement.value}`);
        var json = await results.json() as GetProductsResponseJSON;        
        this.products = json.result;
    }    

    public set products(value:Array<Product>) {
        this._resultsHTMLElement.innerHTML = "";
        for (let i = 0; i < value.length; i++) {
            let el = document.createElement("ce-product-item") as any;
            el.product = value[i];
            this._resultsHTMLElement.appendChild(el);
        }   
    }

    private get _apiKey() { return 'MDoxMGZmNGI2OC0xOTgwLTExZTctODIzYS1hZjBjOTQxMDg5ZTQ6UDY3T3hsM2NUdlpSOHpoYzJUVlFrODZOUG9obUI5N1NxV2Rp'; }

}

customElements.define(`ce-autocomplete`,AutoCompleteComponent);
