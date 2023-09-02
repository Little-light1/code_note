import _ from 'lodash';
/**
 * 遍历对象列表，为每个对象添加列NUMBER，作为每条记录的序号
 * @param {} data ：数据源
 * @param {*} page ：当前页码
 * @param {*} pageSize ：每页大小
 */

export const addNumberFieldToListFunctions = (data, page, pageSize) => {
    if (data) {
        if (!page || !pageSize) {
            page = 1;
            pageSize = 1;
        }

        data = _.map(data, (ele, index) => {
            const obj = {
                NUMBER: (page - 1) * pageSize + index + 1,
            };
            return Object.assign(obj, ele);
        });
    }

    return data;
};
