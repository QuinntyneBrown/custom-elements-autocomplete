/// <reference path="auto-complete.d.ts" />

export const constants = {
    SEARCH_RESULT_ITEMS_FETCHED: "SEARCH_RESULT_ITEMS_FETCHED",
    SEARCH_RESULT_ITEM_CLICKED: "SEARCH_RESULT_ITEM_CLICKED",
}

export class SearchResultItemsFetched extends CustomEvent {
    constructor(searchResultItems: Array<SearchResultItem>) {
        super(constants.SEARCH_RESULT_ITEMS_FETCHED, {
            detail: {
                searchResultItems
            },
            bubbles: true,
            composed: true,
            cancelable: false,
            
        } as any);
    }
}

export class SearchResultItemClicked extends CustomEvent {
    constructor(searchResultItem: SearchResultItem) {
        super(constants.SEARCH_RESULT_ITEM_CLICKED, {
            detail: { searchResultItem },
            bubbles: true,
            composed: true,
            cancelable: false,
        } as any);
    }
}