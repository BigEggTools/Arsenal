import { HSVA } from './HSVA';
import { RGBA } from './RGBA';

export class HSLA {
    private _hue: number;
    private _saturation: number;
    private _lightness: number;
    private _alpha: number;

    constructor(
        hue: number,
        saturation: number,
        lightness: number,
        alpha: number
    ) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
        this.alpha = alpha;
    }

    public set hue(value: number) {
        if (value >= 0 && value < 361) {
            this._hue = value / 360;
        } else {
            throw 'hue should within 0 to 360.';
        }
    }
    public get hue(): number {
        return Math.round(this._hue * 360);
    }

    public set saturation(value: number) {
        if (value >= 0 && value < 101) {
            this._saturation = value / 100;
        } else {
            throw 'saturation should within 0 to 100.';
        }
    }
    public get saturation(): number {
        return Math.round(this._saturation * 100);
    }

    public set lightness(value: number) {
        if (value >= 0 && value < 101) {
            this._lightness = value / 100;
        } else {
            throw 'lightness should within 0 to 100.';
        }
    }
    public get lightness(): number {
        return Math.round(this._lightness * 100);
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
    public toRGBA(): RGBA {
        let r, g, b;

        if (this._saturation == 0) {
            r = g = b = this._lightness;
        } else {
            let q = this._lightness < 0.5 ? this._lightness * (1 + this._saturation) : this._lightness + this._saturation - this._lightness * this._saturation;
            let p = 2 * this._lightness - q;

            r = this.hue2rgb(p, q, this._hue + 1/3);
            g = this.hue2rgb(p, q, this._hue);
            b = this.hue2rgb(p, q, this._hue - 1/3);
        }

        return new RGBA(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255), this.alpha);
    }

    public toHSVA(): HSVA {
        if (this.lightness === 0) {
            return new HSVA(this.hue, 0, 0, this.alpha);
        } else {
            let value = this._lightness + this._saturation * (1 - Math.abs(2 * this._lightness - 1)) / 2;
            return new HSVA(this.hue, 2 * ((value - this._lightness) / value) * 100, value * 100, this.alpha);
        }
    }

    private hue2rgb(p: number, q: number, t: number): number {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
}
