import { constants, ProductItemClick, ShowProductDetail } from "./custom-events";
const htmlTemplate = require("./auto-complete.component.html");
const styles = require("./auto-complete.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class AutoCompleteComponent extends HTMLElement {
    constructor() {
        super();  
        this.attachShadow({ mode: 'open' });
        this.updateProductDetail = this.updateProductDetail.bind(this);      
    }

    public apiKey: string;

    private get _searchBoxHTMLElement() { return this.shadowRoot.querySelector("ce-search-box"); }
    
    static get observedAttributes() {
        return [
            "api-key"
        ];
    }
    
    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._setEventListeners();
        this._searchBoxHTMLElement.setAttribute("api-key", this.apiKey);
    }
    
    private _setEventListeners() {
        this._searchBoxHTMLElement.addEventListener(constants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    public updateProductDetail(e: ProductItemClick) {   
        (this._searchBoxHTMLElement as any).showProduct = e.detail.product;
    }

    disconnectedCallback() {
        this._searchBoxHTMLElement.removeEventListener(constants.PRODUCT_ITEM_CLICK, this.updateProductDetail);
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "api-key":
                this.apiKey = newValue;
                break;
        }
    }    
}

customElements.define(`ce-auto-complete`, AutoCompleteComponent);
