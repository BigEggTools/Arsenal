export function debounce(func, delay: number = 100, leading: boolean = false) {
    let inDebounce: any;
    return function debounced() {
        const context = this;
        const args = arguments;

        if (inDebounce) {
            clearTimeout(inDebounce);
        } else if (leading) {
            func.apply(context, args);
        }
        inDebounce = setTimeout(() => {
            if (!leading) {
                func.apply(context, args);
            }
            inDebounce = null;
        }, delay);
    }
}
