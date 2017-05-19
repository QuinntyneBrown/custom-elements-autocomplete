import { AppConstants, ProductItemClick, ShowProductDetail } from "./custom-events";

export class AppComponent extends HTMLElement {
    constructor() {
        super();  
        this.updateProductDetail = this.updateProductDetail.bind(this);      
    }

    public apiKey: string;

    private get _searchBoxHTMLElement() { return this.querySelector("ce-search-box"); }
    
    private get _productDetailHTMLElement() { return this.querySelector("ce-product-detail"); }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }
    
    connectedCallback() {
        this.innerHTML = require("./app.component.html");;
        this._setEventListeners();
        this._searchBoxHTMLElement.setAttribute("api-key", this.apiKey);
    }
    
    private _setEventListeners() {
        this._searchBoxHTMLElement.addEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    public updateProductDetail(e: ProductItemClick) {   
        (this._searchBoxHTMLElement as any).showProduct = e.detail.product;
    }

    disconnectedCallback() {
        this._searchBoxHTMLElement.removeEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }    
}

customElements.define(`ce-auto-complete`, AppComponent);
