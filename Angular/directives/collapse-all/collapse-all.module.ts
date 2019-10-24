import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CollapseAllDirective } from './collapse-all.directive';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        CollapseAllDirective,
    ],
    providers: [
    ],
    exports: [
        CollapseAllDirective,
    ],
    entryComponents: [
    ]
})
export class CollapseAllModule {
}
