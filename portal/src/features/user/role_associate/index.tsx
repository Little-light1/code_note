/*
 * @Author: sds
 * @Date: 2021-12-15 11:21:47
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-10 15:08:52
 */
import React from 'react';
import {shallowEqual} from 'react-redux';
import {message} from 'antd';
import _ from 'lodash';
import {useModal, useAction, PageProps} from '@gwaapp/ease';
import * as userServices from '@services/user';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {useTranslation} from 'react-i18next';
import SelectModal from './select_modal';
import {USER_ROLE_MODAL_ID} from '../constant';

// 页面props
interface Props {
    pageProps: PageProps;
}

/**
 * 用户关联角色
 * @param {object} param
 */
const RoleAssociate = ({pageProps}: Props) => {
    const {t} = useTranslation();
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const simpleActions = getPageSimpleActions(id);
    // 角色列表数据
    const allRoleList = useAppSelector(
        (state) => state[id].allRoleList,
        shallowEqual,
    );
    // 已关联的角色
    const linkedRoles = useAppSelector(
        (state) => state[id].linkedRoles,
        shallowEqual,
    );
    // 更新列表标识
    const update = useAppSelector((state) => state[id].update, shallowEqual);
    // 角色类型
    const roleTypeList = useAppSelector(
        (state) => state[id].roleTypeList,
        shallowEqual,
    );
    // modal
    const {closeModal, state} = useModal();
    const {record} = state[USER_ROLE_MODAL_ID] || {};
    // modal title
    const title = [
        `${record?.userName}-${t('角色')}`,
        t('待选角色'),
        t('已选角色'),
    ];

    // table columns
    const columns = [
        {
            title: t('角色编码'),
            dataIndex: 'code',
            key: 'code',
            ellipsis: true,
            align: 'center',
            width: 90,
        },
        {
            title: t('角色名称'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            align: 'center',
            width: 90,
        },
        {
            title: t('角色类型'),
            dataIndex: 'roleTypeValue',
            key: 'roleTypeValue',
            ellipsis: true,
            align: 'center',
            width: 90,
        },
    ];

    /**
     * 展示左边角色列表
     * @returns array
     */
    const getLeftData = () => {
        let data = _.cloneDeep(allRoleList);

        linkedRoles.forEach((ele: any) => {
            data = _.filter(data, (e: any) => e.id !== ele.id);
        });
        return data;
    };

    /**
     * 保存方法
     * @param {array} roleIds
     * @returns Promise
     */
    const handleOk = (roleIds: any) => {
        const params = {
            id: record.id,
            roleIds: roleIds || [],
        };

        const action = {
            id: 'associateRole',
            module: id,
            desc: `${t('更新用户关联角色信息')}：${record?.loginName}`,
        };
        return new Promise((resolve) => {
            userServices
                .updateSingleUser(params)
                .then((res) => {
                    const {code} = res;

                    if (code === '200') {
                        closeModal(USER_ROLE_MODAL_ID);
                        dispatch(
                            simpleActions.set({
                                update: !update,
                            }),
                        );
                        message.info(`${t('更新用户关联角色信息')}`);
                        report.success(action);
                    } else {
                        report.fail(action);
                    }
                })
                .catch((e) => {
                    console.log(e);
                    report.fail(action);
                })
                .finally(() => resolve('done'));
        });
    };

    return (
        <SelectModal
            id={USER_ROLE_MODAL_ID}
            titles={title}
            columns={columns}
            roleTypeList={roleTypeList}
            leftData={getLeftData()}
            rightData={linkedRoles}
            searchKeys={[
                {
                    key: 'loginName',
                    name: t('角色编码'),
                },
                {
                    key: 'name',
                    name: t('角色名称'),
                },
            ]}
            ok={handleOk}
        />
    );
};

export default RoleAssociate;
