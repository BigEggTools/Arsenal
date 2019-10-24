import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSliderDirective } from './color-slider.directive';
import { SliderType } from './models';

/** Mock component to load the directive in */
@Component({
    selector: 'mock-component',
    template: `
    <div #hueSlider class="hue-slider" color-slider [sliderType]="SliderTypeEnum.Vertical" (onChanged)="onHueChange($event)" (dragStart)="onDragStart('hue')" (dragEnd)="onDragEnd('hue')">
    </div>
    `
})
class MockComponent {
    public SliderTypeEnum = SliderType;

    public onHueChange: ($event) => void;
    public onDragStart: (name: string) => void;
    public onDragEnd: (name: string) => void;
}

describe('Color Slider Directive', () => {
    let component: MockComponent;
    let fixture: ComponentFixture<MockComponent>;

    // Set-up the injector providers
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent,
                ColorSliderDirective
            ]
        });
        fixture = TestBed.createComponent(MockComponent);
        component = fixture.componentInstance;
    });

    it('Can be initialize', () => {
        fixture.detectChanges();
    });
})
