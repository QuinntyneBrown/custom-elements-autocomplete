const htmlTemplate = require("./header.component.html");
const styles = require("./header.component.scss");

const template = document.createElement("template");
template.innerHTML = `${htmlTemplate}<style>${styles}</style>`;

export class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));        
    }    
}

customElements.define(`ce-header`,HeaderComponent);
