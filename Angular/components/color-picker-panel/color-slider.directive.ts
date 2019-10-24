import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { SliderType } from './models';

@Directive({
    selector: '[color-slider]'
})
export class ColorSliderDirective {
    @Input() sliderType: SliderType;
    @Output() onChanged: EventEmitter<any> = new EventEmitter<any>();
    
    private listenerMove: any;
    private listenerStop: any;
    
    constructor(private elementRef: ElementRef) {
        this.listenerMove = (event: any) => this.move(event);
        this.listenerStop = () => this.stop();
    }
  
    @HostListener('mousedown', ['$event']) mouseDown(event: any) {
        this.start(event);
    }
    @HostListener('touchstart', ['$event']) touchStart(event: any) {
        this.start(event);
    }

    private start(event: any) {
        this.cursorChanged(event);

        document.addEventListener('mouseup', this.listenerStop);
        document.addEventListener('touchend', this.listenerStop);
        document.addEventListener('mousemove', this.listenerMove);
        document.addEventListener('touchmove', this.listenerMove);
    }

    private stop() {
        document.removeEventListener('mouseup', this.listenerStop);
        document.removeEventListener('touchend', this.listenerStop);
        document.removeEventListener('mousemove', this.listenerMove);
        document.removeEventListener('touchmove', this.listenerMove);
    }

    private move(event: any) {
        event.preventDefault();
        this.cursorChanged(event);
    }
  
    private cursorChanged(event: any) {
        const width = this.elementRef.nativeElement.offsetWidth;
        const height = this.elementRef.nativeElement.offsetHeight;
    
        const x = Math.max(0, Math.min(this.getX(event), width));
        const y = Math.max(0, Math.min(this.getY(event), height));
    
        if (this.sliderType === SliderType.Square) {
            this.onChanged.emit({ x: x / width, y: y / height });
        } else if (this.sliderType === SliderType.Vertical) {
            this.onChanged.emit({ y: y / height });
        } else if (this.sliderType === SliderType.Horizontal) {
            this.onChanged.emit({ x: x / width });
        }
    }
  
    private getX(event: any): number {
        const position = this.elementRef.nativeElement.getBoundingClientRect();
        const pageX = (event.pageX !== undefined) ? event.pageX : event.touches[0].pageX;
        return pageX - position.left - window.pageXOffset;
    }

    private getY(event: any): number {
        const position = this.elementRef.nativeElement.getBoundingClientRect();
        const pageY = (event.pageY !== undefined) ? event.pageY : event.touches[0].pageY;
        return pageY - position.top - window.pageYOffset;
    }
}
