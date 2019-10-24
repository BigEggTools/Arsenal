import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { RequestContext } from '../../services/request-context.service';
import { FilterCriterion, SearchCriterion, SortCriterion } from '../../utils/queryUtils';

export const PaginationSettings = {
    defaultViewSize: 50, //Temporary, will fetch from user preference eventually
    maxViewSize: 50,
    pageRange: 5,
    viewSizes: [25, 50]
};

@Injectable()
export class PaginationService {

    private _pageSize: number = PaginationSettings.defaultViewSize;
    private _page: number = 1;
    private _sortBy: SortCriterion;
    private _filterBy: Array<FilterCriterion> = [];
    private _searchBy: SearchCriterion;
    private _overrideViewSizes = [];

    constructor(private requestContext: RequestContext) {
    }

    public set page(value: number) {
        if (!isNaN(value) && value > 0) {
            this._page = value;
        }
    }

    public get page() {
        return this._page;
    }

    public set pageSize(value: number) {
        if (!isNaN(value) && this.viewSizes.indexOf(value) > -1) {
            this._pageSize = value;
        }
    }

    public get pageSize() {
        return this._pageSize;
    }

    public get viewSizes() {
        if (this._overrideViewSizes && this._overrideViewSizes.length) {
            return this._overrideViewSizes;
        }
        let viewSizeArr = PaginationSettings.viewSizes.slice();
        if (this.requestContext.IsExtendedViewSize) {
            viewSizeArr.unshift(5);
        }
        return viewSizeArr;
    }

    public set viewSizes(sizes: number[]) {
        this._overrideViewSizes = sizes;
    }

    public get filters() {
        return this._filterBy;
    }

    public get searchInputs() {
        return this._searchBy;
    }

    public get sort() {
        return this._sortBy;
    }

    public resetFilters() {
        this._filterBy = [];
    }

    // Adds a filter to the filter list and returns a boolean indicating whether a change occurred.
    public setFilter(filter: FilterCriterion): boolean {

        let index = this._filterBy.findIndex(item => item.key == filter.key);
        if (index > -1 && this._filterBy[index].value !== filter.value) {
            if (filter.value === 'all') {
                this._filterBy.splice(index, 1);
            } else {
                this._filterBy[index] = filter;
            }
            return true;
        } else if (index === -1 && filter.value !== 'all') {
            this._filterBy.push(filter);
            return true;
        }
        return false;
    }

    // Simple search supports only one search input
    public setSearch(search: SearchCriterion): boolean {
        this._searchBy = search;
        return true;
    }

    // Sets a sort method for pages and returns a boolean indicating whether the sort was changed.
    // Right now we only handle a single sort
    public setSort(sort: SortCriterion): boolean {
        if (!this._sortBy) {
            this._sortBy = sort;
            return true;
        }

        if (sort && (this._sortBy.key !== sort.key || this._sortBy.order !== sort.order)) {
            this._sortBy = sort;
            return true;
        }

        return false;
    }

    public get paginationParameters() {
        return {
            pageSize: this._pageSize,
            page: this._page,
            sortBy: this._sortBy,
            filterBy: this._filterBy.length > 0 ? this._filterBy : undefined,
            searchBy: this._searchBy
        }
    }

    public updatePaginationParameters(params: any) {
        if (params.page != null) this._page = params.page;
        if (params.pageSize != null) this._pageSize = params.pageSize;
        if (params.sortBy != null) this._sortBy = params.sortBy;
        if (params.filterBy != null) this._filterBy = params.filterBy;
        if (params.searchBy != null) this._searchBy = params.searchBy;
    }

    public set paginationParameters(params: any) {
        this._page = params.page || 1;
        this._pageSize = params.pageSize;
        this._sortBy = params.sortBy;
        this._filterBy = params.filterBy || [];
        this._searchBy = params.searchBy;
    }

    public resetPaginationParameters() {
        this._pageSize = PaginationSettings.defaultViewSize;
        this._page = 1;
        this._sortBy = undefined;
        this._filterBy = [];
        this._searchBy = undefined;
    }

    // Optimizing for single-page in-place filter/sort. We need to test if a page contains a partial or full list.
    // To be conservative, we will assume that the resulting page list is not complete if the current query
    // contains a filter criteria
    public isResultFiltered(): boolean {
        return this._filterBy && this._filterBy.length > 0;
    }
}
