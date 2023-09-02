/*
 * @Author: sds
 * @Date: 2021-12-15 11:21:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-06-23 20:51:25
 */
import React, {useState, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {message} from 'antd';
import _ from 'lodash';
import {useModal, PageProps} from '@gwaapp/ease';
import * as roleServices from '@services/role';
import SelectModal from '@components/select_modal';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {report} from '@utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {ROLE_USER_MODAL_ID} from '../constant';
import * as actions from '../actions';

const {t} = i18nIns;

interface Props {
    pageProps: PageProps;
}

const RoleAssociate = ({pageProps}: Props) => {
    const {id} = pageProps;
    const dispatch = useAppDispatch();
    const unlinkedUsers = useAppSelector(
        (state) => state[id].unlinkedUsers,
        shallowEqual,
    );
    const linkedUsers = useAppSelector(
        (state) => state[id].linkedUsers,
        shallowEqual,
    );
    const {closeModal, state} = useModal();
    const {record} = state[ROLE_USER_MODAL_ID] || {}; // 系统预置只可查看

    const readOnly =
        record?.code?.startsWith('sys_') || record?.code === 'LocalAndSonLevel';
    const [loading, setLoading] = useState(false);
    const userList = useMemo(() => {
        let data = _.cloneDeep(unlinkedUsers);

        linkedUsers.forEach((ele: any) => {
            data = _.filter(data, (e: any) => e.id !== ele.id);
        });
        return data;
    }, [unlinkedUsers, linkedUsers]);
    const title = [t('选择用户'), t('待选用户'), t('已选用户')]; // table columns

    const columns = [
        {
            title: t('用户账号'),
            dataIndex: 'loginName',
            key: 'loginName',
            ellipsis: true,
            // align: 'center',
            width: 90,
        },
        {
            title: t('用户名称'),
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            // align: 'center',
            width: 90,
        },
        {
            title: t('所属组织机构'),
            dataIndex: 'organization',
            key: 'organization',
            ellipsis: true,
            // align: 'center',
            width: 90,
            render: (value: any) => value?.name,
        },
    ]; // 保存

    const handleOk = (userIds: any) => {
        const params = {
            roleId: record.id,
            userIds,
        };
        const action = {
            id: 'roleAssignments',
            module: id,
            desc: `${t('更新角色关联用户信息')}：${record?.name}`,
        };
        setLoading(true);
        roleServices
            .saveRoleLinkedUsers(params)
            .then((res) => {
                const {code} = res;

                if (code === '200') {
                    report.success(action);
                    dispatch(actions.getRoleList(pageProps));
                    message.info(t('角色关联用户已更新'));
                    closeModal(ROLE_USER_MODAL_ID);
                }
            })
            .catch((e) => {
                console.log(e);
                report.fail(action);
            })
            .finally(() => setLoading(false));
    };

    return (
        <SelectModal
            id={ROLE_USER_MODAL_ID}
            titles={title}
            columns={columns}
            leftData={userList}
            rightData={linkedUsers}
            searchKeys={[
                {
                    key: 'loginName',
                    name: t('用户账号'),
                },
                {
                    key: 'userName',
                    name: t('用户名称'),
                },
                {
                    key: 'organization.name',
                    name: t('所属组织机构'),
                },
            ]}
            isLoading={loading}
            readOnly={readOnly}
            ok={handleOk}
        />
    );
};

export default RoleAssociate;
