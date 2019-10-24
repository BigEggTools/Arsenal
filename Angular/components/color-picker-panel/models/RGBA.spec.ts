import { RGBA } from './RGBA';

describe('RGBA Test', () => {
    it('Initialize RGBA', () => {
        let color = new RGBA(28, 236, 49, 50);
        expect(color.red).toEqual(28);
        expect(color.green).toEqual(236);
        expect(color.blue).toEqual(49);
        expect(color.alpha).toEqual(50);
    });

    it('Value Validation', () => {
        let color = new RGBA(0, 0, 0, 0);
        expect(() => color.red = 256).toThrow('red should within 0 to 255.');
        expect(() => color.red = -1).toThrow('red should within 0 to 255.');
        expect(() => color.green = 256).toThrow('green should within 0 to 255.');
        expect(() => color.green = -1).toThrow('green should within 0 to 255.');
        expect(() => color.blue = 256).toThrow('blue should within 0 to 255.');
        expect(() => color.blue = -1).toThrow('blue should within 0 to 255.');
        expect(() => color.alpha = 101).toThrow('alpha should within 0 to 100.');
        expect(() => color.alpha = -1).toThrow('alpha should within 0 to 100.');

        expect(() => color.red = 255).not.toThrow();
        expect(() => color.red = 0).not.toThrow();
        expect(() => color.green = 255).not.toThrow();
        expect(() => color.green = 0).not.toThrow();
        expect(() => color.blue = 255).not.toThrow();
        expect(() => color.blue = 0).not.toThrow();
        expect(() => color.alpha = 100).not.toThrow();
        expect(() => color.alpha = 0).not.toThrow();
    });

    it('Convert to HSLA', () => {
        let color = new RGBA(12, 112, 224, 50);
        let hsla = color.toHSLA();
        expect(hsla).not.toBeUndefined();
        expect(hsla.hue).toBe(212);
        expect(hsla.saturation).toBe(90);
        expect(hsla.lightness).toBe(46);
        expect(hsla.alpha).toBe(50);
    });

    it('Output to HEX', () => {
        let color = new RGBA(12, 112, 224, 50);
        let str = color.toHex();
        expect(str).toEqual('#0C70E0');

        str = color.toHex(true);
        expect(str).toEqual('#0C70E080');
    });

    it('from HEX 1', () => {
        let color = RGBA.fromHex('#0C70E0', false);
        expect(color.red).toEqual(12);
        expect(color.green).toEqual(112);
        expect(color.blue).toEqual(224);
        expect(color.alpha).toEqual(100);

        color = RGBA.fromHex('#0C70E0', true);
        expect(color).toBeNull();

        color = RGBA.fromHex('#0C70E080', true);
        expect(color.red).toEqual(12);
        expect(color.green).toEqual(112);
        expect(color.blue).toEqual(224);
        expect(color.alpha).toEqual(50);

        color = RGBA.fromHex('#0C70E080', false);
        expect(color).toBeNull();
    });
});
