import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Position } from './position';
import uniqueId from 'lodash-es/uniqueId';
@Component({
    selector: 'color-picker',
    templateUrl: './color-picker.component.html',
    styleUrls: [ './color-picker.component.scss' ],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        // tslint:disable-next-line:no-forward-ref
        useExisting: forwardRef(() => ColorPickerComponent),
        multi: true,
    }, {
        provide: NG_VALIDATORS,
        // tslint:disable-next-line:no-forward-ref
        useExisting: forwardRef(() => ColorPickerComponent),
        multi: true
    }]
})
export class ColorPickerComponent implements ControlValueAccessor {
    @Input() name: string;
    @Input() inputClass: string;
    @Input() inputId: string='';
    @Input() disabled: boolean = false;
    @Output() colorChanged: EventEmitter<string> = new EventEmitter<string>();

    @Input() withAlpha: boolean = false;
    @Input() position: Position = Position.Right;
    @Input() realTimeUpdate: boolean = true;
    @Input() saveOnClickOutside: boolean = false;

    public color: string;
    public onColorChange(newValue: string): void {
        if (!this.color || this.color.toUpperCase() !== newValue.toUpperCase()) {
            this.color = newValue.toUpperCase();
            this.onChangeHandler(this.color);
            this.onTouchedHandler();
            this.colorChanged.emit(this.color);
        }
    }

    //  Implements ControlValueAccessor Interface
    private onTouchedHandler: () => void = () => {};
    private onChangeHandler: (_: any) => void = () => {};
    private onValidate: any = () => {};
    onBlur() {
        this.onTouchedHandler();
    }
    writeValue(value: string) {
        if (value && (!this.color || this.color.toUpperCase() !== value.toUpperCase())) {
            this.color = value.toUpperCase();
        }
    }
    registerOnChange(fn: any): void {
        this.onChangeHandler = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedHandler = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
    validate(c: FormControl) {
        return this.onValidate(c);
    }
    //  End --- Implements ControlValueAccessor Interface
}
