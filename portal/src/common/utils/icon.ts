export function editBrowserIcon(href = '') {
    let link: HTMLLinkElement | null =
        document.querySelector("link[rel*='icon']");
    let isNeedAppend = false;

    if (link === null) {
        link = document.createElement('link');
        isNeedAppend = true;
    }

    link.type = 'image/x-icon';
    link.rel = 'icon';
    link.href = href;

    if (isNeedAppend) {
        document.getElementsByTagName('head')[0].appendChild(link);
    }
}
