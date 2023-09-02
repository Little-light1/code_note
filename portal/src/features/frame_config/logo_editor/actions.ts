/*
 * @Author: zhangzhen
 * @Date: 2022-09-26 13:26:54
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-28 16:22:11
 *
 */
import {saveFrameConfig} from '@services/frame_config';
import {message} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {AppThunk} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import {report} from '@/common/utils/clientAction';
import {thunkInitFrame} from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

/**
 * 保存logo配置
 * @param props
 * @param values
 * @returns
 */
export const submitLogo =
    (props: PageProps, values: any): AppThunk<Promise<void>> =>
    (dispatch, getState, {getPageState}) => {
        const {id} = props;
        const {frameResponse} = getPageState(getState(), props.id);
        const {browserLogoConfigDTO, systemLogoConfigDTO, mainWinConfigDTO} =
            frameResponse;
        const {
            lconfigFiletoken,
            lconfigName,
            left,
            top,
            systemConfigFiletoken,
            systemConfigName,
        } = values;
        return new Promise<void>((resolve, reject) => {
            const submitValues = {
                browserLogoConfigDTO: {
                    ...browserLogoConfigDTO,
                    lconfigFiletoken,
                    lconfigName,
                },
                systemLogoConfigDTO: {
                    ...systemLogoConfigDTO,
                    lconfigFiletoken: systemConfigFiletoken,
                    lconfigName: systemConfigName,
                },
                mainWinConfigDTO: {
                    ...mainWinConfigDTO,
                    left: left ? 1 : 0,
                    top: top ? 1 : 0,
                },
            };

            const logAction = {
                id: LogActionID.SaveBaseInfo,
                module: id,
            };

            saveFrameConfig(submitValues)
                .then(({code, msg}) => {
                    if (code === '200') {
                        message.info(t('保存成功'));
                        dispatch(thunkInitFrame(props));
                        report.success(logAction);
                        resolve();
                        return;
                    }
                    report.fail(logAction);
                    reject(msg);
                })
                .catch((error) => {
                    report.fail(logAction);
                    reject(error.message);
                });
        });
    };
