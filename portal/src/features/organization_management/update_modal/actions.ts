/*
 * @Author: gxn
 * @Date: 2021-11-29 13:53:10
 * @LastEditors: gxn
 * @LastEditTime: 2023-05-05 18:34:12
 * @Description: update_modal actions
 */
import {
    addOrgAndOrgField,
    updateOrgAndOrgField,
} from '@services/organization_management';
import {message} from 'antd';
import {AppThunk} from '@/app/runtime';
import {report} from '@/common/utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {initOrgTree} from '../actions';

const {t} = i18nIns;

export const submit =
    (props: any, modalType: string, pageProps: any): AppThunk =>
    async (dispatch, getState, {getPageState}) =>
        new Promise<void>((resolve, reject) => {
            const {name, remark, sort, templateID} = props;
            const {id} = pageProps;
            const {selectedTreeNode, orgTemplateList, dynamicRow} =
                getPageState(getState(), id);
            const {userInfo} = getPageState(getState(), 'app');
            report.action({
                id: 'orgAction',
                module: id,
                position: [
                    pageProps.menu?.menuName ?? '',
                    t(
                        modalType === 'add'
                            ? t('新增组织机构')
                            : t('编辑组织机构'),
                    ),
                    t('保存'),
                ],
                action: modalType === 'add' ? 'add' : 'modify',
                wait: true,
            });
            const action = {
                id: 'orgAction',
                module: id,
                desc: `${t(
                    modalType === 'add' ? t('新增组织机构') : t('编辑组织机构'),
                )}:${
                    modalType === 'add'
                        ? props[`${t('机构名称')}`]
                            ? props[`${t('机构名称')}`]
                            : props['机构名称']
                        : selectedTreeNode.name
                }`,
            }; // 新增操作  modalType == 'add'

            if (modalType === 'add') {
                const saveObj = {
                    name,
                    remark,
                    sort,
                    templateID,
                    parentID: selectedTreeNode.key,
                    enterpriseID: userInfo.enterpriseID,
                    type: orgTemplateList.filter(
                        (item: any) => item.id === templateID,
                    )[0].type,
                    fieldList: [],
                };
                const fieldList: any = []; // eslint-disable-next-line guard-for-in

                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        dynamicRow.forEach((item: any) => {
                            if (key === item.fieldName) {
                                const fieldObj = {
                                    fieldValue: props[key],
                                    templateFieldId: item.id,
                                };
                                fieldList.push(fieldObj);
                            }
                        });
                    }
                }

                saveObj.fieldList = fieldList;

                addOrgAndOrgField(saveObj)
                    .then((res: any) => {
                        const {code} = res;

                        if (code === '200') {
                            report.success(action);
                            message.success(t('新增成功'));
                            dispatch(initOrgTree(pageProps));
                            resolve(); // dispatch(mainData(pageProps));
                        } else {
                            report.fail(action);
                        }
                    })
                    .catch((error) => {
                        report.fail(action);
                        reject(error.message);
                    });
            } else {
                const editSaveObj = {
                    orgFieldList: [],
                    platformOrganization: {
                        name,
                        id: selectedTreeNode.key,
                        parentID: selectedTreeNode.parentKey,
                        remark,
                        sort,
                        templateID,
                        type: orgTemplateList.filter(
                            (item: any) => item.id === templateID,
                        )[0].type,
                    },
                };
                const fieldList: any = []; // eslint-disable-next-line guard-for-in

                for (const key in props) {
                    if (props.hasOwnProperty(key)) {
                        dynamicRow.forEach((item: any) => {
                            if (key === item.fieldName) {
                                const fieldObj = {
                                    fieldValue: props[key],
                                    organizationID: selectedTreeNode.key,
                                    templateFieldID: item.templateFieldID,
                                };
                                fieldList.push(fieldObj);
                            }
                        });
                    }
                }

                editSaveObj.orgFieldList = fieldList;
                updateOrgAndOrgField(editSaveObj)
                    .then((res: any) => {
                        const {code} = res;

                        if (code === '200') {
                            report.success(action);
                            message.success(t('编辑成功'));
                            dispatch(initOrgTree(pageProps));
                            resolve(); // dispatch(mainData(pageProps));
                        } else {
                            report.fail(action);
                        }
                    })
                    .catch((error) => {
                        report.fail(action);
                        reject(error.message);
                    });
            }
        });
