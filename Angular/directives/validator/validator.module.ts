import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MaxDirective } from './max.directive';
import { MinDirective } from './min.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        MaxDirective,
        MinDirective,
    ],
    providers: [
    ],
    exports: [
        MaxDirective,
        MinDirective,
    ],
    entryComponents: [
    ]
})
export class ValidatorModule {
}
