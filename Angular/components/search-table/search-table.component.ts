import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs/Rx';

import { ColumnMetadata, RowCanBeSelect, RowSelectionStatus } from '../../../core/components/custom-table';
import { PaginationParameters } from '../../../core/components/pagination';
import { ThumbnailView } from '../thumbnail-view';

import { IColumn } from './models/column';
import { IInputData } from './models/data'
import { IFilter } from './models/filter';
import { SelectType } from './models/select-type';
import { ViewMode } from './models/view-mode';

import { ColumnUtils } from './utils/columnUtils';

@Component({
    selector: 'search-table',
    templateUrl: './search-table.component.html'
})
export class SearchTableComponent implements OnInit, OnChanges {
    @Input() title: string;
    @Input() description: string;
    @Input() autoSearch: boolean = false;
    @Input() columns: IColumn[];
    @Input() thumbnailView: ThumbnailView;
    @Input() filters: IFilter<any>[];
    @Input() selectType: SelectType;
    @Input() resultObservable: Observable<IInputData>;
    @Input() defaultViewMode: ViewMode;
    @Input() isRowSelectable: (data: any) => RowSelectionStatus;
    @Input() pageSizeChoices: Array<number> = this.paginationParameters.pageSizeChoices;
    @Input() defaultPageSize: number = this.paginationParameters.pageSizeChoices[0];
    @Input() hideHeader: boolean = false;
    @Input() hidePagination: boolean = false;
    @Input() manualCriteria: any;

    /**
     * Emits the search action
     *
     * @type {EventEmitter<Array<object>>}
     * @memberOf Search Table Component
     */
    @Output() search: EventEmitter<object> = new EventEmitter<object>();
    @Output() selectedChange: EventEmitter<Array<object>> = new EventEmitter<Array<object>>();

    private columnMetaData: ColumnMetadata[];
    public loading: boolean = true;
    private filterValues: object;
    private resultSubscription: Subscription = null;
    public result: IInputData;
    public currentViewMode: ViewMode;
    public viewModes: any;
    public ViewModeEnum = ViewMode;
    private orderBy: string;
    private order: string;

    constructor(private paginationParameters: PaginationParameters) {
    }

    ngOnInit() {
        this.result = { data: [], currentPage: 1, pageSize: this.defaultPageSize || (this.pageSizeChoices ? this.pageSizeChoices[0] : this.paginationParameters.pageSizeChoices[0]), totalNumber: 0 };
        this.resultSubscription = this.resultObservable.subscribe((result: IInputData) => {
            this.result = result;

            this.columns.forEach(column => column.changeOnSearch(this.filterValues || this.manualCriteria, column));
            this.columnMetaData = ColumnUtils.convert(this.columns, this.orderBy, this.order);
            this.loading = false;
        });

        this.viewModes = {};
        this.viewModes[ViewMode.Table] = false;
        this.viewModes[ViewMode.Grid] = false;

        if (this.columns && this.columns.length > 0) {
            this.columnMetaData = ColumnUtils.convert(this.columns, this.orderBy, this.order);
            this.viewModes[ViewMode.Table] = true;
        }
        if (this.thumbnailView) {
            this.viewModes[ViewMode.Grid] = true;
        }

        if (this.defaultViewMode && this.viewModes[this.defaultViewMode]) {
            this.currentViewMode = this.defaultViewMode;
        } else if (this.viewModes[ViewMode.Table]) {
            this.currentViewMode = ViewMode.Table;
        } else if (this.viewModes[ViewMode.Grid]) {
            this.currentViewMode = ViewMode.Grid;
        }

        if (this.autoSearch && (!this.filters || !this.filters.length)) {
            this.doSearchAction()
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['columns']) {
            if (changes['columns'].currentValue.length > 0) {
                this.columnMetaData = ColumnUtils.convert(changes['columns'].currentValue, this.orderBy, this.order);
            }
        }
    }

    public filterChanges(filterValues: any) {
        this.filterValues = filterValues;
        this.result.currentPage = 1;
        this.doSearchAction();
    }

    public selectedDataChanged(selectedData: Array<object>) {
        this.selectedChange.emit(selectedData);
    }

    public pageSizeChanged(newPageSize: number) {
        this.result.pageSize = newPageSize;
        this.result.currentPage = 1;
        this.doSearchAction();
    }

    public selectedPageChanged(selectedPage: number) {
        this.result.currentPage = selectedPage;
        this.doSearchAction();
    }

    public sortChanged(orderInfo: { name: string, order: string }) {
        this.orderBy = orderInfo.name;
        this.order = orderInfo.order;
        this.doSearchAction();
    }

    public changeView(newViewMode: ViewMode) {
        this.currentViewMode = newViewMode;
        this.selectedChange.emit([]);
        this.doSearchAction(false)
    }

    private doSearchAction(order: boolean = true) {
        let newSearchCriteria = Object.assign({}, this.filterValues);
        newSearchCriteria['pageSize'] = this.result.pageSize;
        newSearchCriteria['currentPage'] = this.result.currentPage;
        if (order) {
            newSearchCriteria['orderBy'] = this.orderBy;
            newSearchCriteria['order'] = this.order;
        }

        //  Trim all text filters' value
        for (var key in newSearchCriteria) {
            if ((typeof newSearchCriteria[key] === 'string' || newSearchCriteria[key] instanceof String) &&
                newSearchCriteria[key].trim)
               newSearchCriteria[key] = newSearchCriteria[key].trim();
        }

        this.loading = true;
        this.search.emit(newSearchCriteria);
    }
}
