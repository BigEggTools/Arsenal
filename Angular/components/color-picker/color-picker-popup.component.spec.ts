import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ColorPickerPanelModule } from '../color-picker-panel';

import { ColorPickerPopupComponent } from './color-picker-popup.component';
import { Position } from './position';

describe('ColorPickerPopupComponent', () => {
    let fixture: ComponentFixture<ColorPickerPopupComponent>;
    let component: ColorPickerPopupComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,

                ColorPickerPanelModule
            ],
            declarations: [
                ColorPickerPopupComponent,
            ],
            providers: [
                ChangeDetectorRef,
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerPopupComponent);
        component = fixture.componentInstance;
    });

    it('is initialized correctly', () => {
        expect(component).not.toBe(null);
    });

    it('can get the right arrow class', () => {
        component.position = Position.Left;
        expect(component.arrowPositionClass).toBe('arrow-left');

        component.position = Position.Right;
        expect(component.arrowPositionClass).toBe('arrow-right');

        component.position = Position.Top;
        expect(component.arrowPositionClass).toBe('arrow-top');

        component.position = Position.Bottom;
        expect(component.arrowPositionClass).toBe('arrow-bottom');
    });

    it('on open popup', () => {
        component.position = Position.Left;
        component.ngOnInit();

        component.open(null, '#40D289');
        expect(component.directiveElementRef).toBe(null);
        expect(component.color).toBe('#40D289');
        expect(component.initialColor).toBe('#40D289');
        expect(component.show).toBeTruthy();
    });

    it('on close popup', () => {
        component.ngOnInit();
        component.show = true;

        component.close();
        expect(component.show).toBeFalsy();
    });

    it('on accept color', (done) => {
        component.ngOnInit();
        component.show = true;
        component.color = '#40D289';
        component.initialColor = '#40D289';

        let mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);

        component.color = '#05FFFF';
        component.colorChange.subscribe(color => {
            expect(color).toBe('#05FFFF');
            done();
        });
        component.onAcceptColor(mockEvent);
        expect(component.show).toBeFalsy();
    });

    it('on cancel color selection', (done) => {
        component.ngOnInit();
        component.show = true;
        component.color = '#40D289';
        component.initialColor = '#40D289';

        let mockEvent = jasmine.createSpyObj('event', ['stopPropagation']);

        component.color = '#05FFFF';
        component.colorChange.subscribe(color => {
            expect(color).toBe('#40D289');
            done();
        });
        component.onCancelColor(mockEvent);
        expect(component.show).toBeFalsy();
        expect(component.color).toBe('#40D289');
        expect(component.initialColor).toBe('#40D289');
    });

    describe('on color change', () => {
        it('same color', () => {
            component.ngOnInit();
            component.show = true;
            component.realTimeUpdate = true;
            component.color = '#40D289';
            component.initialColor = '#40D289';

            spyOn(component.colorChange, 'emit');

            component.color = '#40D289';
            component.onColorChange();
            expect(component.show).toBeTruthy();
            expect(component.color).toBe('#40D289');
            expect(component.initialColor).toBe('#40D289');
            expect(component.colorChange.emit).toHaveBeenCalled();
        });

        it('different color with real time update', (done) => {
            component.ngOnInit();
            component.show = true;
            component.realTimeUpdate = true;
            component.color = '#40D289';
            component.initialColor = '#40D289';

            component.colorChange.subscribe(color => {
                expect(color).toBe('#05FFFF');
                done();
            });

            component.color = '#05FFFF';
            component.onColorChange();
            expect(component.show).toBeTruthy();
            expect(component.initialColor).toBe('#40D289');
        });

        it('different color without real time update', () => {
            component.ngOnInit();
            component.show = true;
            component.realTimeUpdate = false;
            component.color = '#40D289';
            component.initialColor = '#40D289';

            spyOn(component.colorChange, 'emit');

            component.color = '#05FFFF';
            component.onColorChange();
            expect(component.show).toBeTruthy();
            expect(component.color).toBe('#05FFFF');
            expect(component.initialColor).toBe('#40D289');
            expect(component.colorChange.emit).not.toHaveBeenCalled();
        });
    });
});
