
export const PageTitle = '融合页面呈现';
export const PageKey = 'fusionPage';
// export const PageKey = 'noticeCreate';

/**
 * 空值转换为 --
 * @param value
 * @returns
 */
export const nullToDoubleBar = (value: any): any => {
    if (value === null || typeof value === 'undefined') {
        return '--';
    }
    return value;
};