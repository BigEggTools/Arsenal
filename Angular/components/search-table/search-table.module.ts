import { CommonModule } from '@angular/common';  
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CoreComponentsModule } from '../core-components.module';

import { MetaDataModule } from '../meta-data';
import { ThumbnailViewModule } from '../thumbnail-view';

import { ExpandableCellComponent, LinkCellComponent, RichTextCellComponent, TextCellComponent } from './cell';
import { FilterFormComponent } from './filter/filter-form.component';
import { FilterComponent } from './filter/filter.component';
import { SearchTableComponent } from './search-table.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,

        CoreComponentsModule,

        MetaDataModule,
        ThumbnailViewModule
    ],
    declarations: [
        ExpandableCellComponent,
        LinkCellComponent,
        RichTextCellComponent,
        TextCellComponent,

        FilterFormComponent,
        FilterComponent,
        SearchTableComponent,
    ],
    providers: [
    ],
    exports: [
        SearchTableComponent,
    ],
    entryComponents: [
        ExpandableCellComponent,
        LinkCellComponent,
        RichTextCellComponent,
        TextCellComponent
    ]
})
export class SearchTableModule {
}
