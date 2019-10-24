import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ColorPickerPanelComponent } from './color-picker-panel.component';
import { ColorPickerPanelResources } from './color-picker-panel.resources';
import { ColorSliderDirective } from './color-slider.directive';

describe('ColorPickerPanelComponent', () => {
    let fixture: ComponentFixture<ColorPickerPanelComponent>;
    let component: ColorPickerPanelComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            declarations: [
                ColorSliderDirective,
                ColorPickerPanelComponent
            ],
            providers: [
                ChangeDetectorRef,

                ColorPickerPanelResources,
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerPanelComponent);
        component = fixture.componentInstance;
    });

    it('is initialized correctly', () => {
        expect(component).not.toBe(null);
    });

    it('can setup the color after initialize', () => {
        component.writeValue('#40D289');
        component.ngOnInit();

        expect(component.hsva.hue).toBe(150);
        expect(component.hsva.saturation).toBe(70);
        expect(component.hsva.value).toBe(82);
        expect(Math.round(component.hsva.alpha)).toBe(100);

        expect(component.hsla.hue).toBe(150);
        expect(component.hsla.saturation).toBe(62);
        expect(component.hsla.lightness).toBe(54);
        expect(Math.round(component.hsla.alpha)).toBe(100);

        expect(component.rgba.red).toBe(64);
        expect(component.rgba.green).toBe(210);
        expect(component.rgba.blue).toBe(137);
        expect(Math.round(component.rgba.alpha)).toBe(100);

        expect(component.hueSliderColor).toBe('rgb(0,255,128)');
        expect(component.alphaSliderColor).toBe('rgb(64,210,137)');
        expect(component.hexString).toBe('#40D289');
    });

    it('can setup the color after initialize with alpha', () => {
        component.withAlpha = true;
        component.writeValue('#40D28990');
        component.ngOnInit();

        expect(Math.round(component.hsva.alpha)).toBe(56);
        expect(Math.round(component.hsla.alpha)).toBe(56);
        expect(Math.round(component.rgba.alpha)).toBe(56);

        expect(component.hueSliderColor).toBe('rgb(0,255,128)');
        expect(component.alphaSliderColor).toBe('rgb(64,210,137)');
        expect(component.hexString).toBe('#40D2898F');
    });

    it('can get the slider size info after initialize', () => {
        component.withAlpha = false;
        component.writeValue('#40D28990');
        component.ngOnInit();

        expect(component.hueSliderHeight).toBe(122);
        expect(component.colorSliderWidth).toBe(190);
        expect(component.colorSliderHeight).toBe(122);
        expect(component.alphaSliderWidth).toBe(0);

        component.ngAfterViewInit();
        expect(component.alphaSliderWidth).toBe(0);
    });
});
