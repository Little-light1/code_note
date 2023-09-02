/*
 * @Author: gxn
 * @Date: 2022-11-21 19:16:37
 * @LastEditors: gxn
 * @LastEditTime: 2022-12-12 13:49:15
 * @Description: file content
 */
import {DICT_TYPES} from '@/common/constant';

interface SubjoinExtraReturnItem {
    modifiable: boolean;
    addable: boolean | number[];
    deletable: boolean;
    type: 0 | 1;
}
export function subjoinExtraProps(
    item: any,
    currentIndexKeys: number[],
    parentNodes: any[],
): SubjoinExtraReturnItem {
    const extraProps: SubjoinExtraReturnItem = {
        addable: false,
        // 是否可以添加分类 / 字典
        deletable: false,
        // 是否可以删除分类
        modifiable: true,
        // 是否可以修改分类
        type: item.dicttypeKind,
    };

    if (item.hasDataChild) {
        extraProps.addable = false;
    } else {
        // 分类
        if (item.dicttypeKind === DICT_TYPES.class.key) {
            if (typeof item.children === 'undefined') {
                extraProps.addable = [
                    DICT_TYPES.class.key,
                    DICT_TYPES.dict.key,
                ];
            } else {
                // 判断第一个children的类型
                const firstChildKind = item.children[0].dicttypeKind;
                extraProps.addable = [firstChildKind];
            }
        } // 字典 (不管有没有子都只能添加字典)
        else {
            extraProps.addable = [DICT_TYPES.dict.key];
        }
    } // 叶子分类 & 没有子字典

    if (
        typeof item.children === 'undefined' &&
        typeof item.hasDataChild === 'undefined'
    ) {
        extraProps.deletable = true;
    } // 根节点

    if (parentNodes.length === 0) {
        extraProps.modifiable = false;
        extraProps.deletable = false;
    }

    return extraProps;
}
