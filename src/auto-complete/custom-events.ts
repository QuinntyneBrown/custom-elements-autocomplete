export const constants = {
    SEARCH_RESULT_ITEMS_FETCHED: "[Search Result] ITEMS FETCHED",
    SEARCH_RESULT_ITEM_CLICKED: "[Search Result] ITEM CLICKED",
};

export class SearchResultItemsFetched extends CustomEvent {
    constructor(searchResultItems: Array<SearchResultItem>) {
        super(constants.SEARCH_RESULT_ITEMS_FETCHED, {
            detail: { searchResultItems },
            bubbles: true,
            composed: true,
            cancelable: false,            
        } as CustomEventInit);
    }
}

export class SearchResultItemClicked extends CustomEvent {
    constructor(searchResultItem: SearchResultItem) {
        super(constants.SEARCH_RESULT_ITEM_CLICKED, {
            detail: { searchResultItem },
            bubbles: true,
            composed: true,
            cancelable: false,
        } as CustomEventInit);
    }
}