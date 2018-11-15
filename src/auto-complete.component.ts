import { render, TemplateResult, html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { Subscription, fromEvent } from "rxjs";
import { switchMap, tap, debounceTime } from "rxjs/operators";
import { ProductService, SearchResultItem } from "./product.service";
import { SearchBoxComponent } from "./search-box.component";

const styles = unsafeHTML(`<style>${require("./auto-complete.component.css")}</style>`);

export class AutoCompleteComponent extends HTMLElement {

  private _productService: ProductService = new ProductService();

  private get _searchBoxHTMLElement() { return <SearchBoxComponent>this.shadowRoot.querySelector("ce-search-box"); }

  private get _searchResultItemsElement() { return this.shadowRoot.querySelector("ce-search-result-items"); }
  
  private _subscription: Subscription;
  
  public get template(): TemplateResult {
    return html`
      ${styles}
      <ce-search-box></ce-search-box>
      <ce-search-result-items></ce-search-result-items>
    `;
  }

  async connectedCallback() {
    this.attachShadow({ mode: 'open' });

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'autocomplete');

    await Promise.all([
      customElements.whenDefined('ce-search-box'),
      customElements.whenDefined('ce-search-result-items'),
    ]);

    render(this.template, this.shadowRoot);

    this._setEventListeners();
  }

  private _setEventListeners() {
    this._subscription = fromEvent(this._searchBoxHTMLElement, "keyup")
      .pipe(
        debounceTime(200),
        switchMap(() => this._productService.search(this._searchBoxHTMLElement.value)),
        tap(searchResultItems => this.refreshSearchResultItems(searchResultItems))
      )
      .subscribe();    
  }

  private refreshSearchResultItems(searchResultItems: SearchResultItem[]) {    
    this._searchResultItemsElement.setAttribute("search-result-items", JSON.stringify(searchResultItems));
  }

  disconnectedCallback() { this._subscription.unsubscribe(); }   
}

customElements.define(`ce-auto-complete`, AutoCompleteComponent);
