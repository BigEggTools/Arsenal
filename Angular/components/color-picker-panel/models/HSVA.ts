import { HSLA } from './HSLA';
import { RGBA } from './RGBA';

export class HSVA {
    private _hue: number;
    private _saturation: number;
    private _value: number;
    private _alpha: number;

    constructor(
        hue: number,
        saturation: number,
        value: number,
        alpha: number
    ) {
        this.hue = hue;
        this.saturation = saturation;
        this.value = value;
        this.alpha = alpha;
    }

    public set hue(value: number) {
        if (value >= 0 && value < 361) {
            this._hue = value / 360;
        } else {
            throw 'hue should within 0 to 360. New value: ' + value;
        }
    }
    public get hue(): number {
        return Math.round(this._hue * 360);
    }

    public set saturation(value: number) {
        if (value >= 0 && value < 101) {
            this._saturation = value / 100;
        } else {
            throw 'saturation should within 0 to 100. New value: ' + value;
        }
    }
    public get saturation(): number {
        return Math.round(this._saturation * 100);
    }

    public set value(value: number) {
        if (value >= 0 && value < 101) {
            this._value = value / 100;
        } else {
            throw 'value should within 0 to 100. New value: ' + value;
        }
    }
    public get value(): number {
        return Math.round(this._value * 100);
    }

    public set alpha(value: number) {
        if (value >= 0 && value < 101) {
            this._alpha = value / 100;
        } else {
            throw 'alpha should within 0 to 100. New value: ' + value;
        }
    }
    public get alpha(): number {
        return this._alpha * 100;
    }

    public toHSLA(): HSLA {
        if (this.value === 0) {
            return new HSLA(this.hue, 0, 0, this.alpha);
        } else if (this.saturation === 0 && this.value === 100) {
            return new HSLA(this.hue, 100, 100, this.alpha);
        } else {
            let l = this._value * (2 - this._saturation) / 2;
            let s = (this._value * this._saturation / (1 - Math.abs(2 * l - 1)));
            return new HSLA(this.hue, Math.max(0, Math.min(100, s * 100)), l * 100, this.alpha);
        }
    }
}
