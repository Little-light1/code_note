/*
 * @Author: gxn
 * @Date: 2022-03-21 17:15:28
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 15:00:20
 * @Description:self redux
 */
import {getLocal} from '@utils/storage';

const key = 'deviceRegister';

function getBigDataToken() {
    return function (dispatch, getState, {getPageSimpleActions}) {
        const authorization = getLocal('authorization');
        const language = getLocal('i18nextLng');
        const url = `/thingContent/#/dataPlat/thingConfigration?type=farm&token=${authorization}&Accept-Language=${language}`;
        const simpleActions = getPageSimpleActions(key);
        dispatch(simpleActions.setJumpPageToken(url));
    };
}

export const actions = {
    getBigDataToken,
};
