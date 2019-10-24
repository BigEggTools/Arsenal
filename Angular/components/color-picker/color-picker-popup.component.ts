import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Position } from './position';

@Component({
    selector: 'color-picker-popup',
    templateUrl: './color-picker-popup.component.html',
    styleUrls: [ './color-picker-popup.component.scss' ],
    encapsulation: ViewEncapsulation.None
})
export class ColorPickerPopupComponent implements OnDestroy, OnInit {
    @ViewChild('colorPicker') colorPickerForm: NgForm;

    public color: string;
    public colorChange: EventEmitter<string> = new EventEmitter<string>();
    public withAlpha: boolean = false;
    public position: Position;
    public realTimeUpdate: boolean = false;
    public saveOnClickOutside: boolean = false;

    public directiveElementRef: ElementRef;

    public initialColor: string;
    public show: boolean = false;
    public arrowTop: number;
    public top: number;
    public left: number;
    public positionStyle: string = 'absolute';

    private mouseDownListener: any;

    public get arrowPositionClass(): string {
        return `arrow-${Position[this.position].toString().toLowerCase()}`;
    }

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private elementRef: ElementRef) {
    }

    ngOnInit(): void {
        this.mouseDownListener = (event: any) => { this.onMouseDown(event); };
    }

    ngOnDestroy() {
        this.close();
    }


    public open(directiveElementRef: ElementRef, color: string) {
        this.directiveElementRef = directiveElementRef;
        this.color = color;
        this.initialColor = color;

        document.addEventListener('mousedown', this.mouseDownListener);

        this.show = true;
        if (directiveElementRef) {
            this.setPopupPosition();
        }
        this.changeDetectorRef.detectChanges();
    }

    public close() {
        document.removeEventListener('mousedown', this.mouseDownListener);

        this.colorPickerForm.form.markAsPristine();
        this.show = false;
    }


    public onAcceptColor(event: Event) {
        event.stopPropagation();

        this.close();
        this.colorChange.emit(this.color);
    }

    public onCancelColor(event: Event) {
        event.stopPropagation();

        this.color = this.initialColor;

        this.close();
        this.colorChange.emit(this.initialColor);
    }

    public onColorChange() {
        if (this.realTimeUpdate) {
            this.colorChange.emit(this.color);
        }
    }


    private onMouseDown(event: MouseEvent): void {
        if (event.target !== this.directiveElementRef.nativeElement &&
            !this.isDescendant(this.elementRef.nativeElement, event.target)) {

            if (this.saveOnClickOutside) {
                this.colorChange.emit(this.color);
            } else {
                this.colorChange.emit(this.initialColor);
            }

            this.close();
        }
    }

    private isDescendant(parent: any, child: any): boolean {
        let node: any = child.parentNode;
        while (node !== null) {
            if (node === parent) { return true;}
            node = node.parentNode;
        }
        return false;
    }

    private setPopupPosition() {
        let node = this.directiveElementRef.nativeElement.parentNode;
        let parentNode, transformNode = null;

        while (node !== null && node.tagName !== 'HTML') {
            let style = window.getComputedStyle(node);
            let position = style.getPropertyValue('position');

            if (position !== 'static' && parentNode === null) {
                parentNode = node;
            }

            let transform = style.getPropertyValue('transform');
            if (transform && transform !== 'none' && transformNode === null) {
                transformNode = node;
            }

            if (position === 'fixed') {
                parentNode = transformNode || node;
                this.setPositionCore(this.directiveElementRef.nativeElement, parentNode, false)
                return;
            }

            node = node.parentNode;
        }

        if (!parentNode) {
            parentNode = node;
        }
        this.setPositionCore(this.directiveElementRef.nativeElement, parentNode, true)
    }

    private setPositionCore(element: any, parentElement: any, offset: boolean) {
        const elementPosition = this.getElementPosition(element, offset);
        const parentElementPosition = this.getElementPosition(parentElement, offset);

        this.top = elementPosition.top - parentElementPosition.top;
        this.left = elementPosition.left - parentElementPosition.left;

        const popupArrowOffset = 15;
        const popupArrowSize = 10;
        const popupHeight = 240;
        const popupWidth = 230;

        if (this.position === Position.Left) {
            this.left -= popupWidth + popupArrowSize;
        } else if (this.position === Position.Top) {
            this.arrowTop = popupHeight + popupArrowOffset;
            this.top -= popupHeight + popupArrowSize + popupArrowOffset;
        } else if (this.position === Position.Right) {
            this.left += elementPosition.width + popupArrowSize;
        } else {
            this.top += elementPosition.height + popupArrowSize;
        }
    }

    private getElementPosition(element: any, offset: boolean): any {
        return {
          top: element.offsetTop + (offset ? window.pageYOffset : 0),
          left: element.offsetLeft + (offset ? window.pageXOffset : 0),
          width: element.offsetWidth,
          height: element.offsetHeight
        };
    }
}
