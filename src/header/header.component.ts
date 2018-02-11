const html = require("./header.component.html");
const css = require("./header.component.css");

const template = document.createElement("template");
template.innerHTML = `<style>${css}</style>${html}`;

export class HeaderComponent extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(document.importNode(template.content, true));        
    }    
}

customElements.define(`ce-header`,HeaderComponent);