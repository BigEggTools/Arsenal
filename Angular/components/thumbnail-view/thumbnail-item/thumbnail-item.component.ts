import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MetaDataType } from '../../meta-data'

import { SelectType, ThumbnailItem } from './thumbnail-item.model';

@Component({
    selector: 'thumbnail-item',
    templateUrl: './thumbnail-item.component.html',
    styleUrls: ['./thumbnail-item.component.scss']
})
export class ThumbnailItemComponent {
    @Input() selected: boolean;
    @Input() data: object;
    @Input() thumbnail: ThumbnailItem;
    @Input() selectType: SelectType;
    @Input() title: string='';
    @Output() selectedChange: EventEmitter<{ checked: boolean, data: object }> = new EventEmitter<{ checked: boolean, data: object }>();


    public SelectTypeEnum = SelectType;

    onSelectChange(checked: boolean) {
        this.selectedChange.emit({ checked, data: this.data });
    }
}