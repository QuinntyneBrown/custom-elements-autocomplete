import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { SearchResultItem } from "./product.service";
import { SearchResultItemComponent } from "./search-result-item.component";

export class SearchResultItemsComponent extends HTMLElement {
    constructor() {
        super();        
        this.showSearchResultItemDetail = this.showSearchResultItemDetail.bind(this);                
    }

    private _searchResultItems: Array<SearchResultItem> = [];

    public set searchResultItems(value) {
        this._searchResultItems = value;

        if (this.parentNode)
            render(this.template, this.shadowRoot);
    }

    public get template(): TemplateResult {
        return html`
            <style>
                :host {
                    display:block;               
                }
            </style>
            ${repeat(this._searchResultItems, i => i.id, i => html`
            <ce-search-result-item .searchResultItem="${i}"  @click=${this.showSearchResultItemDetail}></ce-search-result-item>`)}
        `;
    }

    async connectedCallback() {        
        
        this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitems');

        await customElements.whenDefined('ce-search-result-item');

        render(this.template, this.shadowRoot);        
    }

    public showSearchResultItemDetail(event: any) {                        
        Array.from(this.shadowRoot.querySelectorAll("ce-search-result-item") as NodeListOf<SearchResultItemComponent>)
        .map(e => e.isActive = e.searchResultItem.id == event.currentTarget.searchResultItem.id);
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);