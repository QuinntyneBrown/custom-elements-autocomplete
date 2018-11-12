import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/lib/repeat";
import { unsafeHTML } from "../../node_modules/lit-html/lib/unsafe-html.js";
import { searchResultItemsFetched } from "./custom-events";

const styles = unsafeHTML(`<style>${require("./search-box.component.css")}</style>`);

export class SearchBoxComponent extends HTMLElement {
    constructor() {
        super();
    }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    public get template():TemplateResult {
        return html`
            ${styles}
            <input type="text" placeholder="Search For..." />
        `;
    }
    private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

    connectedCallback() {
        if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'searchbox');

        render(this.template, this.shadowRoot);

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
            .do((x) => this.dispatchEvent(new CustomEvent(searchResultItemsFetched, {
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