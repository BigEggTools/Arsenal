import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'scale'
})
export class NumberScalePipe implements PipeTransform {
    transform(value: number): any {
        if (!value || value < 0) { return 0; }
        if (value >= 1000) { return Math.floor(value / 1000) + 'K'; }
        if (value >= 1000000) { return Math.floor(value / 1000000) + 'M'; }
        return value
    }
}
