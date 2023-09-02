/*
 * @Author: gxn
 * @Date: 2022-03-21 17:15:28
 * @LastEditors: gxn
 * @LastEditTime: 2022-03-26 15:32:32
 * @Description:self redux
 */
// eslint-disable-next-line import/no-cycle
const key = 'infoModelMapping';

function getBigDataToken() {
  return function (dispatch, getState, {
    getPageSimpleActions
  }) {
    const authorization = localStorage.getItem('authorization');
    const url = `${window.aappAmbariConfigs.THING_PLAT_URL.replace('{{host}}', window.location.hostname)}/#/dataPlat/infoModelDictionary?token=${authorization}`;
    const simpleActions = getPageSimpleActions(key);
    dispatch(simpleActions.setJumpPageToken(url));
  };
}

export const actions = {
  getBigDataToken
};