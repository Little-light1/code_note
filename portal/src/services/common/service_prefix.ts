export const servicePrefix: {[key: string]: string} = {
    portal: 'aapp-portal',
    fileUpload: 'aapp-fileupload',
    bigdataplat: 'bigdataplat',
    aappPortal: 'aapp-portal',
    aappFileupload: 'aapp-fileupload',
    bi: 'aapp-bi',
};

export default function (path: string, prefix = 'portal') {
    return (servicePrefix[prefix] || '') + path;
}
