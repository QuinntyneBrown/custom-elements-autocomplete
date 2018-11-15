import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { SearchResultItem } from "./product.service";
import { SearchResultItemComponent } from "./search-result-item.component";

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

    public get template(): TemplateResult {
        return html`
            ${repeat(this.searchResultItems, i => i.id, i => html`
            <ce-search-result-item search-result-item="${JSON.stringify(i)}"  @click=${this.showSearchResultItemDetail}></ce-search-result-item>`)}
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
        let searchResultItems = this.shadowRoot.querySelectorAll("ce-search-result-item") as NodeListOf<SearchResultItemComponent>;

        for (let i = 0; i < searchResultItems.length; i++) {            
            searchResultItems[i].isActive = searchResultItems[i].searchResultItem.id == event.currentTarget.searchResultItem.id;            
        }
    }

    attributeChangedCallback (name, newValue) {
        switch (name) {
            case "search-result-items":
                if(newValue)
                    this.searchResultItems = JSON.parse(newValue);

                if (this.parentNode)
                    render(this.template, this.shadowRoot);
                break;
        }
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);