/// <reference path="auto-complete.d.ts" />

export const constants = {
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