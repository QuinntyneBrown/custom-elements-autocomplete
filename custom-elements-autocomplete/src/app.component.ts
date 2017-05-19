import { AppConstants, ProductItemClick } from "./custom-events";

export class AppComponent extends HTMLElement {
    constructor() {
        super();  

        this.updateProductDetail = this.updateProductDetail.bind(this);      
    }

    private get _autoCompleteHTMLElement() { return this.querySelector("ce-autocomplete"); }
    
    private get _productDetailHTMLElement() { return this.querySelector("ce-product-detail"); }

    static get observedAttributes() {
        return [
            "api-key"
        ];
    }

    private _apiKey: string;

    connectedCallback() {
        this.innerHTML = require("./app.component.html");;
        this._setEventListeners();
    }
    

    private _setEventListeners() {
        this._autoCompleteHTMLElement.addEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    public updateProductDetail(e: ProductItemClick) {        
        this._productDetailHTMLElement.setAttribute("product", JSON.stringify(e.detail.product));
    }

    disconnectedCallback() {
        this._autoCompleteHTMLElement.removeEventListener(AppConstants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                break;
        }
    }    
}

customElements.define(`ce-app`, AppComponent);
