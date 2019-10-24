import { Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, Type, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
    selector: 'custom-table-row-details',
    template: `
    <div #rowDetails>
    </div>`
})
export class CustomTableRowDetailsComponent implements OnInit {

    @Input() public rowDetailsComponentType: Type<any>;
    @Input() public data: any;

    @ViewChild('rowDetails', { read: ViewContainerRef }) viewRef: ViewContainerRef;
    private dialogContentComponent: ComponentRef<any>;

    constructor(public componentFactoryResolver: ComponentFactoryResolver)
    {

    }

    ngOnInit(){
        this.viewRef.clear();

        const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.rowDetailsComponentType);
        const componentRef = this.viewRef.createComponent<any>(childComponent);

        this.dialogContentComponent = componentRef;

        // Data
        this.dialogContentComponent.instance.data = this.data;
    }
}