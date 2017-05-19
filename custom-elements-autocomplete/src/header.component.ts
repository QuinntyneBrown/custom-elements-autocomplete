export class HeaderComponent extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = require("./header.component.html");
    }
}

customElements.define(`ce-header`,HeaderComponent);
