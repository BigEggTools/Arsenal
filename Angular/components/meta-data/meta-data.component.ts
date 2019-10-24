import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

import { IMetaData, MetaDataType } from './meta-data';
import { CheckListData, CheckListMetaData } from './meta-data';
import { SuggestRowCheckStates } from './suggest-row-check-states';

@Component({
    selector: 'meta-data',
    templateUrl: './meta-data.component.html',
    styleUrls: ['./meta-data.component.scss']
})
export class MetaDataComponent implements OnChanges, OnInit {
    @Output() onChange: EventEmitter<{ data: Array<object>, updatePropertyName: string, suggestRowCheckStates: SuggestRowCheckStates }> = new EventEmitter<{ data: Array<object>, updatePropertyName: string, suggestRowCheckStates: SuggestRowCheckStates }>();
    @Input() data: { selected: Array<any> };
    @Input() metaData: IMetaData;
    @Input() width: number;
    @Input() height: number;
    @Input() rowInfo: { selected: boolean };

    public MetaDataTypeEnum = MetaDataType;

    ngOnInit(): void {
        this.CheckList_Init();
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.CheckList_OnChange(changes);
    }

    //#region Check List
    private checkListData: Array<{ text: string, data: object, isDisabled: boolean, disabledTooltips: string, checked: boolean }> = [];
    private onCheckboxChange(checked: boolean, data: object) {
        let index = this.checkListData.findIndex(item => item.data === data);
        this.checkListData[index].checked = checked;
        this.raiseChangeEvent();
    }

    private raiseChangeEvent() {
        let selectedItems = this.checkListData.filter(item => {
            return item.checked && !item.isDisabled;
        }).map(item => item.data).slice();
        this.onChange.emit({
            data: selectedItems,
            updatePropertyName: (this.metaData as CheckListMetaData).updatePropertyName,
            suggestRowCheckStates: selectedItems.length === 0 ? SuggestRowCheckStates.ShouldNotChecked : (selectedItems.length === this.checkListData.filter(item => !item.isDisabled).length ? SuggestRowCheckStates.ShouldChecked : SuggestRowCheckStates.ShouldIndeterminate)
        });
    }

    private CheckList_OnChange(changes: SimpleChanges) {
        if (changes['rowInfo'] && this.metaData.type === MetaDataType.CheckList) {
            if (!changes['rowInfo'].currentValue.selected) {
                this.checkListData.forEach(item => {
                    item.checked = changes['rowInfo'].currentValue.selected;
                });
                this.raiseChangeEvent();
            }
        }
    }

    private CheckList_Init() {
        if (this.metaData.type === MetaDataType.CheckList) {
            let checkListMetaData = this.metaData as CheckListMetaData;
            this.checkListData = (checkListMetaData.getValue(this.data) as CheckListData).map(item => {
                return Object.assign({},
                    item, {
                        checked: this.data.selected && this.data.selected.length ? !!this.data.selected.find(selectedItem => selectedItem === item.data) : false
                    }
                );
            });
            this.raiseChangeEvent();
        }
    }

    private getStarIconClass(score: number, fullStarScore: number): string {
        if (score >= fullStarScore) {
            return 'fas fa-star';
        } else if (score >= (fullStarScore - 0.5)) {
            return 'fas fa-star-half-alt';
        } else {
            return 'far fa-star';
        }
    }

    //#endregion Check List
}
