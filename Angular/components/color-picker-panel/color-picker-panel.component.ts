import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm, Validator } from '@angular/forms';

import { ColorPickerPanelResources } from './color-picker-panel.resources';
import { HSLA, HSVA, RGBA, SliderType } from './models';

@Component({
    selector: 'color-picker-panel',
    templateUrl: './color-picker-panel.component.html',
    styleUrls: [ './color-picker-panel.component.scss' ],
    encapsulation: ViewEncapsulation.None,
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        // tslint:disable-next-line:no-forward-ref
        useExisting: forwardRef(() => ColorPickerPanelComponent),
        multi: true,
    }, {
        provide: NG_VALIDATORS,
        // tslint:disable-next-line:no-forward-ref
        useExisting: forwardRef(() => ColorPickerPanelComponent),
        multi: true
    }]
})
export class ColorPickerPanelComponent implements OnInit, AfterViewInit, ControlValueAccessor, Validator {
    @Input() withAlpha: boolean = false;
    @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();

    @ViewChild('hueSlider') hueSlider: ElementRef;
    @ViewChild('colorSlider') colorSlider: ElementRef;
    @ViewChild('alphaSlider') alphaSlider: ElementRef;

    @ViewChild('colorPickerPanel') colorPickerPanelForm: NgForm;

    public readonly RGBARegex = RGBA.RGBARegex;
    public readonly RGBRegex = RGBA.RGBRegex;

    private color: string;

    public hueSliderHeight: number;
    public colorSliderWidth: number;
    public colorSliderHeight: number;
    public alphaSliderWidth: number = 0;

    public hsva: HSVA = new HSVA(0, 0, 0, 0);
    public hsla: HSLA = new HSLA(0, 0, 0, 0);
    public rgba: RGBA = new RGBA(0, 0, 0, 0);
    public hexString: string = '';

    public hueSliderColor: string = '';
    public alphaSliderColor: string = '';

    public SliderTypeEnum = SliderType;
    private Math: any = Math;

    constructor(private changeDetectorRef: ChangeDetectorRef, public resources: ColorPickerPanelResources) {
    }

    ngOnInit() {
        this.hueSliderHeight = this.hueSlider.nativeElement.offsetHeight;
        this.colorSliderWidth = this.colorSlider.nativeElement.offsetWidth;
        this.colorSliderHeight = this.colorSlider.nativeElement.offsetHeight;
        if (this.withAlpha) {
            this.alphaSliderWidth = this.alphaSlider ? this.alphaSlider.nativeElement.offsetWidth : 0;
        }

        this.colorPickerPanelForm.statusChanges.subscribe(change => {
            this.onChangeHandler(this.hexString);
            this.onTouchedHandler();
        });
    }

    ngAfterViewInit(): void {
        if (this.withAlpha) {
            this.alphaSliderWidth = this.alphaSlider ? this.alphaSlider.nativeElement.offsetWidth : 0;
            this.changeDetectorRef.detectChanges();
        }
    }

    public onColorChange(value: {x: number, y: number}) {
        this.hsva.saturation = Math.min(1, Math.max(0, value.x)) * 100;
        this.hsva.value = Math.min(1, Math.max(0, 1 - value.y)) * 100;

        this.newColorSelected();
    }

    public onHueChange(value: {y: number}) {
        this.hsva.hue = Math.min(1, Math.max(0, value.y)) * 360;

        this.newColorSelected();
    }

    public onAlphaChange(value: {x: number}) {
        this.hsva.alpha = Math.round((value.x * 100));

        this.newColorSelected();
    }

    public onDragEnd(slider: string) {
    }

    public onDragStart(slider: string) {
    }


    public onAlphaInputChange($event: number) {
        this.hsva.alpha = $event;
        this.newColorSelected();
    }

    public onRedInputChange($event: number) {
        this.hsva = new RGBA($event, this.rgba.green, this.rgba.blue, this.rgba.alpha).toHSLA().toHSVA();
        this.newColorSelected();
    }
    public onGreenInputChange($event: number) {
        this.hsva = new RGBA(this.rgba.red, $event, this.rgba.blue, this.rgba.alpha).toHSLA().toHSVA();
        this.newColorSelected();
    }
    public onBlueInputChange($event: number) {
        this.hsva = new RGBA(this.rgba.red, this.rgba.green, $event, this.rgba.alpha).toHSLA().toHSVA();
        this.newColorSelected();
    }
    public onHueInputChange($event: number) {
        this.hsva = new HSLA($event, this.hsla.saturation, this.hsla.lightness, this.rgba.alpha).toHSVA();
        this.newColorSelected();
    }
    public onSaturationInputChange($event: number) {
        this.hsva = new HSLA(this.hsla.hue, $event, this.hsla.lightness, this.rgba.alpha).toHSVA();
        this.newColorSelected();
    }
    public onLightnessInputChange($event: number) {
        this.hsva = new HSLA(this.hsla.hue, this.hsla.saturation, $event, this.rgba.alpha).toHSVA();
        this.newColorSelected();
    }

    public onHexInputChange($event: string) {
        let rgba = RGBA.fromHex($event, this.withAlpha);
        if (!rgba) {
            this.onChangeHandler(this.hexString);
            this.onTouchedHandler();
            return;
        }

        this.hsva = rgba.toHSLA().toHSVA();
        this.newColorSelected();
    }


    private newColorSelected() {
        this.hsla = this.hsva.toHSLA();
        this.rgba = this.hsla.toRGBA();

        this.refreshColor();

        this.onChangeHandler(this.hexString);
        this.onTouchedHandler();
        this.colorChange.emit(this.hexString);
    }

    private refreshColor() {
        let hsla = new HSLA(this.hsla.hue, 100, 50, 100);
        let rgba = hsla.toRGBA();
        this.hueSliderColor = `rgb(${rgba.red},${rgba.green},${rgba.blue})`;
        this.alphaSliderColor = `rgb(${this.rgba.red},${this.rgba.green},${this.rgba.blue})`;
        this.hexString = this.rgba.toHex(this.withAlpha);
    }


    //  Implements ControlValueAccessor Interface
    private onTouchedHandler: () => void = () => {};
    private onChangeHandler: (_: any) => void = () => {};
    onBlur() {
        this.onTouchedHandler();
    }
    writeValue(value: string) {
        if (value) {
            let rgba = RGBA.fromHex(value.toUpperCase(), this.withAlpha);
            if (rgba) {
                this.color = value.toUpperCase();

                this.rgba = rgba;
                this.hsla = this.rgba.toHSLA();
                this.hsva = this.hsla.toHSVA();

                this.refreshColor();
            }
        }
    }
    registerOnChange(fn: any): void {
        this.onChangeHandler = fn;
    }
    registerOnTouched(fn: any): void {
        this.onTouchedHandler = fn;
    }
    validate(c: FormControl) {
        return this.colorPickerPanelForm.invalid ? {
            color: {
                valid: false
            }
        } : null;
    }
    //  End --- Implements ControlValueAccessor Interface
}
