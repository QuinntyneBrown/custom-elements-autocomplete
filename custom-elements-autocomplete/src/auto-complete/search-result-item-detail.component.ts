/// <reference path="auto-complete.d.ts" />
const htmlTemplate = require("./search-result-item-detail.component.html");
const styles = require("./search-result-item-detail.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchResultItemDetailComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    private _searchResultItem: SearchResultItem;

    private get nameHTMLElement() { return this.shadowRoot.querySelector(".product-detail-name"); }

    private get fullImageHTMLElement() { return this.shadowRoot.querySelector("img"); }

    private get priceHTMLElement() { return this.shadowRoot.querySelector(".product-detail-price"); }

    private get categoryHTMLElement() { return this.shadowRoot.querySelector(".product-detail-category"); }

    private get tastingNoteHTMLElement() { return this.shadowRoot.querySelector(".product-detail-tasting-note"); }

    static get observedAttributes () {
        return [
            "search-result-item"
        ];
    }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._bind();
    }

    private async _bind() {
        if (this._searchResultItem) {
            this.nameHTMLElement.innerHTML = this._searchResultItem.name;
            this.fullImageHTMLElement.src = this._searchResultItem.image_url;
            this.priceHTMLElement.innerHTML = `$${(this._searchResultItem.price_in_cents / 100).toFixed(2)}`;
            this.categoryHTMLElement.textContent = this._searchResultItem.primary_category;
            this.tastingNoteHTMLElement.textContent = this._searchResultItem.tasting_note;
        }
    }
    
    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "search-result-item":
                this._searchResultItem = JSON.parse(newValue);
                
                if (this.parentNode)
                    this._bind();
                break;
        }
    }
}

customElements.define(`ce-search-result-item-detail`,SearchResultItemDetailComponent);
