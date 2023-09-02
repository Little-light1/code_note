/**
 * @description:
 * @param navigate 打开内部页签处理
 * @param {string} url 路由地址，可以是http开头的
 * @param  menu 菜单对象
 * @return {*}
 */
import {checkAbsUrl} from '@utils/reg';

export const openInnerTag = (openPage: any, url: string, menu: any) => {
    if (checkAbsUrl(url)) {
        openPage({
            path: '/iframeOpen',
            search: {menuId: menu.menuId, tabName: menu.menuName},
        });
    } else {
        openPage({
            path: url,
        });
    }
};
