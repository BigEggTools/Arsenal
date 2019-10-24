import { HSLA } from './HSLA';

describe('HSLA Test', () => {
    it('Initialize HSLA', () => {
        let color = new HSLA(212, 90, 46, 50);
        expect(color.hue).toEqual(212);
        expect(color.saturation).toEqual(90);
        expect(color.lightness).toEqual(46);
        expect(color.alpha).toEqual(50);
    });

    it('Value Validation', () => {
        let color = new HSLA(212, 90, 46, 50);
        expect(() => color.hue = 361).toThrow('hue should within 0 to 360.');
        expect(() => color.hue = -1).toThrow('hue should within 0 to 360.');
        expect(() => color.saturation = 101).toThrow('saturation should within 0 to 100.');
        expect(() => color.saturation = -1).toThrow('saturation should within 0 to 100.');
        expect(() => color.lightness = 101).toThrow('lightness should within 0 to 100.');
        expect(() => color.lightness = -1).toThrow('lightness should within 0 to 100.');
        expect(() => color.alpha = 101).toThrow('alpha should within 0 to 100.');
        expect(() => color.alpha = -1).toThrow('alpha should within 0 to 100.');
        
        expect(() => color.hue = 360).not.toThrow();
        expect(() => color.hue = 0).not.toThrow();
        expect(() => color.saturation = 100).not.toThrow();
        expect(() => color.saturation = 0).not.toThrow();
        expect(() => color.lightness = 100).not.toThrow();
        expect(() => color.lightness = 0).not.toThrow();
        expect(() => color.alpha = 100).not.toThrow();
        expect(() => color.alpha = 0).not.toThrow();
    });

    it('Convert to RGBA', () => {
        let color = new HSLA(212, 90, 46, 50);
        let rgba = color.toRGBA();
        expect(rgba).not.toBeUndefined();
        expect(rgba.red).toBe(12);
        expect(rgba.green).toBe(110);
        expect(rgba.blue).toBe(223);
        expect(rgba.alpha).toBe(50);
    });

    it('Convert to HSVA', () => {
        let color = new HSLA(212, 90, 46, 50);
        let hsva = color.toHSVA();
        expect(hsva).not.toBeUndefined();
        expect(hsva.hue).toBe(212);
        expect(hsva.saturation).toBe(95);
        expect(hsva.value).toBe(87);
        expect(hsva.alpha).toBe(50);
    });
});
