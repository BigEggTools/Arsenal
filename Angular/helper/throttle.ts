export function throttle(callback, limit) {
    let inThrottle: boolean = false;
    return function () {
        const context = this;
        if (!inThrottle) {
            callback.apply(context, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}
