import { EventEmitter, Input, Output } from '@angular/core';

export abstract class CustomCellComponent {
    @Input() data: any;
    @Input() options: any;
    @Input() className: string;
    @Input() rowSelected: boolean;
    @Output() onChange: EventEmitter<{ suggestRowCheckStates: SuggestRowCheckStates }> = new EventEmitter<{ suggestRowCheckStates: SuggestRowCheckStates }>();

    changed(): void {}
}

//  Duplicate with the meta data version to reduce the cross reference.
//  Once move every thing to shared component folder, can be delete
export enum SuggestRowCheckStates {
    ShouldChecked,
    ShouldNotChecked,
    ShouldIndeterminate
}
