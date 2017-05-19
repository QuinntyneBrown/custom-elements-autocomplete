import { ProductItemClick, AppConstants } from "./custom-events";

export class ProductItemComponent extends HTMLElement {
    constructor() {
        super();
        this.dispatchProductItemClickEvent = this.dispatchProductItemClickEvent.bind(this);        
    }

    private get headingHTMLElement() { return this.querySelector("h2"); }

    private get thumbnailHTMLElement() { return this.querySelector("img"); }

    private get productDetailsHTMLElement() { return this.querySelector("ce-product-detail"); }

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
        this.productDetailsHTMLElement.setAttribute("product",JSON.stringify(this.product));
    }

    private _setEventListeners() {
        this.addEventListener("click", this.dispatchProductItemClickEvent);
    }
    
    public set showProduct(value:Product) {
        if (this.product.id == value.id) {
            this.classList.add("active")
        } else {
            this.classList.remove("active");
        }
    }

    private dispatchProductItemClickEvent() {        
        this.dispatchEvent(new ProductItemClick(this.product));
    }

    public product: Product;
    
}

customElements.define(`ce-product-item`,ProductItemComponent);
