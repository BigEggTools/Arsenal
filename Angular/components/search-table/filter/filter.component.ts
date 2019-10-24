import { Component, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FilterType, IFilter } from '../models/filter';

@Component({
    selector: 'filter',
    templateUrl: './filter.component.html'
})
export class FilterComponent {
    @Input() filter: IFilter<any>;
    @Input() form: FormGroup;
    @Input() filters: Array<IFilter<any>>;

    public FilterTypeEnum = FilterType;

    get isInvalid() {
        return this.filterControl.invalid && (this.filterControl.dirty || this.filterControl.touched);
    }

    get filterControl() {
        return this.form.controls[this.filter.name];
    }


    onChange(event: any) {
        this.filters.forEach(f => {
            let control = this.form.get(f.name);
            f.value = control.value;
        });

        this.filter.onChange(this.filter.value, this.filters);

        this.filters.forEach(f => {
            let control = this.form.get(f.name);
            if (f.defaultDisabled) {
                return;
            }

            if (f.disabled || f.defaultDisabled) {
                control.disable();
            } else {
                control.enable();
            }
            control.patchValue(f.value);
        });
    }
}
