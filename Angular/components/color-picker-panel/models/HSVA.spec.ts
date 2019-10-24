import { HSVA } from './HSVA';

describe('HSVA Test', () => {
    it('Initialize HSVA', () => {
        let color = new HSVA(212, 95, 87, 50);
        expect(color.hue).toEqual(212);
        expect(color.saturation).toEqual(95);
        expect(color.value).toEqual(87);
        expect(color.alpha).toEqual(50);
    });

    it('Value Validation', () => {
        let color = new HSVA(212, 95, 87, 50);
        expect(() => color.hue = 361).toThrow('hue should within 0 to 360. New value: 361');
        expect(() => color.hue = -1).toThrow('hue should within 0 to 360. New value: -1');
        expect(() => color.saturation = 101).toThrow('saturation should within 0 to 100. New value: 101');
        expect(() => color.saturation = -1).toThrow('saturation should within 0 to 100. New value: -1');
        expect(() => color.value = 101).toThrow('value should within 0 to 100. New value: 101');
        expect(() => color.value = -1).toThrow('value should within 0 to 100. New value: -1');
        expect(() => color.alpha = 101).toThrow('alpha should within 0 to 100. New value: 101');
        expect(() => color.alpha = -1).toThrow('alpha should within 0 to 100. New value: -1');
        
        expect(() => color.hue = 360).not.toThrow();
        expect(() => color.hue = 0).not.toThrow();
        expect(() => color.saturation = 100).not.toThrow();
        expect(() => color.saturation = 0).not.toThrow();
        expect(() => color.value = 100).not.toThrow();
        expect(() => color.value = 0).not.toThrow();
        expect(() => color.alpha = 100).not.toThrow();
        expect(() => color.alpha = 0).not.toThrow();
    });

    it('Convert to HSLA', () => {
        let color = new HSVA(212, 95, 87, 50);
        let hsla = color.toHSLA();
        expect(hsla).not.toBeUndefined();
        expect(hsla.hue).toBe(212);
        expect(hsla.saturation).toBe(90);
        expect(hsla.lightness).toBe(46);
        expect(hsla.alpha).toBe(50);
    });
});
