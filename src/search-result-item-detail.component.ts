import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { SearchResultItem, SearchResponseJSON } from "./product.service";

const styles = unsafeHTML(`<style>${require("./search-result-item-detail.component.css")}</style>`);

export class SearchResultItemDetailComponent extends HTMLElement {

    private _searchResultItem: SearchResultItem;

    static get observedAttributes () {
        return [
            "search-result-item"
        ];
    }

    public get template():TemplateResult {
        return html`
            ${styles}
            <img src="${this._searchResultItem.image_url == null ? this.defultImageUrl : this._searchResultItem.image_url}" />
            <div class="search-result-item-detail-details-container">
                <h3 class="search-result-item-detail-category">${this._searchResultItem.primary_category}</h3>
                <h2 class="search-result-item-detail-name">${this._searchResultItem.name}, ${this._searchResultItem.volume_in_milliliters} ml</h2>
                <h3 class="search-result-item-detail-price">$${(this._searchResultItem.price_in_cents / 100).toFixed(2)}</h3>
                <p class="search-result-item-detail-description">${this._searchResultItem.tasting_note}</p>
            </div>
        `;
    }

    connectedCallback() {
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitemdetail');

        render(this.template, this.shadowRoot);        
    }

    public get defultImageUrl() { return "http://www.lcbo.com/content/dam/lcbo/products/generic.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"; }
    
    
    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "search-result-item":                
                this._searchResultItem = JSON.parse(newValue);                
                break;
        }
    }
}

customElements.define(`ce-search-result-item-detail`,SearchResultItemDetailComponent);