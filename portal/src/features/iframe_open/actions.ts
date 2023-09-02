import {PageProps} from '@gwaapp/ease'; // import {subjoinExtraProps} from './helper';
import {shallowEqual} from 'react-redux';
import {AppThunk, useAppSelector} from '@/app/runtime';
import {getBiReportUrl} from '@/services/find';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

export const initDictDataList =
    (props: PageProps): AppThunk =>
    async (dispatch, getState, {getPageState, getPageSimpleActions}) => {
        const {id, searchParse, search} = props;
        const actions = getPageSimpleActions(id, search);
        const {flatMenuMapById} = getPageState(getState(), 'app');
        const menu = flatMenuMapById[searchParse?.menuId];
        const path = menu?.path;
        const portalPath = window.aappAmbariConfigs.aapp_gateway_path;
        if (
            path?.indexOf(portalPath) !== -1 &&
            path?.split('url=').length > 1
        ) {
            const {data} = await getBiReportUrl({url: path?.split('url=')[1]});
            dispatch(
                actions.set({
                    url: data,
                }),
            );
        } else {
            dispatch(
                actions.set({
                    url: path,
                }),
            );
        }
    }; // 新增文档

/**
 * 页面初始化
 * @param props
 * @returns
 */

export const onInit =
    (props: PageProps): AppThunk =>
    (dispatch) => {
        setTimeout(() => {
            dispatch(initDictDataList(props));
        }, 100);
    };
