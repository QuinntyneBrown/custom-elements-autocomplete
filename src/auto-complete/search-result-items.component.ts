import { constants } from "./custom-events";

const html = require("./search-result-items.component.html");
const css = require("./search-result-items.component.scss");

const template = document.createElement("template");
template.innerHTML = `<style>${css}</style>${html}`;

export class SearchResultItemsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.showSearchResultItemDetail = this.showSearchResultItemDetail.bind(this);
    }

    public searchResultItems: Array<any> = [];

    static get observedAttributes () {
        return [
            "search-result-items"
        ];
    }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true)); 

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchresultitems');
   
        this._bind();        
        this._setEventListeners();
    }

    private _setEventListeners() {
        this.addEventListener(constants.SEARCH_RESULT_ITEM_CLICKED, this.showSearchResultItemDetail);
    }

    public disconnectedCallback() {
        this.removeEventListener(constants.SEARCH_RESULT_ITEM_CLICKED, this.showSearchResultItemDetail);
    }

    private _bind() {
        if (this.searchResultItems.length > 0) {
            this.shadowRoot.innerHTML = "";
            for (let i = 0; i < this.searchResultItems.length; i++) {
                const searchResultItemElement = document.createElement("ce-search-result-item") as any;
                searchResultItemElement.setAttribute("search-result-item", JSON.stringify(this.searchResultItems[i]));
                this.shadowRoot.appendChild(searchResultItemElement);
            }
        } else {
            this.shadowRoot.innerHTML = `<p>No Results...</p>`;
        }
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
                    this._bind();
                break;
        }
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);