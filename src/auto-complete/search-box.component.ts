/// <reference path="auto-complete.d.ts" />
import { SearchResultItemsFetched } from "./custom-events";
import { Observable, Subscription } from "rxjs";

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

    private _subscription: Subscription;

    private _setEventListeners() {
        this._subscription = Observable
            .fromEvent(this._inputHTMLElement, "keyup")
            .switchMap(this.fetchResults)
            .subscribe();
    }

    disconnectedCallback() {
        this._subscription.unsubscribe();
    }

    private _timeoutId: any;

    private async fetchResults() {
        return new Promise(async (resolve) => {
            const response = await fetch(`http://lcboapi.com/products?access_key=${this.apiKey}&q=${this._inputHTMLElement.value}`);
            const searchResultItems = (await response.json() as SearchResponseJSON).result;
            this.dispatchEvent(new SearchResultItemsFetched(searchResultItems)); 
            resolve();
        })
    
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