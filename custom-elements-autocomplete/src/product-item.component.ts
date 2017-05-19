import { ProductItemClick } from "./custom-events";

export class ProductItemComponent extends HTMLElement {
    constructor() {
        super();
        this.dispatchProductItemClickEvent = this.dispatchProductItemClickEvent.bind(this);
    }

    private get headingHTMLElement() { return this.querySelector("h2"); }

    private get thumbnailHTMLElement() { return this.querySelector("img"); }
    
    connectedCallback() {        
        this.innerHTML = require("./product-item.component.html");
        this._bind();
        this._setEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.dispatchProductItemClickEvent);
    }

    private _bind() {
        this.headingHTMLElement.innerHTML = this.product.name;
        this.thumbnailHTMLElement.src = this.product.image_thumb_url;
    }

    private _setEventListeners() {
        this.addEventListener("click", this.dispatchProductItemClickEvent);
    }

    private dispatchProductItemClickEvent() {
        this.dispatchEvent(new ProductItemClick(this.product));
    }

    public product: Product;
    
}

customElements.define(`ce-product-item`,ProductItemComponent);
