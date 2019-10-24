import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { ColorPickerPanelModule } from '../color-picker-panel';

import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerDirective } from './color-picker.directive';

describe('ColorPickerComponent', () => {
    let fixture: ComponentFixture<ColorPickerComponent>;
    let component: ColorPickerComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                ReactiveFormsModule,

                ColorPickerPanelModule,
            ],
            declarations: [
                ColorPickerComponent,
                ColorPickerDirective
            ],
            providers: [
                ChangeDetectorRef,
            ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorPickerComponent);
        component = fixture.componentInstance;
    });

    it('is initialized correctly', () => {
        expect(component).not.toBe(null);
    });
});
