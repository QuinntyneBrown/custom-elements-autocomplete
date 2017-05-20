export class DomHandler {

    private static _instance: DomHandler;

    public static get instance() {
        this._instance = this._instance || new DomHandler();
        return this._instance;
    }

    public addClass(element:HTMLElement, cssClass:string) {
        if (element.classList.contains(cssClass))
            return;

        element.classList.add(cssClass);
    }

    public removeClass(element: HTMLElement, cssClass: string) {
        element.classList.remove(cssClass);
    }
}