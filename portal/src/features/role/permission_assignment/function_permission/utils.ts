import _, {has} from 'lodash';

export function mergeResource({menuResources, biResources}: any) {
    const resourceTypes = new Set<string>(); // card

    const biResourcesInMenu = _.uniqBy(biResources, 'bimsourceId') // .filter(({bimenuId}) => bimenuId === menu.id)
        .map((resource: any) => {
            resourceTypes.add(`bi-$-${resource.bimsourceType}`);
            return {
                ...resource,
                id: `bi-$-${resource.bimsourceType}-$-${resource.bimsourceId}`,
                name: resource.bimsourceNameCn,
                code: resource.bimsourceCode,
                menuId: resource.bimenuId,
                type: resource.bimsourceType,
            };
        });

    const pageResourcesInMenu = _.uniqBy(menuResources, 'msourceId') // .filter(({menuId}) => menuId === menu.id)
        .map((resource: any) => {
            resourceTypes.add(`menu-$-${resource.msourceType}`);
            return {
                ...resource,
                id: `menu-$-${resource.msourceType}-$-${resource.msourceId}`,
                name: resource.msourceName,
                code: resource.msourceCode,
                menuId: resource.menuId,
                type: resource.msourceType,
            };
        });

    const mergeResources: any = {};
    const mergeResourceIds: any = {};
    [...biResourcesInMenu, ...pageResourcesInMenu].forEach((curr) => {
        const {menuId} = curr;

        if (typeof mergeResources[menuId] === 'undefined') {
            mergeResources[menuId] = [];
            mergeResourceIds[menuId] = [];
        }

        mergeResources[menuId].push(curr);
        mergeResourceIds[menuId].push(curr.id);
    });
    return {
        menuResources: mergeResources,
        menuResourceIds: mergeResourceIds,
        resourceTypes: Array.from(resourceTypes).map((str: string) => {
            const split = str.split('-$-');
            return {
                resourceType: split[0],
                type: split[1],
            };
        }),
    };
}
// 查看菜单是否有某个菜单id，且有子菜单
export const hasChildMenu = (children: any[], menuId: any) => {
    const cloneData = _.cloneDeep(children);
    const menuSort = cloneData.filter(
        (menu: any) => menu.children && menu.menuId === menuId,
    );
    return menuSort && menuSort.length > 0;
};
// 过滤权限分配界面，无子菜单时分配权限后，又新增菜单，导致父菜单&子菜单选中问题
export const filterMenus = (selectedMenus: any[], menus: any) => {
    const cloneData = _.cloneDeep(selectedMenus);
    const menuIds: Array<any> = [];
    // 轮训有权限的菜单id，在全量菜单查找有该id并且有子菜单的，从有权限菜单数组内剔除掉
    for (let i = 0; i < cloneData.length; i++) {
        const selectMenuId = cloneData[i];
        let hasChild = false;
        for (let j = 0; j < menus.length; j++) {
            const menu = menus[j];
            hasChild = hasChildMenu(menu.children, selectMenuId);
            if (hasChild) {
                break;
            }
        }
        // 菜单在最底层，可被设置为选中状态
        if (!hasChild) {
            menuIds.push(selectMenuId);
        }
    }

    return menuIds;
};
