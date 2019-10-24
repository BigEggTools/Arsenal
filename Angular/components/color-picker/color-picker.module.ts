import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ColorPickerPanelModule } from  '../color-picker-panel/';

import { ColorPickerPopupComponent } from './color-picker-popup.component';
import { ColorPickerComponent } from './color-picker.component';
import { ColorPickerDirective } from './color-picker.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        ColorPickerPanelModule,
    ],
    declarations: [
        ColorPickerPopupComponent,

        ColorPickerDirective,
        ColorPickerComponent,
    ],
    providers: [
    ],
    exports: [
        ColorPickerDirective,
        ColorPickerComponent,
    ],
    entryComponents: [
        ColorPickerPopupComponent
    ]
})
export class ColorPickerModule {
}
