import { Injectable } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';

import { CheckBoxFilter, ComboBoxFilter, FilterType, IFilter, Select2ComboBoxFilter, TextFilter } from '../models/filter';

@Injectable()
export class FilterService {
    toFormGroup(filters: IFilter<any>[]) {
        let group: any = {};

        filters.forEach(filter => {
            switch (filter.type) {
                case FilterType.Text:
                    group[filter.name] = this.buildTextFormControl(<TextFilter>filter);
                    break;
                case FilterType.CheckBox:
                    group[filter.name] = this.buildCheckBoxFormControl(<CheckBoxFilter>filter);
                    break;
                case FilterType.ComboBox:
                    group[filter.name] = this.buildComboBoxFormControl(<ComboBoxFilter>filter);
                    break;
                case FilterType.Select2:
                    group[filter.name] = this.buildComboBoxFormControl(<Select2ComboBoxFilter>filter);
                    break;
                default:
                    this.buildDefaultFormControl(filter);
            }
        });
        return new FormGroup(group);
    }

    private buildTextFormControl(filter: TextFilter): FormControl {
        let textFilter = <TextFilter>filter;
        let validations = [];

        if (textFilter.required) { validations.push(Validators.required); }
        if (textFilter.minLength) { validations.push(Validators.minLength(textFilter.minLength)); }
        if (textFilter.maxLength) { validations.push(Validators.maxLength(textFilter.maxLength)); }
        if (textFilter.validation) { validations.push(this.customerValidator(textFilter.validation)); }

        return validations.length > 0 ?
            new FormControl({ value: filter.value || filter.defaultValue || '', disabled: filter.disabled }, validations) :
            new FormControl({ value: filter.value || filter.defaultValue || '', disabled: filter.disabled });
    }

    private buildCheckBoxFormControl(filter: CheckBoxFilter): FormControl {
        return new FormControl({ value: filter.value || filter.defaultValue || false, disabled: filter.disabled });
    }

    private buildComboBoxFormControl(filter: ComboBoxFilter): FormControl {
        return new FormControl({ value: filter.value || filter.defaultValue || '', disabled: filter.disabled });
    }

    private buildDefaultFormControl<T>(filter: IFilter<T>): FormControl {
        return new FormControl({ value: filter.value || filter.defaultValue || '', disabled: filter.disabled });
    }

    private customerValidator(validation: any): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            let errorMessage = validation(control.value);
            if (!errorMessage) { return null; }

            return {
                'custormValidation': { message: errorMessage }
            }
        };
    }
}
