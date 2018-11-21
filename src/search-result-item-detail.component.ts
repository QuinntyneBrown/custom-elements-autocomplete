import { render, TemplateResult, html } from "lit-html";
import { unsafeHTML } from "lit-html/directives/unsafe-html";
import { SearchResultItem } from "./product.service";

const styles = unsafeHTML(`<style>${require("./search-result-item-detail.component.css")}</style>`);

export class SearchResultItemDetailComponent extends HTMLElement {

  public searchResultItem: SearchResultItem;

  public get template():TemplateResult {
    return html`
      ${styles}
      <img src="${this.searchResultItem.image_url == null ? this.defultImageUrl : this.searchResultItem.image_url}" />
      <div>
        <h3>${this.searchResultItem.primary_category}</h3>
        <h2>${this.searchResultItem.name}, ${this.searchResultItem.volume_in_milliliters} ml</h2>
        <h3>$${(this.searchResultItem.price_in_cents / 100).toFixed(2)}</h3>
        <p>${this.searchResultItem.tasting_note}</p>
      </div>
    `;
  }

  connectedCallback() {
    this.attachShadow({ mode: 'open' });

    if (!this.hasAttribute('role'))
      this.setAttribute('role', 'searchresultitemdetail');

    render(this.template, this.shadowRoot);    
  }

  public get defultImageUrl() { return "http://www.lcbo.com/content/dam/lcbo/products/generic.jpg/jcr:content/renditions/cq5dam.web.1280.1280.jpeg"; }
}

customElements.define(`ce-search-result-item-detail`,SearchResultItemDetailComponent);
