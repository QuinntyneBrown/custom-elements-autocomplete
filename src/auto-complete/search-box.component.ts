/// <reference path="auto-complete.d.ts" />
import {constants} from "./custom-events";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
const html = require("./search-box.component.html");
const css = require("./search-box.component.css")

const template = document.createElement("template");
template.innerHTML = `<style>${css}</style>${html}`;

export class SearchBoxComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchbox');

        this._setEventListeners();
    }

    private _subscription: Subscription;

    private _setEventListeners() {
        this._subscription = Observable
            .fromEvent(this._inputHTMLElement, "keyup")
            .debounceTime(200)
            .switchMap(async () => {
                const response = await fetch(this._url);
                const json = await response.json();
                return json.result;
            })
            .do((x) => this.dispatchEvent(new CustomEvent(constants.SEARCH_RESULT_ITEMS_FETCHED, {
                bubbles: true,
                composed: true,
                cancelable: false,
                detail: { searchResultItems: x }
            } as CustomEventInit)))
            .subscribe();
    }

    disconnectedCallback() {
        this._subscription.unsubscribe();
    }

    private _timeoutId: any;

    private get _url(): string { return `http://lcboapi.com/products?access_key=${this.apiKey}&q=${this._inputHTMLElement.value}`; }

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