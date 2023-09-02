/*
 * @Author: zhangzhen
 * @Date: 2022-11-21 16:20:06
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-12-08 10:06:24
 *
 */
import {addAppData, updateAppData} from '@services/product_maintenance';
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {boolean2Int} from './boolean'; // 更改switch的枚举类型
import {mainData} from '../actions';
// 新增
const {t} = i18nIns;

export const addSubmitData =
    (props: {values: Record<string, any>; modalType: any}): AppThunk =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {modalType, values, selectedNode, pageProps} = props; // 操作结果埋点 desc描述信息id

            const verb = modalType === 'add' ? t('新建') : t('编辑');
            const name = modalType === 'add' ? values.name : selectedNode.name;
            const action = {
                id: 'addUpdate',
                module: 'productMaintenance',
                desc: `${verb + t('应用名称')}:${name}`,
            };

            if (modalType === 'add') {
                const objList = {
                    code: values.code,
                    name: values.name,
                    company: '',
                    // 产品所属公司
                    remark: values.remark,
                    state: boolean2Int(values.state),
                    version: 'string',
                    gwFlag: values.gwFlag,
                    piRouter: values.piRouter,
                    piUrl: values.piUrl,
                    terminalType: values.terminalType,
                    sort: values.sort,
                    piPicture: values.piPicture,
                    ssoType: values.ssoType || '',
                    ssoInfo: values.ssoInfo || '',
                };
                addAppData(objList).then((res) => {
                    const {code, data} = res;

                    if (code === '200') {
                        message.success(t('新增成功'));
                        dispatch(mainData(pageProps));
                        resolve();
                        report.success(action);
                    } else {
                        report.fail(action);
                        reject(new Error(data.msg));
                    }
                });
            } else {
                // 编辑
                const objDataApp = {
                    id: selectedNode.id,
                    code: values.code,
                    name: values.name,
                    company: '',
                    remark: values.remark,
                    state: boolean2Int(values.state),
                    version: 'string',
                    gwFlag: values.gwFlag,
                    piRouter: values.piRouter,
                    piUrl: values.piUrl,
                    terminalType: values.terminalType,
                    sort: values.sort,
                    piPicture: values.piPicture,
                    ssoType: values.ssoType || '',
                    ssoInfo: values.ssoInfo || '',
                };
                updateAppData(objDataApp).then((res) => {
                    const {code, data} = res;

                    if (code === '200') {
                        message.success(t('更新成功'));
                        dispatch(mainData(pageProps));
                        resolve();
                        report.success(action);
                    } else {
                        report.fail(action);
                        reject(new Error(data.msg));
                    }
                });
            }
        });
