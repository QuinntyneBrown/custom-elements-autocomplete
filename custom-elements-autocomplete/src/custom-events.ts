/// <reference path="app.d.ts" />

export const AppConstants = {
    PRODUCT_ITEM_CLICK: "PRODUCT_ITEM_CLICK"
}

export class ProductItemClick extends CustomEvent {
    constructor(product:Product) {
        super(AppConstants.PRODUCT_ITEM_CLICK, {
            detail: {
                product
            },
            bubbles:true
        });
    }
}