import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { PaginationParameters, PaginationResources } from './pagination.model'

@Component({
    selector: 'pagination',
    templateUrl: './pagination.component.html'
})
export class PaginationComponent implements OnChanges {
    @Input() currentPage: number = 1;
    @Input() totalResultsCount: number;
    @Input() pageSize: number = 10;
    @Input() pageRange: number = 5;
    @Input() pageSizeChoices: Array<number> = this.paginationParameters.pageSizeChoices;
    @Output() pageSizeChoiceChange: EventEmitter<number> = new EventEmitter();
    @Output() selectedPageChanged: EventEmitter<number> = new EventEmitter();

    public totalPageCount: number;
    public isPaginationEnabled: boolean = true;
    public initialRangeValue: number = 5;
    public resources = PaginationResources;
    public paginationRange: Array<number> = [];
    public lastRangeValue: number;
    public viewSize: FormControl = new FormControl();
    public pageSizeChoiceChanged: boolean = false;
    private componentName: string = 'PaginationComponent';

    constructor(private paginationParameters: PaginationParameters) {
    }

    ngOnChanges() {
        this.InitializePaginationComponent();
    }

    public setPageNumber(pageNumber: number): void {
        if (this.currentPage !== pageNumber) {
            this.currentPage = pageNumber;
            this.setPaginationRange();
            this.selectedPageChanged.emit(pageNumber);
        }
    }

    public setPaginationRange() {
        const initialRangeLimit = Math.max(this.totalPageCount - this.pageRange + 1, 1);
        this.initialRangeValue = (this.currentPage <= 5) ? 1 : Math.min(this.currentPage - 2, initialRangeLimit);
        this.paginationRange = [];
        for (let i = 0; i < this.pageRange; i++) {
            const pageNumber = this.initialRangeValue + i;
            if (pageNumber > this.totalPageCount) {
                break;
            }
            this.lastRangeValue = pageNumber;
            this.paginationRange.push(pageNumber);
        }
    }

    private InitializePaginationComponent() {
        this.pageSizeChoiceChanged = false;
        this.totalPageCount = Math.ceil(this.totalResultsCount / this.pageSize);
        this.setPaginationRange();
        this.viewSize.setValue(this.pageSize);
    }

    public OnPageSizeChoiceChange(value: number) {
        this.pageSizeChoiceChanged = true;
        this.pageSize = value;
        this.pageSizeChoiceChange.emit(value);
    }
}

