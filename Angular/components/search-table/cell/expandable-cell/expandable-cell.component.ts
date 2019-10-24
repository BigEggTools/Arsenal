import { Component, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ImageMetaData, IMetaData, SuggestRowCheckStates } from '../../../meta-data';

import { CustomCellComponent } from '../../../../../core/components/custom-table/custom-cell.component';

@Component({
    templateUrl: './expandable-cell.component.html',
    styleUrls: ['./expandable-cell.component.scss', '../rich-text-cell/rich-text-cell.component.scss']
})
export class ExpandableCellComponent extends CustomCellComponent {
    @Input() public options: {
        metaDataArray: IMetaData[],
        detailMetaDataArray: Array<IMetaData>,
        imageMetaData: ImageMetaData,
        expanded: (data: any) => Observable<any>,
        expandedIcon: any
    }
    public rowInfo: { selected: boolean };

    public loading: boolean = false;
    public expanded: boolean = false;
    protected detailObject: object;

    public expand() {
        if (this.expanded) {
            this.expanded = false;
        } else {
            this.loading = true;
            this.expanded = true;

            this.options.expanded(this.data).subscribe(newDetail => {
                this.detailObject = newDetail;
                this.loading = false;
            });
        }
    }

    changed(): void {
        this.rowInfo = {
            selected: this.rowSelected
        };
    }

    private metaDataChangeHandler(changeData: { data: Array<object>, updatePropertyName: string, suggestRowCheckStates: SuggestRowCheckStates }) {
        setTimeout(() => {
            this.data[changeData.updatePropertyName] = changeData.data
            this.onChange.next({ suggestRowCheckStates: changeData.suggestRowCheckStates });
        }, 10);
    }
}
