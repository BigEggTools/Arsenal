import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { SelectType } from './thumbnail-item/thumbnail-item.model';
import { Order, ThumbnailView } from './thumbnail-view.model';

@Component({
    selector: 'thumbnail-view',
    templateUrl: './thumbnail-view.component.html',
    styleUrls: ['./thumbnail-view.component.scss']
})
export class ThumbnailViewComponent implements OnInit, OnChanges {
    @Input() dataSet: object[];
    @Input() loading: boolean = false;
    @Input() thumbnailView: ThumbnailView;
    @Input() selectType: SelectType;
    /**
     * Emits the selected rows changes
     * 
     * @type {EventEmitter<Array<object>>}
     * @memberOf ResultTableComponent
     */
    @Output() selectedChange: EventEmitter<Array<object>> = new EventEmitter<Array<object>>();
    @Output() sortChange: EventEmitter<object> = new EventEmitter<object>();

    private OrderEnum = Order;
    private selectObjects: Array<object>;
    private currentSortBy: string = '';
    private currentOrder: Order = Order.NONE;
    private readonly singleSelectAutoIndex = 0;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['loading']) {
            if (!changes['loading'].currentValue && this.selectType === SelectType.Single && this.dataSet && this.dataSet.length) {
                setTimeout(() => {
                    this.selectedChange.emit([ this.dataSet[0] ]);
                });
            }
            if (changes['loading'].currentValue && this.selectObjects) {
                setTimeout(() => {
                    this.selectObjects.length = 0;
                    this.selectedChange.emit(this.selectObjects);
                });
            }
        }
    }

    ngOnInit() {
        this.selectObjects = new Array<object>();
    }

    onSelectChange(event: { checked: boolean, data: object }) {
        if (this.selectType === SelectType.Multi) {
            const index = (this.selectObjects).indexOf(event.data);
            if (event.checked && index === -1) {
                this.selectObjects.push(event.data);
            } else if (!event.checked && index > -1) {
                this.selectObjects.splice(index, 1);
            }
            this.selectedChange.emit(this.selectObjects.slice());
        } else if (this.selectType === SelectType.Single) {
            this.selectObjects.length = 0;
            this.selectObjects.push(event.data);
            this.selectedChange.emit(this.selectObjects);
        }
    }

    private sortByChanged(name: string) {
        this.thumbnailView.sortableColumn.map(child => {
            if (child.name === name) {
                this.currentSortBy = name;
                this.currentOrder = Order.DESC;
                child.order = this.currentOrder;
                this.sortChange.emit({ name: child.name, order: Order[child.order] });
            } else {
                child.order = Order.NONE;
            }
        });
    }

    private orderChanged(newOrder: Order) {
        this.thumbnailView.sortableColumn.map(child => {
            if (child.name === this.currentSortBy) {
                if (child.order === Order.ASC) {
                    this.currentOrder = Order.DESC;
                } else {
                    this.currentOrder = Order.ASC;
                }
                child.order = this.currentOrder;
                this.sortChange.emit({ name: child.name, order: Order[child.order] });
            } else {
                child.order = Order.NONE;
            }
        });
    }
}
