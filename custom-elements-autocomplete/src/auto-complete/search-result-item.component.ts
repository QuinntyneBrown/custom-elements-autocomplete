const htmlTemplate = require("./search-result-item.component.html");
const styles = require("./search-result-item.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchResultItemComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
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
        this.removeEventListener("click", this.fn);
    }

    private _bind() {
        this.headingHTMLElement.innerHTML = this.searchResultItem.name;
        this.thumbnailHTMLElement.src = this.searchResultItem.image_thumb_url == null ? this.defultImageUrl : this.searchResultItem.image_thumb_url;
        this.searchResultItemDetailsHTMLElement.setAttribute("search-result-item",JSON.stringify(this.searchResultItem));
    }

    public get defultImageUrl() { return "http://www.lcbo.com/content/dam/lcbo/products/generic.jpg/jcr:content/renditions/cq5dam.thumbnail.319.319.png"; }

    private _setEventListeners() {
        this.addEventListener("click", this.fn);
    }
    
    public set activeSearchResultItem(value: SearchResultItem) {        
        if (this.searchResultItem.id == value.id && !this.classList.contains("active")) {         
            this.classList.add("active");
        } else {
            this.classList.remove("active")
        }
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