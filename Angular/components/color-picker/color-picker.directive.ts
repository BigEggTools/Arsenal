import { ComponentFactoryResolver, ComponentRef, Directive, ElementRef, EventEmitter, HostListener, Input, OnDestroy, Output, ReflectiveInjector, ViewContainerRef } from '@angular/core';

import { ColorPickerPopupComponent } from './color-picker-popup.component';
import { Position } from './position';

@Directive({
    selector: '[color-picker]'
})
export class ColorPickerDirective implements OnDestroy {
    @Input() disabled: boolean;
    @Input() color: string;
    @Output() colorChange: EventEmitter<string> = new EventEmitter<string>();
    @Input() withAlpha: boolean = false;
    @Input() position: Position = Position.Right;
    @Input() realTimeUpdate: boolean = true;
    @Input() saveOnClickOutside: boolean = false;

    private popupComponent: ColorPickerPopupComponent;
    private popupComponentRef: ComponentRef<ColorPickerPopupComponent>;

    constructor(private componentFactoryResolver: ComponentFactoryResolver,
                private viewContainerRef: ViewContainerRef,
                private elementRef: ElementRef) {
    }

    @HostListener('click', ['$event']) handleClick(event: any): void {
        this.inputFocus();
    }

    @HostListener('focus', ['$event']) handleFocus(event: any): void {
        this.inputFocus();
    }

    @HostListener('input', ['$event']) handleInput(event: any): void {
        this.inputChange(event.target.value);
    }

    ngOnDestroy(): void {
        if (this.popupComponentRef !== undefined) {
            this.popupComponentRef.destroy();
        }
    }

    public inputFocus(): void {
        this.openPopup();
    }

    public inputChange(value: string): void {
        if (this.popupComponent) {
            this.popupComponent.color = value;
        } else {
            this.color = value;
            this.colorChange.emit(this.color);
        }
    }

    public openPopup(): void {
        if (this.disabled) {
            return;
        }

        if (!this.popupComponent) {
            const compFactory = this.componentFactoryResolver.resolveComponentFactory(ColorPickerPopupComponent);
            const injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainerRef.parentInjector);

            this.popupComponentRef = this.viewContainerRef.createComponent(compFactory, 0, injector, []);

            this.popupComponentRef.instance.color = this.color ? this.color : this.defaultColor;
            this.popupComponentRef.instance.colorChange = this.colorChange;
            this.popupComponentRef.instance.withAlpha = this.withAlpha;
            this.popupComponentRef.instance.position = this.position;
            this.popupComponentRef.instance.realTimeUpdate = this.realTimeUpdate;
            this.popupComponentRef.instance.saveOnClickOutside = this.saveOnClickOutside;

            this.popupComponent = this.popupComponentRef.instance;
        } else if (this.popupComponent) {
            this.popupComponent.open(this.elementRef, this.color ? this.color : this.defaultColor);
        }
    }

    private get defaultColor() {
        return this.withAlpha ? '#00000000' : '#000000';
    }
}
