export const getLocal = (key = '') => {
    if (!key) {
        throw new Error('key is required.');
    }

    let value = localStorage.getItem(key);

    if (value === null) {
        return value;
    }

    try {
        value = JSON.parse(value);
    } catch (error) {
        // do nothing
    }

    return value;
};
export const setLocal = (key: string, value: any) =>
    localStorage.setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value,
    );
export const removeLocal = (key: string) => localStorage.removeItem(key);
export function getSession<ReturnType = any>(
    key = '',
): ReturnType | null | string {
    if (!key) {
        throw new Error('key is required.');
    }

    let value = sessionStorage.getItem(key);

    if (value === null) {
        return value;
    }

    try {
        value = JSON.parse(value);
    } catch (error) {
        // do nothing
    }

    return value;
}
export const setSession = (key: string, value: any) =>
    sessionStorage.setItem(
        key,
        typeof value === 'object' ? JSON.stringify(value) : value,
    );
export const clearSession = () => sessionStorage.clear();
