import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPickerDirective } from './color-picker.directive';
import { Position } from './position';

/** Mock component to load the directive in */
@Component({
    selector: 'mock-component',
    template: `
    <input class="form-control" type="text" color-picker [(color)]="color" name="backgroundColor" [position]="PositionEnum.Right" [withAlpha]="true">
    `
})
class MockComponent {
    public PositionEnum = Position;
    public color: string = '#40D289';
}

describe('Color Picker Directive', () => {
    let component: MockComponent;
    let fixture: ComponentFixture<MockComponent>;

    // Set-up the injector providers
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                MockComponent,
                ColorPickerDirective
            ]
        });
        fixture = TestBed.createComponent(MockComponent);
        component = fixture.componentInstance;
    });

    it('Can be initialize', () => {
        fixture.detectChanges();
    });
});
