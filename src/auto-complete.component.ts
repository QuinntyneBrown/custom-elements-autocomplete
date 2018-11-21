import { render, TemplateResult, html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { Subscription, fromEvent } from "rxjs";
import { switchMap, tap, debounceTime } from "rxjs/operators";
import { ProductService } from "./product.service";
import { SearchResultItemsComponent } from "./search-result-items.component";

const styles = unsafeHTML(`<style>${require("./auto-complete.component.css")}</style>`);

export class AutoCompleteComponent extends HTMLElement {

  private _productService: ProductService = new ProductService();

  private get _inputHTMLElement() { return this.shadowRoot.querySelector("input"); }

  private get _searchResultItemsElement() { return this.shadowRoot.querySelector("ce-search-result-items") as SearchResultItemsComponent; }
  
  private _subscription: Subscription;
  
  public get template(): TemplateResult {
    return html`
      ${styles}
      <ce-form-field>
        <input type="text" placeholder="Search For..."/>
      </ce-form-field>
      <ce-search-result-items></ce-search-result-items>
    `;
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' });

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'autocomplete');

    await Promise.all([
      customElements.whenDefined('ce-form-field'),
      customElements.whenDefined('ce-search-result-items')
    ]);

    render(this.template, this.shadowRoot);

    this._subscription = fromEvent(this._inputHTMLElement, "keyup")
      .pipe(
        debounceTime(200),
        switchMap(() => this._productService.search(this._inputHTMLElement.value)),
        tap(searchResultItems => {
          this._searchResultItemsElement.searchResultItems = searchResultItems;
        })
      )
      .subscribe();
  }

  disconnectedCallback() { this._subscription.unsubscribe(); }   
}

customElements.define(`ce-auto-complete`, AutoCompleteComponent);
