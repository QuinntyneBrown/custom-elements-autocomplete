export class AppComponent extends HTMLElement {
    constructor() {
        super();        
    }

    static get observedAttributes () {
        return [
            "api-key"
        ];
    }

    private _apiKey: string;

    connectedCallback() {
        this.innerHTML = require("./app.component.html");;
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
            case "api-key":
                break;
        }
    }    
}

customElements.define(`ce-app`, AppComponent);
