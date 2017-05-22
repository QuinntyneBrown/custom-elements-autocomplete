import { constants, SearchResultItemClick, ShowSearchResultItemDetail } from "./custom-events";

const htmlTemplate = require("./search-result-items.component.html");
const styles = require("./search-result-items.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchResultItemsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    public searchResultItems: Array<any> = [];

    static get observedAttributes () {
        return [
            "search-result-items"
        ];
    }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));        
        this._bind();        
    }

    private async _bind() {
        if (this.searchResultItems.length > 1) {
            this.shadowRoot.innerHTML = "";
            for (let i = 0; i < this.searchResultItems.length; i++) {
                let el = document.createElement("ce-search-result-item") as any;
                el.fn = () => this.showSearchResultItemDetail(el);
                el.setAttribute("search-result-item", JSON.stringify(this.searchResultItems[i]));
                this.shadowRoot.appendChild(el);
            }
        } else {
            this.shadowRoot.innerHTML = `<p>No Results...</p>`;
        }
    }


    public showSearchResultItemDetail(el: { searchResultItem: SearchResultItem}) {
        let searchResultItemElements = this.shadowRoot.querySelectorAll("ce-search-result-item");

        for (let i = 0; i < searchResultItemElements.length; i++) {
            (searchResultItemElements[i] as any).activeSearchResultItem = el.searchResultItem;
        }
    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            case "search-result-items":
                this.searchResultItems = JSON.parse(newValue);

                if (this.parentNode)
                    this._bind();
                break;
        }
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);