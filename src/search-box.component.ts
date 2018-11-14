import { Subscription, fromEvent } from "rxjs";
import { switchMap, tap, debounceTime } from "rxjs/operators";
import { render, TemplateResult, html } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { searchResultItemsFetched } from "./constants";
import { ProductService } from "./product.service";

const styles = unsafeHTML(`<style>${require("./search-box.component.css")}</style>`);

export class SearchBoxComponent extends HTMLElement {

  protected readonly _productService: ProductService = new ProductService();

  public get template():TemplateResult {
    return html`
      ${styles}
      <input type="text" placeholder="Search For..." />
    `;
  }

  private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'searchbox');

    render(this.template, this.shadowRoot);

    this._setEventListeners();
  }

  private _subscription: Subscription;

  private _setEventListeners() {
    this._subscription = fromEvent(this._inputHTMLElement, "keyup")
      .pipe(
        debounceTime(200),
        switchMap(async () => this._productService.search(this._inputHTMLElement.value)),
        tap((x) => this.dispatchEvent(new CustomEvent(searchResultItemsFetched, {
          bubbles: true,
          composed: true,
          cancelable: false,
          detail: { searchResultItems: x }
        } as CustomEventInit)))
      )
      .subscribe();
  }

  disconnectedCallback() {
    this._subscription.unsubscribe();
  } 
}

customElements.define(`ce-search-box`,SearchBoxComponent);
