/*
 * @Author: gxn
 * @Date: 2022-03-21 17:15:28
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-01 15:03:26
 * @Description:self redux
 */
// eslint-disable-next-line import/no-cycle
import {getLocal} from '@/common/utils/storage';

const key = 'infoModelConfig';

function getBigDataToken() {
    return function (dispatch, getState, {getPageSimpleActions}) {
        const authorization = getLocal('authorization');
        const language = getLocal('i18nextLng');

        const url = `${window.aappAmbariConfigs.THING_PLAT_URL.replace(
            '{{host}}',
            window.location.hostname,
        )}/#/dataPlat/infoModelConfig?token=${authorization}&Accept-Language=${language}`;
        const simpleActions = getPageSimpleActions(key);
        dispatch(simpleActions.setJumpPageToken(url));
    };
}

export const actions = {
    getBigDataToken,
};
