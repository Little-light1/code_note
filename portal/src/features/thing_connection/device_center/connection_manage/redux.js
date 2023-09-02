/*
 * @Author: gxn
 * @Date: 2022-03-21 17:15:28
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 15:02:40
 * @Description:self redux
 */
import {getLocal} from '@utils/storage';

const key = 'connectorRegister';

function getBigDataToken() {
    return function (dispatch, getState, {getPageSimpleActions}) {
        const authorization = getLocal('authorization');
        const url = `/thingContent/#/dataPlat/connectManagement?token=${authorization}`;
        const simpleActions = getPageSimpleActions(key);
        dispatch(simpleActions.setJumpPageToken(url));
    };
}

export const actions = {
    getBigDataToken,
};
