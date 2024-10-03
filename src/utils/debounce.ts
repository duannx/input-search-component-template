export const debounce = <T extends unknown[]>(callback: (...args: T) => void, wait: number) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    return (...args: T) => {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            callback(...args);
        }, wait);
    };
}