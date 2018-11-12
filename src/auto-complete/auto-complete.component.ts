import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/lib/repeat";
import { unsafeHTML } from "../../node_modules/lit-html/lib/unsafe-html.js";
import { searchResultItemsFetched } from "./custom-events";

const styles = unsafeHTML(`<style>${require("./auto-complete.component.css")}</style>`);

export class AutoCompleteComponent extends HTMLElement {
    constructor() {
        super();          
        this.refreshSearchResultItems = this.refreshSearchResultItems.bind(this);   
    }

    public apiKey: string;

    private get _searchBoxHTMLElement() { return this.shadowRoot.querySelector("ce-search-box"); }

    private get _searchResultItemsElement() { return this.shadowRoot.querySelector("ce-search-result-items"); }

    static get observedAttributes() { return ["api-key"]; }

    public get template(): TemplateResult {
        return html`
            ${styles}
            <ce-search-box></ce-search-box>
            <ce-search-result-items></ce-search-result-items>
        `;
    }
    connectedCallback() {     
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'autocomplete');

        render(this.template, this.shadowRoot);

        this._setEventListeners();
        this._searchBoxHTMLElement.setAttribute("api-key", this.apiKey);
    }
    
    private _setEventListeners() {
        this._searchBoxHTMLElement.addEventListener(searchResultItemsFetched, this.refreshSearchResultItems);
    }

    public refreshSearchResultItems(e: any) {        
        this._searchResultItemsElement.setAttribute("search-result-items", JSON.stringify(e.detail.searchResultItems));
    }

    disconnectedCallback() {
        this._searchBoxHTMLElement.removeEventListener(searchResultItemsFetched, this.refreshSearchResultItems);
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