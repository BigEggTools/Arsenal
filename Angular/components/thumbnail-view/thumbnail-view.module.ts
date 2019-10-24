import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '../core-components.module';

import { MetaDataModule } from '../meta-data';

import { ThumbnailItemComponent } from './thumbnail-item/thumbnail-item.component';
import { ThumbnailViewComponent } from './thumbnail-view.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CoreComponentsModule,
        MetaDataModule,
    ],
    declarations: [
        ThumbnailViewComponent,
        ThumbnailItemComponent
    ],
    providers: [
    ],
    exports: [
        ThumbnailViewComponent,
        ThumbnailItemComponent
    ],
    entryComponents: [
    ]
})
export class ThumbnailViewModule {
}
