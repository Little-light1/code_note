interface SubjoinExtraReturnItem {
    modifiable: boolean;
    addable: boolean;
    deletable: boolean;
}
export function subjoinExtraProps(
    item: any,
    currentIndexKeys: number[],
    parentNodes: any[],
): SubjoinExtraReturnItem {
    const extraProps = {
        addable: true,
        // 是否可以添加分类
        deletable: false,
        // 是否可以删除分类
        modifiable: true,
        // 是否可以修改分类
        disabled: !item.isRight,
    };

    if (item.hasDataChild) {
        extraProps.addable = false;
    } // 叶子分类 & 没有子字典

    if (
        typeof item.children === 'undefined' &&
        typeof item.hasDataChild === 'undefined'
    ) {
        extraProps.deletable = false;
    } // 根节点

    if (parentNodes.length === 0) {
        extraProps.modifiable = false;
        extraProps.deletable = false;
    } // 电场节点下面不能添加
    if(item.sameLevelFlag){
        extraProps.addable = true;
    }else{
        if (
            item.orgType === 170 ||
            item.orgType === '170' ||
            item.tyep === 170 ||
            item.type === '170'
        ) {
            extraProps.addable = false;
        }
    }
    

    return extraProps;
}
export const deviceType = {
    110: '集团',
    120: '分公司',
    130: '区域',
    140: '部门',
    150: '集控',
    160: '检修中心',
    170: '场站',
};
export const responseDevice = {
    selectedDeviceList: [
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '001',
            deviceModel: '001',
            deviceName: '001',
            deviceThingId: '001',
            farmId: '001',
            farmName: '001',
            farmThingId: '001',
            orgId: '001',
        },
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '002',
            deviceModel: '002',
            deviceName: '002',
            deviceThingId: '002',
            farmId: '002',
            farmName: '002',
            farmThingId: '002',
            orgId: '002',
        },
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '003',
            deviceModel: '003',
            deviceName: '003',
            deviceThingId: '003',
            farmId: '003',
            farmName: '003',
            farmThingId: '003',
            orgId: '003',
        },
    ],
    unselectedDeviceList: [
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '101',
            deviceModel: '101',
            deviceName: '101',
            deviceThingId: '101',
            farmId: '101',
            farmName: '101',
            farmThingId: '101',
            orgId: '101',
        },
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '102',
            deviceModel: '102',
            deviceName: '102',
            deviceThingId: '102',
            farmId: '102',
            farmName: '102',
            farmThingId: '102',
            orgId: '102',
        },
        {
            createBy: 'string',
            createTime: '2022-01-01',
            deviceId: '103',
            deviceModel: '103',
            deviceName: '103',
            deviceThingId: '103',
            farmId: '103',
            farmName: '103',
            farmThingId: '103',
            orgId: '103',
        },
    ],
};
export function changeFarmName(list: any) {
    let newArr: any = [];
    if (list && list.length > 0) {
        newArr = list.map((item: any) => {
            item.title = item.farmName || item.orgName;
            if (item.children && item.children.length > 0) {
                changeFarmName(item.children);
            }
            return item;
        });
    }
    return newArr;
}

export function setSameLeveFlag(list: any,sameLevelFlag:boolean) {
    let newArr: any = [];
    if (list && list.length > 0) {
        newArr = list.map((item: any) => {
            item.sameLevelFlag = sameLevelFlag;
            if (item.children && item.children.length > 0) {
                setSameLeveFlag(item.children,sameLevelFlag);
            }
            return item;
        });
    }
    return newArr;
}
