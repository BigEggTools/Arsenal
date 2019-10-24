import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewContainerRef } from '@angular/core';

import { CustomCellComponent, SuggestRowCheckStates } from './custom-cell.component';
import { CustomColumnMetadata } from './custom-table-datatypes';

@Component({
    selector: 'dynamic-column',
    template: ``
})
//  Name confict with custom column in store. After wrap the components per it own, this name conflict will not happened again.
export class DynamicColumnComponent implements OnInit, OnChanges {
    @Input() componentType: any;
    @Input() data: object;
    @Input() options: object;
    @Input() className: string;
    @Input() rowSelected: boolean;
    @Output() rowSelectedChange = new EventEmitter();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private elmRef: ViewContainerRef) {}

    ngOnInit() {
        const componentInstance = this.getComponent().instance as CustomCellComponent;
        componentInstance.data = this.data;
        componentInstance.options = this.options;
        componentInstance.className = this.className;
        componentInstance.onChange.subscribe(newRowSelect => {
            if (newRowSelect) {
                if (newRowSelect.suggestRowCheckStates !== SuggestRowCheckStates.ShouldNotChecked) {
                    this.rowSelected = true;
                } else {
                    this.rowSelected = false;
                }
                this.rowSelectedChange.emit(this.rowSelected);
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const componentInstance = this.getComponent().instance as CustomCellComponent;
        if (changes['rowSelected']) {
            componentInstance.rowSelected = changes['rowSelected'].currentValue;
        }
        if (changes['data']) {
            componentInstance.data = changes['data'].currentValue;
        }

        if (componentInstance.changed) {
            componentInstance.changed();
        }
    }

    private componentRefCache: any;
    private getComponent() {
        if (!this.componentRefCache) {
            const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.componentType);
            this.componentRefCache = this.elmRef.createComponent<any>(childComponent);
        }
        return this.componentRefCache;
    }
}
