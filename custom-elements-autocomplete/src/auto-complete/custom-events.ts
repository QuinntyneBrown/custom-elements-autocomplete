/// <reference path="auto-complete.d.ts" />

export const constants = {
    SEARCH_RESULT_ITEM_CLICK: "SEARCH_RESULT_ITEM_CLICK",
    SHOW_SEARCH_RESULT_ITEM_DETAIL: "SHOW_SEARCH_RESULT_ITEM_DETAIL",
    SEARCH_RESULT_ITEMS_FETCHED: "SEARCH_RESULT_ITEMS_FETCHED"
}

export class SearchResultItemsFetched extends CustomEvent {
    constructor(searchResultItems: Array<SearchResultItem>) {
        super(constants.SEARCH_RESULT_ITEMS_FETCHED, {
            detail: {
                searchResultItems
            },
            bubbles: true,
            cancelable: false
        });
    }
}

export class SearchResultItemClick extends CustomEvent {
    constructor(searchResultItem:SearchResultItem) {
        super(constants.SEARCH_RESULT_ITEM_CLICK, {
            detail: {
                searchResultItem
            },
            bubbles: true,
            cancelable:false
        });
    }
}

export class ShowSearchResultItemDetail extends CustomEvent {
    constructor(searchResultItem: SearchResultItem) {
        super(constants.SHOW_SEARCH_RESULT_ITEM_DETAIL, {
            detail: {
                searchResultItem
            },
            bubbles: true,
            cancelable: false
        });
    }
}