/// <reference path="auto-complete.d.ts" />
import { SearchResultItemsFetched } from "./custom-events";

const html = require("./search-box.component.html");
const css = require("./search-box.component.scss")

const template = document.createElement("template");
template.innerHTML = `<style>${css}</style>${html}`;

export class SearchBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.fetchResults = this.fetchResults.bind(this);
    }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._setEventListeners();
    }
    
    private _setEventListeners() { this._inputHTMLElement.addEventListener("keyup", this.fetchResults); }

    disconnectedCallback() { this._inputHTMLElement.removeEventListener("keyup", this.fetchResults); }

    private _timeoutId: any;

    private fetchResults() {
        if (this._timeoutId)
            clearTimeout(this._timeoutId);

        this._timeoutId = setTimeout(async () => {
            const response = await fetch(`http://lcboapi.com/products?access_key=${this.apiKey}&q=${this._inputHTMLElement.value}`);
            const searchResultItems = (await response.json() as SearchResponseJSON).result;
            this.dispatchEvent(new SearchResultItemsFetched(searchResultItems));
        }, 300);        
    }      

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }  

    public apiKey: string;
}

customElements.define(`ce-search-box`,SearchBoxComponent);