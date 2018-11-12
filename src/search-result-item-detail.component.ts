import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/lib/repeat";
import { unsafeHTML } from "lit-html/lib/unsafe-html";
import { SearchResultItem, SearchResponseJSON } from "./product.service";

const styles = unsafeHTML(`<style>${require("./search-result-item-detail.component.css")}</style>`);

export class SearchResultItemDetailComponent extends HTMLElement {
    constructor() {
        super();        
    }

    private _searchResultItem: SearchResultItem;

    private get nameHTMLElement() { return this.shadowRoot.querySelector(".search-result-item-detail-name"); }

    private get fullImageHTMLElement() { return this.shadowRoot.querySelector("img"); }

    private get priceHTMLElement() { return this.shadowRoot.querySelector(".search-result-item-detail-price"); }

    private get categoryHTMLElement() { return this.shadowRoot.querySelector(".search-result-item-detail-category"); }

    private get descriptionHTMLElement() { return this.shadowRoot.querySelector(".search-result-item-detail-description"); }

    static get observedAttributes () {
        return [
            "search-result-item"
        ];
    }

    public get template():TemplateResult {
        return html`
            ${styles}
            <img />
            <div class="search-result-item-detail-details-container">
                <h3 class="search-result-item-detail-category"></h3>
                <h2 class="search-result-item-detail-name"></h2>
                <h3 class="search-result-item-detail-price"></h3>
                <p class="search-result-item-detail-description"></p>
            </div>
        `;
    }

    connectedCallback() {
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitemdetail');

        render(this.template, this.shadowRoot);

        this._bind();
    }

    public get defultImageUrl() { return "http://www.lcbo.com/content/dam/lcbo/products/generic.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"; }

    private async _bind() {
        if (this._searchResultItem) {            
            this.categoryHTMLElement.textContent = this._searchResultItem.primary_category;
            this.fullImageHTMLElement.src = this._searchResultItem.image_url == null ? this.defultImageUrl : this._searchResultItem.image_url;
            this.nameHTMLElement.innerHTML = `${this._searchResultItem.name}, ${this._searchResultItem.volume_in_milliliters} ml`;
            this.priceHTMLElement.innerHTML = `$${(this._searchResultItem.price_in_cents / 100).toFixed(2)}`;            
            this.descriptionHTMLElement.textContent = this._searchResultItem.tasting_note;
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