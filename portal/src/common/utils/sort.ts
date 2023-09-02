/*
 * @Author: sds
 * @Date: 2022-01-18 21:12:34
 * @Last Modified by: sds
 * @Last Modified time: 2022-01-18 21:59:44
 */
import _ from 'lodash'; // 根据排序字段排序

export const sortByKey = (data: any[], key: string, order: 'asc' | 'desc') => {
    const cloneData = _.cloneDeep(data);

    const sort = (
        tempData: any[],
        tempKey: string,
        tempOrder: 'asc' | 'desc',
    ) => {
        const newData = _.orderBy(tempData, tempKey, [tempOrder]);

        newData.forEach((ele: any) => {
            if (ele.children) {
                ele.children = sort(ele.children, tempKey, tempOrder);
            }
        });
        return newData;
    };

    const newArr = sort(cloneData, key, order);
    return newArr;
};
