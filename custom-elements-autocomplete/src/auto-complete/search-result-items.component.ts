const htmlTemplate = require("./seatch-result-items.component.html");
const styles = require("./seatch-result-items.component.css")

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class SearchResultItemsComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes () {
        return [];
    }

    connectedCallback() {
        this.shadowRoot.appendChild(document.importNode(template.content, true));
        this._bind();
        this._setEventListeners();
    }

    private async _bind() {

    }

    private _setEventListeners() {

    }

    disconnectedCallback() {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }
}

customElements.define(`ce-search-result-items`,SearchResultItemsComponent);