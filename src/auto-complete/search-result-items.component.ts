import { searchResultItemClicked } from "./custom-events";
import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/lib/repeat";
import { unsafeHTML } from "../../node_modules/lit-html/lib/unsafe-html.js";
import { SearchResultItem } from "./auto-complete.interfaces";

const styles = unsafeHTML(`<style>${require("./search-result-items.component.css")}</style>`);


export class SearchResultItemsComponent extends HTMLElement {
    constructor() {
        super();        
        this.showSearchResultItemDetail = this.showSearchResultItemDetail.bind(this);
    }

    public searchResultItems: Array<SearchResultItem> = [];

    static get observedAttributes () {
        return [
            "search-result-items"
        ];
    }

    public get template() {
        return html`
            ${styles}
            ${repeat(this.searchResultItems, i => i.id, i => html`
            <ce-search-result-item search-result-item="${JSON.stringify(i)}"></ce-search-result-item>`)}
        `;
    }

    connectedCallback() {
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitems');

        render(this.template, this.shadowRoot);
        
        this._setEventListeners();
    }

    private _setEventListeners() {
        this.addEventListener(searchResultItemClicked, this.showSearchResultItemDetail);
    }

    public disconnectedCallback() {
        this.removeEventListener(searchResultItemClicked, this.showSearchResultItemDetail);
    }
    
    public showSearchResultItemDetail(event: any) {
        let searchResultItemElements = this.shadowRoot.querySelectorAll("ce-search-result-item");

        for (let i = 0; i < searchResultItemElements.length; i++) {
            (searchResultItemElements[i] as any).activeSearchResultItem = event.detail.searchResultItem;
        }
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "search-result-items":
                this.searchResultItems = JSON.parse(newValue);

                if (this.parentNode)
                    render(this.template, this.shadowRoot);
                break;
        }
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);