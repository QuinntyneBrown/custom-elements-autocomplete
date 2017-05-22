import { SearchResultItemClick, constants } from "./custom-events";
import { DomHandler } from "../utilities";

const htmlTemplate = require("./search-result-item.component.html");
const styles = require("./search-result-item.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchResultItemComponent extends HTMLElement {
    constructor(private _domHandler: DomHandler = DomHandler.instance) {
        super();
        this.attachShadow({ mode: 'open' });
        this.dispatchSearchResultItemClickEvent = this.dispatchSearchResultItemClickEvent.bind(this);        
    }

    static get observedAttributes() {
        return [
            "search-result-item"
        ];
    }

    private get headingHTMLElement() { return this.shadowRoot.querySelector("h2"); }

    private get thumbnailHTMLElement() { return this.shadowRoot.querySelector("img"); }

    private get searchResultItemDetailsHTMLElement() { return this.shadowRoot.querySelector("ce-search-result-item-detail"); }

    connectedCallback() {        
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._bind();
        this._setEventListeners();
    }

    disconnectedCallback() {
        this.removeEventListener("click", this.dispatchSearchResultItemClickEvent);
    }

    private _bind() {
        this.headingHTMLElement.innerHTML = this.searchResultItem.name;
        this.thumbnailHTMLElement.src = this.searchResultItem.image_thumb_url;
        this.searchResultItemDetailsHTMLElement.setAttribute("search-result-item",JSON.stringify(this.searchResultItem));
    }

    private _setEventListeners() {
        this.addEventListener("click", this.dispatchSearchResultItemClickEvent);
    }
    
    public set activeSearchResultItem(value: SearchResultItem) {        
        if (this.searchResultItem.id == value.id) {         
            this.style.height = "350px";               
        } else {
            this.style.height = "110px";
        }
    }

    private dispatchSearchResultItemClickEvent() {                
        this.fn();
        this.dispatchEvent(new CustomEvent("random", { bubbles: true }));
    }

    public fn: { ():void };

    public searchResultItem: SearchResultItem;

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case "search-result-item":
                this.searchResultItem = JSON.parse(newValue);

                if (this.parentNode)
                    this._bind();
                break;
        }
    }
    
}

customElements.define(`ce-search-result-item`,SearchResultItemComponent);
