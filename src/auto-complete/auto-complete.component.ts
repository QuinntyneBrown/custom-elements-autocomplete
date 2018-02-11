import { constants } from "./custom-events";

const html = require("./auto-complete.component.html");
const css = require("./auto-complete.component.css");

const template = document.createElement("template");
template.innerHTML = `${html}<style>${css}</style>`;

export class AutoCompleteComponent extends HTMLElement {
    constructor() {
        super();  
        this.attachShadow({ mode: 'open' });
        this.refreshSearchResultItems = this.refreshSearchResultItems.bind(this);   
    }

    public apiKey: string;

    private get _searchBoxHTMLElement() { return this.shadowRoot.querySelector("ce-search-box"); }

    private get _searchResultItemsElement() { return this.shadowRoot.querySelector("ce-search-result-items"); }

    static get observedAttributes() { return ["api-key"]; }
    
    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        
        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'autocomplete');

        this._setEventListeners();
        this._searchBoxHTMLElement.setAttribute("api-key", this.apiKey);
    }
    
    private _setEventListeners() {
        this._searchBoxHTMLElement.addEventListener(constants.SEARCH_RESULT_ITEMS_FETCHED, this.refreshSearchResultItems);
    }

    public refreshSearchResultItems(e: any) {        
        this._searchResultItemsElement.setAttribute("search-result-items", JSON.stringify(e.detail.searchResultItems));
    }

    disconnectedCallback() {
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