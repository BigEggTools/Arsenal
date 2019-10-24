import { HSLA } from './HSLA';

export class RGBA {
    public static readonly RGBARegex = '^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$';
    public static readonly RGBRegex =  '^#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$';

    private _red: number;
    private _green: number;
    private _blue: number;
    private _alpha: number;

    constructor(
        red: number,
        green: number,
        blue: number,
        alpha: number
    ) {
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.alpha = alpha;
    }

    public set red(value: number) {
        if (value >= 0 && value < 256) {
            this._red = value;
        } else {
            throw 'red should within 0 to 255.';
        }
    }
    public get red(): number {
        return this._red;
    }

    public set green(value: number) {
        if (value >= 0 && value < 256) {
            this._green = value;
        } else {
            throw 'green should within 0 to 255.';
        }
    }
    public get green(): number {
        return this._green;
    }

    public set blue(value: number) {
        if (value >= 0 && value < 256) {
            this._blue = value;
        } else {
            throw 'blue should within 0 to 255.';
        }
    }
    public get blue(): number {
        return this._blue;
    }

    public set alpha(value: number) {
        if (value >= 0 && value < 101) {
            this._alpha = value / 100;
        } else {
            throw 'alpha should within 0 to 100.';
        }
    }
    public get alpha(): number {
        return this._alpha * 100;
    }


    //  https://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
    public toHSLA(): HSLA {
        let r = this.red / 255, g = this.green / 255, b = this.blue / 255;
        let max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        }else{
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return new HSLA(h * 360, s * 100, l * 100, this.alpha);
    }

    public toHex(withAlpha: boolean = false): string {
        let hex = '#' + this.numberToHex(this.red) + this.numberToHex(this.green) + this.numberToHex(this.blue);
        if (withAlpha) {
            hex += this.numberToHex(Math.round(this.alpha / 100 * 255));
        }
        return hex.toUpperCase();
    }

    public static fromHex(hex: string, withAlpha: boolean): RGBA {
        if (withAlpha) {
            let result = hex.match(new RegExp(this.RGBARegex));
            return result ? new RGBA(
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
                Math.round(parseInt(result[4], 16) / 255 * 100)
            ) : null;
        } else {
            let result = hex.match(new RegExp(this.RGBRegex));
            return result ? new RGBA(
                parseInt(result[1], 16),
                parseInt(result[2], 16),
                parseInt(result[3], 16),
                100
            ) : null;
        }
    }

    private numberToHex(c: number) {
        var hex = c.toString(16).toUpperCase();
        return hex.length == 1 ? '0' + hex : hex;
    }
}
