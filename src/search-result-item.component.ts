import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { searchResultItemClicked } from "./constants";
import { SearchResultItem } from "./product.service";

const styles = unsafeHTML(`<style>${require("./search-result-item.component.css")}</style>`);

export class SearchResultItemComponent extends HTMLElement {
    constructor() {
        super();        
        this.dispatchSearchResultItemEvent = this.dispatchSearchResultItemEvent.bind(this); 
    }

    static get observedAttributes() {
        return [
            "search-result-item"
        ];
    }

    private get searchResultItemDetailsHTMLElement() { return this.shadowRoot.querySelector("ce-search-result-item-detail"); }

    public get template(): TemplateResult {
        return html`
            ${styles}            
            <img src="${this.searchResultItem.image_thumb_url == null ? this.defaultImageUrl : this.searchResultItem.image_thumb_url}" />
            <h2>${this.searchResultItem.name}</h2>
            <ce-search-result-item-detail search-result-item='${JSON.stringify(this.searchResultItem)}'></ce-search-result-item-detail>
        `;
    }

    async connectedCallback() {                
        this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitem');

        if (!this.hasAttribute('tabindex'))
            this.setAttribute('tabindex', '0');

        await customElements.whenDefined('ce-search-result-item-detail');

        render(this.template, this.shadowRoot);
        
        this._setEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.dispatchSearchResultItemEvent);
    }

    public get defaultImageUrl() { return "http://www.lcbo.com/content/dam/lcbo/products/generic.jpg/jcr:content/renditions/cq5dam.thumbnail.319.319.png"; }

    private _setEventListeners() {
        this.addEventListener("click", this.dispatchSearchResultItemEvent);
    }

    public dispatchSearchResultItemEvent () {
        this.dispatchEvent(new CustomEvent(searchResultItemClicked, {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: { searchResultItem: this.searchResultItem }
        } as CustomEventInit));
    }

    public set isActive(value:boolean) {
        if (value && !this.classList.contains("active")) {         
            this.classList.add("active");
        } else {
            this.classList.remove("active")
        }
    }

    public searchResultItem: SearchResultItem = <SearchResultItem>{};

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "search-result-item":                
                this.searchResultItem = JSON.parse(newValue);                
                break;                
        }
    }   
}

customElements.define(`ce-search-result-item`, SearchResultItemComponent);