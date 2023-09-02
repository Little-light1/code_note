/*
 * @Author: gxn
 * @Date: 2021-12-31 10:16:45
 * @LastEditors: gxn
 * @LastEditTime: 2023-05-12 10:25:31
 * @Description: relateDevice
 */
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {logError, report} from '@/common/utils/clientAction';
import {
    getThingDeviceList,
    deviceMaping,
} from '@services/organization_management';
import {PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {getDeviceListByOrgIdAjax} from '../actions';

const {t} = i18nIns;

/**
 * 勾选左边
 * @param props
 * @param keys
 * @returns
 */

export const changeLeftSelectedKeys =
    (props: PageProps, keys: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                leftSelectedKeys: keys,
            }),
        );
    };
/**
 * 勾选右边
 * @param props
 * @param keys
 * @returns
 */

export const changeRightSelectedKeys =
    (props: PageProps, keys: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                rightSelectedKeys: keys,
            }),
        );
    };
/**
 * 向右移动
 * @param props
 * @param keys
 * @returns
 */

export const moveToRight =
    (
        props: PageProps,
        leftSelectedKeys: any,
        unSelectedDeviceList: any,
        selectedDeviceList: any,
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const myUnSelectedDeviceList = JSON.parse(
            JSON.stringify(unSelectedDeviceList),
        );
        const mySelectedDeviceList = JSON.parse(
            JSON.stringify(selectedDeviceList),
        ); // 选出对象，删除原有数据

        for (let i = unSelectedDeviceList.length - 1; i >= 0; i -= 1) {
            if (leftSelectedKeys.includes(unSelectedDeviceList[i].deviceId)) {
                mySelectedDeviceList.push(unSelectedDeviceList[i]);
                myUnSelectedDeviceList.splice(i, 1);
            }
        }

        const savedObjs = {
            unSelectedDeviceList: myUnSelectedDeviceList,
            selectedDeviceList: mySelectedDeviceList,
            totalSelectedDeviceList: mySelectedDeviceList,
            leftSelectedKeys: [],
            actionCount: 1,
            leftSearchName: '',
        };
        dispatch(actions.set(savedObjs));
        dispatch(searchTableData(props, '', 'left'));
    };
/**
 * 向左移动
 * @param props
 * @param keys
 * @returns
 */

export const moveToLeft =
    (
        props: PageProps,
        rightSelectedKeys: any,
        unSelectedDeviceList: any,
        selectedDeviceList: any,
    ): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const myUnSelectedDeviceList = JSON.parse(
            JSON.stringify(unSelectedDeviceList),
        );
        const mySelectedDeviceList = JSON.parse(
            JSON.stringify(selectedDeviceList),
        ); // 选出对象，删除原有数据

        for (let i = mySelectedDeviceList.length - 1; i >= 0; i -= 1) {
            if (rightSelectedKeys.includes(selectedDeviceList[i].deviceId)) {
                myUnSelectedDeviceList.push(mySelectedDeviceList[i]);
                mySelectedDeviceList.splice(i, 1);
            }
        }

        const savedObjs = {
            unSelectedDeviceList: myUnSelectedDeviceList,
            totalUnSelectedDeviceList: myUnSelectedDeviceList,
            selectedDeviceList: mySelectedDeviceList,
            rightSelectedKeys: [],
            actionCount: 1,
            rightSearchName: '',
        };
        dispatch(actions.set(savedObjs));
        // 清空搜索条件-查询
        dispatch(searchTableData(props, '', 'right'));
    };
/**
 * 修改查询条件
 * @param props
 * @param keys
 * @returns
 */

export const searchInputChange =
    (props: PageProps, value: string, type: string): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);

        if (type === 'left') {
            dispatch(
                actions.set({
                    leftSearchName: value.trim(),
                }),
            );
        } else {
            dispatch(
                actions.set({
                    rightSearchName: value.trim(),
                }),
            );
        }
    };
/**
 * 修改查询条件
 * @param props
 * @param keys
 * @returns
 */

export const searchTableData =
    (props: PageProps, value: string, type: string): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {
            totalSelectedDeviceList,
            totalUnSelectedDeviceList,
            unSelectedDeviceList,
            selectedDeviceList,
        } = getPageState(getState(), id);
        const list: any[] = [];

        if (type === 'left') {
            if (value.length > 0) {
                totalUnSelectedDeviceList.forEach((item: any) => {
                    if (
                        (item.deviceId && item.deviceId.indexOf(value) > -1) ||
                        (item.deviceName &&
                            item.deviceName.indexOf(value) > -1) ||
                        (item.deviceModel &&
                            item.deviceModel.indexOf(value) > -1)
                    ) {
                        list.push(item);
                    }
                });
                dispatch(
                    actions.set({
                        unSelectedDeviceList: list,
                    }),
                );
            } else {
                // 为空则需要从原始全量数组获取数据并且删除已经在已选中的数据中
                const myTotalUnSelectedDeviceList = JSON.parse(
                    JSON.stringify(totalUnSelectedDeviceList),
                );

                for (
                    let i = myTotalUnSelectedDeviceList.length - 1;
                    i >= 0;
                    i -= 1
                ) {
                    for (
                        let j = 0;
                        j <= selectedDeviceList.length - 1;
                        j += 1
                    ) {
                        if (
                            myTotalUnSelectedDeviceList[i].deviceId ===
                            selectedDeviceList[j].deviceId
                        ) {
                            myTotalUnSelectedDeviceList.splice(i, 1);
                        }
                    }
                }

                dispatch(
                    actions.set({
                        unSelectedDeviceList: JSON.parse(
                            JSON.stringify(myTotalUnSelectedDeviceList),
                        ),
                    }),
                );
            }
        } else if (value.length > 0) {
            totalSelectedDeviceList.forEach((item: any) => {
                if (
                    (item.deviceId && item.deviceId.indexOf(value) > -1) ||
                    (item.deviceName && item.deviceName.indexOf(value) > -1) ||
                    (item.deviceModel && item.deviceModel.indexOf(value) > -1)
                ) {
                    list.push(item);
                }
            });
            dispatch(
                actions.set({
                    selectedDeviceList: list,
                }),
            );
        } else {
            // 为空则需要从原始全量数组获取数据并且删除已经在已选中的数据中
            const myTotalSelectedDeviceList = JSON.parse(
                JSON.stringify(totalSelectedDeviceList),
            );

            // console.log('totalSelectedDeviceList: ', totalSelectedDeviceList);

            // console.log(
            //     'myTotalSelectedDeviceList: ',
            //     myTotalSelectedDeviceList,
            // );
            // console.log(
            //     'myTotalSelectedDeviceList.len: ',
            //     myTotalSelectedDeviceList.length,
            // );

            // console.log('unSelectedDeviceList: ', unSelectedDeviceList);

            for (let i = myTotalSelectedDeviceList.length - 1; i >= 0; i -= 1) {
                // console.log('i: ', i);
                // console.log(
                //     'myTotalSelectedDeviceList[i]: ',
                //     myTotalSelectedDeviceList[i].deviceId,
                // );

                for (let j = 0; j <= unSelectedDeviceList.length - 1; j += 1) {
                    // console.log(
                    //     `unSelectedDeviceList[${j}]: `,
                    //     unSelectedDeviceList[j]?.deviceId,
                    // );

                    if (
                        myTotalSelectedDeviceList[i]?.deviceId ===
                        unSelectedDeviceList[j]?.deviceId
                    ) {
                        myTotalSelectedDeviceList.splice(i, 1);
                    }
                }
            }

            dispatch(
                actions.set({
                    selectedDeviceList: JSON.parse(
                        JSON.stringify(myTotalSelectedDeviceList),
                    ),
                }),
            );
        }
    };
export const getThingDeviceByOrgId =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {thingFarmNode, selectedTreeNode} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                deviceLoading: true,
            }),
        );

        try {
            const {key} = selectedTreeNode;
            const {thingId, farmId} = thingFarmNode;
            const {data}: any = await getThingDeviceList({
                orgid: key,
                farmThingId: thingId,
                farmCustomId: farmId,
                proCode: 'OC',
            });

            if (data) {
                const selectedDeviceList = JSON.parse(
                    JSON.stringify(data.selectedDeviceList),
                );
                const unselectedDeviceList = JSON.parse(
                    JSON.stringify(data.unselectedDeviceList),
                );
                const needSetObjs = {
                    selectedDeviceList,
                    unSelectedDeviceList: unselectedDeviceList,
                    totalSelectedDeviceList: selectedDeviceList,
                    totalUnSelectedDeviceList: unselectedDeviceList,
                    deviceLoading: false,
                };
                dispatch(actions.set(needSetObjs));
            } else {
                const needSetObjs = {
                    selectedDeviceList: [],
                    unSelectedDeviceList: [],
                    totalSelectedDeviceList: [],
                    totalUnSelectedDeviceList: [],
                    deviceLoading: false,
                };
                dispatch(actions.set(needSetObjs));
            }
        } catch (error: any) {
            logError({
                error,
            });
        }
    };
/**
 * 选择关联设备tree节点
 * @param props
 * @param keys
 * @returns
 */

export const onModalTreeSelect =
    (props: PageProps, keys: any, nodes: any): AppThunk =>
    async (dispatch, getState, {getPageSimpleActions}) => {
        if (nodes.length > 0) {
            const {id} = props;
            const actions = getPageSimpleActions(id);

            if (nodes && nodes[0].thingId) {
                // 1.情况选择数据
                const initDataObj = {
                    leftSelectedKeys: [],
                    leftSearchName: '',
                    rightSelectedKeys: [],
                    rightSearchName: '',
                    actionCount: 0,
                    selectedTreeNodeInModal: keys,
                    thingFarmNode: nodes[0],
                };
                dispatch(actions.set(initDataObj));
                dispatch(getThingDeviceByOrgId(props));
            } else {
                message.info(t('选择节点不存在物理设备'), 2);
            }
        }
    };
/**
 * 提交代码
 * @param props
 * @param keys
 * @returns
 */

export const submitDetail =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const actions = getPageSimpleActions(id);
        const {
            unSelectedDeviceList,
            selectedDeviceList,
            selectedTreeNode,
            thingFarmNode,
        } = getPageState(getState(), id);

        if (
            selectedDeviceList.length === 0 &&
            unSelectedDeviceList.length === 0
        ) {
            message.info(t('当前没有选中的的设备'), 2);
            return;
        }

        report.action({
            id: 'relateDevice',
            module: id,
            position: [props.menu?.menuName ?? '', t('关联设备'), t('保存')],
            action: 'modify',
            wait: true,
        });
        const mySelectedDeviceList: any = JSON.parse(
            JSON.stringify(selectedDeviceList),
        );
        const myUnSelectedDeviceList: any = JSON.parse(
            JSON.stringify(unSelectedDeviceList),
        );
        const selectedDeviceNames: any = [];
        selectedDeviceList.forEach((item: any) => {
            selectedDeviceNames.push(item.deviceName);
        });
        mySelectedDeviceList.forEach((item: any) => {
            item.orgId = selectedTreeNode.key;
        });
        myUnSelectedDeviceList.forEach((item: any) => {
            item.orgId = selectedTreeNode.key;
        });
        const action = {
            id: 'relateDevice',
            module: id,
            desc: `${t('关联设备')}：${t('共')} ${
                selectedDeviceList.length
            } ${t('条')}`,
        };

        try {
            const {code}: any = await deviceMaping(
                {
                    selectedDeviceList: mySelectedDeviceList,
                    unselectedDeviceList: myUnSelectedDeviceList,
                },
                {
                    orgId: selectedTreeNode.key,
                    farmThingId: thingFarmNode ? thingFarmNode.thingId : '',
                },
            );

            if (code === 200 || code === '200') {
                message.success(t('关联成功'), 2); // 1.情况选择数据

                const initDataObj = {
                    actionCount: 0,
                };
                dispatch(actions.set(initDataObj));
                dispatch(getDeviceListByOrgIdAjax(props));
                report.success(action);
            }
        } catch (error: any) {
            report.fail(action);
            logError({
                error,
            });
        }
    };
