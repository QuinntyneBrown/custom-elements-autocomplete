import { ProductItemClick, constants } from "./custom-events";
import { DomHandler } from "../utilities";

export class ProductItemComponent extends HTMLElement {
    constructor(private _domHandler: DomHandler = DomHandler.instance) {
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
            this._domHandler.addClass(this, "active");
        } else {
            this._domHandler.removeClass(this, "active");
        }
    }

    private dispatchProductItemClickEvent() {        
        this.dispatchEvent(new ProductItemClick(this.product));
    }

    public product: Product;
    
}

customElements.define(`ce-product-item`,ProductItemComponent);
