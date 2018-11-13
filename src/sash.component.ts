import { html, TemplateResult, render } from "lit-html";
import { repeat } from "lit-html/directives/repeat";
import { unsafeHTML } from "lit-html/directives/unsafe-html";

const styles = unsafeHTML(`<style>${require("./sash.component.css")}<style>`);


export class StandardMouseEvent {

}

export class SashComponent extends HTMLElement {
    constructor() {
        super();

        this.onClick = this.onClick.bind(this);
        this.onMouseDown = this.onMouseDown.bind(this);
    }

    static get observedAttributes () {
        return [];
    }

    connectedCallback() {     

        if(!this.shadowRoot) this.attachShadow({ mode: 'open' });
        
		render(this.template, this.shadowRoot);

        if (!this.hasAttribute('role'))
            this.setAttribute('role', 'sash');

        this._bind();
        this._setEventListeners();
    }

    get template(): TemplateResult {
        return html`
            ${styles}
            <slot></slot>
        `;
    }

    private async _bind() {

    }

    private _setEventListeners() {
        this.addEventListener("mousedown", this.onMouseDown);
    }

    public onClick(e) {
        alert(this.offsetLeft);
        alert(e.clientX);
    }

    disconnectedCallback() {

    }

    attributeChangedCallback (name, oldValue, newValue) {
        switch (name) {
            default:
                break;
        }
    }

    private onMouseDown(e: MouseEvent): void {
        e.stopPropagation();

        this.classList.add("active");

        this.dispatchEvent(new CustomEvent("[]", {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail: {  }
        } as CustomEventInit))
    }
}

customElements.define(`ce-sash`,SashComponent);
