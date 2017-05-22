import { SearchResultItemClick, constants } from "./custom-events";
import { DomHandler } from "../utilities";

const htmlTemplate = require("./search-result-item.component.html");
const styles = require("./search-result-item.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class ProductItemComponent extends HTMLElement {
    constructor(private _domHandler: DomHandler = DomHandler.instance) {
        super();
        this.attachShadow({ mode: 'open' });
        this.dispatchProductItemClickEvent = this.dispatchProductItemClickEvent.bind(this);        
    }

    private get headingHTMLElement() { return this.querySelector("h2"); }

    private get thumbnailHTMLElement() { return this.querySelector("img"); }

    private get productDetailsHTMLElement() { return this.querySelector("ce-product-detail"); }

    connectedCallback() {        
        this.shadowRoot.appendChild(document.importNode(template.content, true));
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
    
    public set showProduct(value:SearchResultItem) {
        if (this.product.id == value.id) {            
            this._domHandler.addClass(this, "active");
        } else {
            this._domHandler.removeClass(this, "active");
        }
    }

    private dispatchProductItemClickEvent() {        
        this.dispatchEvent(new SearchResultItemClick(this.product));
    }

    public product: SearchResultItem;
    
}

customElements.define(`ce-product-item`,ProductItemComponent);
