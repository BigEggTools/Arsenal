import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IFilter } from '../models/filter';
import { FilterService } from './filter.service';

@Component({
    selector: 'filter-form',
    templateUrl: './filter-form.component.html',
    providers: [ FilterService ]
})
export class FilterFormComponent implements OnInit, OnChanges {
    @Input() autoSearch: boolean;
    @Input() filters: IFilter<any>[] = [];
    private _disabled: boolean = false;
    @Input() set disabled(value: boolean) {
        this._disabled = value;

        if (!this.form) { return; }
        if (value) {
            this.form.disable();
        } else {
            this.form.enable();
            this.filters.forEach(f => {
                let control = this.form.get(f.name);
                if (f.disabled || f.defaultDisabled) {
                    control.disable();
                } else {
                    control.enable();
                }
            })
        }
    }
    get disabled(): boolean {
        return this._disabled
    }
    /**
     * Emits the filter changes
     * 
     * @type {EventEmitter<object>}
     * @memberOf SearchFilterComponent
     */
    @Output() filterChanges: EventEmitter<object> = new EventEmitter<object>();
    public form: FormGroup;

    constructor(private filterService: FilterService) {}

    ngOnInit() { 
        this.form = this.filterService.toFormGroup(this.filters);

        if (this.disabled) {
            this.form.disable();
        } else {
            this.form.enable();
        }

        if (this.autoSearch) {
            setTimeout(()=>{
                this.onSubmit();
            }, 1000);
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['filters']) {
            this.form = this.filterService.toFormGroup(changes['filters'].currentValue);

            if (this.disabled) {
                this.form.disable();
            } else {
                this.form.enable();
            }
        }
    }

    onSubmit() {
        this.filterChanges.emit(this.form.getRawValue());
    }
}
