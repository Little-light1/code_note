export const PageTitle = '用户访问控制配置';
export const PageKey = 'userAccessControl'; // 初始默认加载页码

export const InitialPageNum = 1; // 初始默认加载条数

export const InitialPageSize = 10000;
export const TIME_CONTROL_MODAL_ID = 'timeControl';
export const ADDRESS_CONTROL_MODAL_ID = 'addressControl';
/**
 * 校验字符串是否符合IPV4
 * @param input 当前字符串
 * @returns
 */

export const isIpv4 = (input: string) => {
    const pattern =
        /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/;
    return input.match(pattern);
};
