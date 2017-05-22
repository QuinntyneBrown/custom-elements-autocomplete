/// <reference path="auto-complete.d.ts" />
const htmlTemplate = require("./search-box.component.html");
const styles = require("./search-box.component.scss")

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.fetchResults = this.fetchResults.bind(this);
    }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

    private get _resultsHTMLElement() { return this.shadowRoot.querySelector(".results"); }

    public set showProduct(value: SearchResultItem) {
        let productItemElements = this.shadowRoot.querySelectorAll("ce-search-result-item");
        
        for (let i = 0; i < productItemElements.length; i++) {
            (productItemElements[i] as any).showProduct = value;
        }
    }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._setEventListeners();
    }

    //TODO: implement debounce
    private _setEventListeners() { this._inputHTMLElement.addEventListener("keyup", this.fetchResults); }

    disconnectedCallback() { this._inputHTMLElement.removeEventListener("keyup", this.fetchResults); }

    private async fetchResults() {
        let response = await fetch(`http://lcboapi.com/products?access_key=${this.apiKey}&q=${this._inputHTMLElement.value}`);
        this.products = (await response.json() as SearchResponseJSON).result;
    }      

    public set products(value:Array<SearchResultItem>) {
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