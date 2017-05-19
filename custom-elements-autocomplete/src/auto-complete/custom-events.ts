/// <reference path="auto-complete.d.ts" />

export const AppConstants = {
    PRODUCT_ITEM_CLICK: "PRODUCT_ITEM_CLICK",
    SHOW_PRODUCT_DETAIL: "SHOW_PRODUCT_DETAIL"
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

export class ShowProductDetail extends CustomEvent {
    constructor(product: Product) {
        super(AppConstants.SHOW_PRODUCT_DETAIL, {
            detail: {
                product
            },
            bubbles: true
        });
    }
}