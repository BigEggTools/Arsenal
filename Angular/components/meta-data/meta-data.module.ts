import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '../core-components.module';

import { MetaDataComponent } from  './meta-data.component';

import { PipesModule } from  '../../pipes';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CoreComponentsModule,

        PipesModule
    ],
    declarations: [
        MetaDataComponent,
    ],
    providers: [
    ],
    exports: [
        MetaDataComponent,
    ],
    entryComponents: [
    ]
})
export class MetaDataModule {
}
