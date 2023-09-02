import {
    getSendBoxList,
    createSendBoxMsg,
    fetchFileMap,
    getThingTreeByEnterpriseId,
    getUserListByFarmId,
    delSendBoxMsg,
} from '@services/notice_center';
import {Modal} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import defaultFileImg from '/public/image/file.png';

const {t} = i18nIns;

/**
 * 修改查询条件
 * @param props
 * @param record
 * @returns
 */

export const changeSearchVal =
    (props: PageProps, value: any, type: Number): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        const mySearchParams = JSON.parse(JSON.stringify(searchParams));
        mySearchParams.msgState = value;
        dispatch(actions.set({searchParams: mySearchParams}));
    };
/**
 * 获取信息列表数据
 * @param props
 * @returns
 */

export const getSendBoxData =
    (
        props:
            | PageProps
            | {
                  id: string;
                  searchParse: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams, pagination} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        const searchCondition = {
            all: false,
            conditionDto: {
                ...searchParams,
                msgType: '2',
            },
            pageNum: pagination.pageNumber,
            pageSize: pagination.pageSize,
        };
        const {data}: any = await getSendBoxList({
            data: searchCondition,
        });

        if (data) {
            data.records.forEach((item: any) => {
                const myDiv = document.createElement('div');
                myDiv.innerHTML = item.msgContent;
                item.msgContentStr = myDiv.innerText;
                if (item?.draftInfo) {
                    const draftInfo = JSON.parse(item.draftInfo);
                    item.umOrgIdLidt = draftInfo?.umOrgIdLidt.filter(
                        (item: any) => item !== null,
                    );
                    item.umUserIds = draftInfo?.umUserIds.filter(
                        (item: any) => item !== null,
                    );
                }
            });
            dispatch(
                actions.set({
                    tableDataSource: data.records,
                }),
            );
            const myPage = {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                total: data.total,
            }; // pagination.total = data.total;

            dispatch(
                actions.set({
                    pagination: myPage,
                }),
            );
        }
    };
/**
 * 修改查询条件
 * @param props
 * @param record
 * @returns
 */

export const handelSearch =
    (
        props:
            | PageProps
            | {
                  id: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {pagination} = getPageState(getState(), id);
        pagination.pageNumber = 1;
        const actions = getPageSimpleActions(id);
        dispatch(
            actions.set({
                pagination,
            }),
        );
        dispatch(getSendBoxData(props));
    };

/**
 * 删除通知公告
 * @param props
 * @returns
 */

export const deleteMessage =
    (props: PageProps, msgId: any): AppThunk =>
    async (dispatch) => {
        const {code, msg, data}: any = await delSendBoxMsg([].concat(msgId));

        if (code === '200') {
            Modal.info({
                title: t('删除成功'),
            });
        } else {
            Modal.error({
                title: msg,
            });
        }
    };

const getHasOwnProperty = (obj: Object, property: string) =>
    Object.prototype.hasOwnProperty.call(obj, property);
// 树选择数据获取
function lookForAllId(d = [], arr = []) {
    for (const item of d) {
        arr.push(item.id);
        if (item.children && item.children.length)
            lookForAllId(item.children, arr);
    }

    return arr;
}

// 树选择数据获取
function addUserToOrgTree(orgTree = [], userDataMap = {}) {
    _.forEach(orgTree, (item) => {
        if (item.resourceType && item.resourceType === 'user') {
            return;
        }
        item.uuid = item.id;
        if (getHasOwnProperty(userDataMap, item.id)) {
            if (item.children && item.children.length) {
                item.children = item.children.concat(
                    userDataMap[item.id].children,
                );
            } else {
                item.children = [].concat(userDataMap[item.id].children);
            }
        }
        if (item.children && item.children.length) {
            addUserToOrgTree(item.children, userDataMap);
        }
    });
    return orgTree;
}

function flat2Tree(flatData = [], parentKeyPropName = 'pid') {
    const res: any[] = [];
    const map: Record<string, any> = {};

    _.forEach(flatData, (item) => {
        const parentKeyValue = item[parentKeyPropName];
        const newItem = {
            resourceType: 'user',
            ...item.organization,
            id: item.id,
            uuid: `${item.id}${item.loginName}`,
            name: item.userName,
            parentID: parentKeyValue,
            //   children: getHasOwnProperty(map, keyValue) ? map[keyValue].children : [],
        };

        if (!getHasOwnProperty(map, parentKeyValue)) {
            map[parentKeyValue] = {
                children: [],
            };
        }

        if (typeof map[parentKeyValue].children === 'undefined') {
            map[parentKeyValue].children = [];
        }

        map[parentKeyValue].children.push(newItem);
    });

    return map;
}

function treeToArr(data, res = {}) {
    data.forEach((item) => {
        // const obj = {};
        // obj[item.id] = {...item, uuid: item.id};
        // res.push(obj);
        //
        res[item.id] = {...item, uuid: item.id, children: null};
        if (item.children && item.children.length !== 0) {
            treeToArr(item.children, res);
        }
    });
    return res;
}

/**
 * 获取信息列表数据
 * @param props
 * @returns
 */

export const getOrgTree =
    (
        props:
            | PageProps
            | {
                  id: string;
                  searchParse: string;
              },
    ): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams, pagination} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);

        const params = {
            proCode: 'OC',
        };
        const {data}: any = await getThingTreeByEnterpriseId(params);

        if (data && data.length > 0) {
            const orgarr = treeToArr(data);
            console.log(orgarr);
            dispatch(
                actions.set({
                    orgMap: orgarr,
                }),
            );
            const usersData = await getUserListByFarmId(lookForAllId(data));
            if (usersData.data) {
                const userTree = flat2Tree(usersData.data, 'organizationID');
                console.log(userTree);

                const useArr = {};
                usersData.data.forEach((item) => {
                    useArr[item.id] = {
                        ...item,
                        name: item.loginName,
                        uuid: `${item.id}${item.loginName}`,
                        children: null,
                    };
                });
                dispatch(
                    actions.set({
                        orgTree: addUserToOrgTree(data, userTree),
                        userMap: useArr,
                    }),
                );
            }
        }
    };
/**
 * 发送通知公告
 * @param props
 * @returns
 */

export const sendMessage =
    (props: PageProps, params: {}): AppThunk =>
    async (dispatch) => {
        const {code, msg, data}: any = await createSendBoxMsg(params);
        if (code === '200') {
        } else {
        }
    };

/**
 * 获取通知公告附件列表
 * @param props
 * @returns
 */

export const getFileInfos =
    (props: PageProps, params: String): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id} = props;
        const {searchParams, pagination} = getPageState(getState(), id);
        const actions = getPageSimpleActions(id);
        if (params.length === 0) {
            dispatch(
                actions.set({
                    fileList: [],
                }),
            );
            return;
        }
        const {code, msg, data}: any = await fetchFileMap(params);
        if (code === '200') {
            const fileList = Object.values(data).map((file) => {
                return {
                    uid: '',
                    status: 'done',
                    name: file.originFileName,
                    size: '',
                    type: '',
                    percent: '',
                    originFileObj: {
                        uid: '',
                        status: 'none',
                    },
                    response: {
                        code: '200',
                        msg: '操作成功',
                        data: file.fileToken,
                    },
                    xhr: {},
                    thumbUrl: defaultFileImg,
                };
            });
            dispatch(
                actions.set({
                    fileList,
                }),
            );
        } else {
        }
    };

/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        dispatch(getSendBoxData(props));
        dispatch(getOrgTree(props));
    };
