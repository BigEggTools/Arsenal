import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ValidatorModule } from '../../directives/validator/';

import { ColorPickerPanelComponent } from  './color-picker-panel.component';
import { ColorPickerPanelResources } from './color-picker-panel.resources';
import { ColorSliderDirective } from './color-slider.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        ValidatorModule,
    ],
    declarations: [
        ColorSliderDirective,

        ColorPickerPanelComponent,
    ],
    providers: [
        ColorPickerPanelResources,
    ],
    exports: [
        ColorPickerPanelComponent,
    ],
    entryComponents: [
    ]
})
export class ColorPickerPanelModule {
}
