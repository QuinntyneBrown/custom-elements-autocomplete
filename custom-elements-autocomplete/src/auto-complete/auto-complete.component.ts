import { constants, SearchResultItemClick, ShowSearchResultItemDetail, SearchResultItemsFetched } from "./custom-events";
const htmlTemplate = require("./auto-complete.component.html");
const styles = require("./auto-complete.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class AutoCompleteComponent extends HTMLElement {
    constructor() {
        super();  
        this.attachShadow({ mode: 'open' });
        this.updateSearchResultItems = this.updateSearchResultItems.bind(this);   
        this.refreshSearchResultItems = this.refreshSearchResultItems.bind(this);   
    }

    public apiKey: string;

    private get _searchBoxHTMLElement() { return this.shadowRoot.querySelector("ce-search-box"); }

    private get _searchResultItemsElement() { return this.shadowRoot.querySelector("ce-search-result-items"); }

    static get observedAttributes() { return ["api-key"]; }
    
    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._setEventListeners();
        this._searchBoxHTMLElement.setAttribute("api-key", this.apiKey);
    }
    
    private _setEventListeners() {
        this.addEventListener(constants.SEARCH_RESULT_ITEM_CLICK, this.updateSearchResultItems);
        this._searchBoxHTMLElement.addEventListener(constants.SEARCH_RESULT_ITEMS_FETCHED, this.refreshSearchResultItems);
    }

    public updateSearchResultItems(e: SearchResultItemClick) {   
        alert("???");
        //this._searchResultItemsElement.setAttribute("show-search-result-item-detail", JSON.stringify(e.detail.searchResultItem));
    }

    public refreshSearchResultItems(e: SearchResultItemsFetched) {
        this._searchResultItemsElement.setAttribute("search-result-items", JSON.stringify(e.detail.searchResultItems));
    }

    disconnectedCallback() {
        this._searchResultItemsElement.removeEventListener(constants.SEARCH_RESULT_ITEM_CLICK, this.updateSearchResultItems);
        this._searchBoxHTMLElement.removeEventListener(constants.SEARCH_RESULT_ITEMS_FETCHED, this.refreshSearchResultItems);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }    
}

customElements.define(`ce-auto-complete`, AutoCompleteComponent);