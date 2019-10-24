import { Directive, ElementRef, OnInit, Input } from '@angular/core';

@Directive({
    selector: '[collapseAll]',
    host: {
        '(click)': 'expandCollapseAll()'
    }
})

export class CollapseAllDirective implements OnInit {
    @Input() containerSelector: string[] = [];
    @Input('collapseAll') collapseAll: boolean = false;

    private el: HTMLInputElement;
    /**
     * Creates a collapseAll directive
     * @param {ElementRef} elRef - Angular class that gives access to the DOM element
     */
    constructor(elRef: ElementRef) {
        this.el = elRef.nativeElement;
    }

    ngOnInit() {
        this.updateText();
    }

    expandCollapseAll() {
        if (this.containerSelector && this.containerSelector.length > 0) {
            this.containerSelector.forEach(selector => {
                let $selector = selector ? $(selector) : $(this.el);
                $selector.find(".collapse").collapse(this.collapseAll ? 'show' : 'hide');
            });
            this.collapseAll = !this.collapseAll;
            this.updateText();
        }
    }

    updateText() {
        this.el.innerText = this.collapseAll ? '+ Expand All' : '- Collapse All';
    }
}