import { AppConstants, ProductItemClick, ShowProductDetail } from "./custom-events";

export class AppComponent extends HTMLElement {
    constructor() {
        super();  
        this.updateProductDetail = this.updateProductDetail.bind(this);      
    }

    public apiKey: string;

    private get _autoCompleteHTMLElement() { return this.querySelector("ce-autocomplete"); }
    
    private get _productDetailHTMLElement() { return this.querySelector("ce-product-detail"); }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }
    
    connectedCallback() {
        this.innerHTML = require("./app.component.html");;
        this._setEventListeners();
        this._autoCompleteHTMLElement.setAttribute("api-key", this.apiKey);
    }
    

    private _setEventListeners() {
        this._autoCompleteHTMLElement.addEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    public updateProductDetail(e: ProductItemClick) {   
        (this._autoCompleteHTMLElement as any).showProduct = e.detail.product;
    }

    disconnectedCallback() {
        this._autoCompleteHTMLElement.removeEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }    
}

customElements.define(`ce-app`, AppComponent);
