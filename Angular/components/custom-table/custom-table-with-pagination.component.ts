import { Component, EventEmitter, Input, OnChanges, OnInit, Output, Type } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as moment from 'moment';
import { QueryParameters } from '../../utils/queryUtils';
import { ColumnMetadata, ColumnType } from './custom-table-datatypes';
import { TableWithPaginationResources } from './custom-table-resources';
import { PaginationService, PaginationSettings } from './pagination.service';

@Component({
    selector: 'custom-table-with-pagination',
    styleUrls: ['./custom-table-with-pagination.component.scss'],
    templateUrl: './custom-table-with-pagination.component.html'
})
export class CustomTablewithPaginationComponent implements OnInit, OnChanges{
    @Input() public useReact: boolean = false;
    @Input() public columns: Array<ColumnMetadata>;
    @Input() public data: Array<any>;
    @Input() public styles: string[];
    @Input() public isFixedHeader: boolean = false;
    @Input() public totalResultsCount: number;
    @Input() public isPaginationEnabled: boolean = true;
    // User can use url to dictate initial page/pageSize
    @Input() public page: number = 1;
    @Input() public pageSize: number;

    @Input() public hasRowDetails: (data: any) => boolean = () => false;
    @Input() public enableRowDetails: boolean = false;
    @Input() public rowDetailsComponentType: Type<any>;
    @Input() public expandComponent: (row: any) => JSX.Element;

    @Output() public parametersChange: EventEmitter<QueryParameters> = new EventEmitter();
    public moment = moment;
    public columnType = ColumnType;
    public resources = TableWithPaginationResources;
    public currentPage = new FormControl();
    public viewSize = new FormControl();
    private paginationSettings = PaginationSettings;
    private totalPageCount: number;
    private paginationRange: Array<number> = [];
    private initialRangeValue: number;
    private lastRangeValue: number;
    public showPageResults: boolean = false;

    constructor(private paginationService: PaginationService) {
    }

    ngOnInit(){
            //Prevents the Results view from rendering to the HTML before the table
            setTimeout(()=> {this.showPageResults = true}, 500);
    }

    ngOnChanges() {
        if (this.isPaginationEnabled) {
            this.paginationService.page = this.page;
            this.paginationService.pageSize = this.pageSize;
            this.totalPageCount = Math.ceil(this.totalResultsCount / this.paginationService.pageSize);
            this.currentPage.setValue(this.paginationService.page);
            this.viewSize.setValue(this.paginationService.pageSize);
            this.setPaginationRange();
        }
    }

    public setPaginationRange() {
        // initialRangeLimit guarantees that at the far end, the rolling window still contains pageRange (5) buttons
        const initialRangeLimit = Math.max(this.totalPageCount - PaginationSettings.pageRange + 1, 1);
        this.initialRangeValue = (this.paginationService.page <= 5) ? 1 : Math.min(this.paginationService.page - 2, initialRangeLimit);
        this.paginationRange = [];
        for (let i = 0; i < PaginationSettings.pageRange; i++) {
            const pageNumber = this.initialRangeValue + i;
            if (pageNumber > this.totalPageCount) {
                break;
            }
            this.lastRangeValue = pageNumber;
            this.paginationRange.push(pageNumber);
        }
    }

    public setPageNumber(pageSelect: number) {
        this.currentPage.setValue(pageSelect);
        this.paginationService.page = pageSelect;
        this.parametersChange.emit(this.paginationService.paginationParameters);
    }

    public setPageSize(pageSize: number) {
        this.paginationService.pageSize = +pageSize;
        this.paginationService.page = 1;
        this.parametersChange.emit(this.paginationService.paginationParameters);
    }
}

