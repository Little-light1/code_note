/*
 * @Author: sds
 * @Date: 2021-12-15 11:21:47
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2022-09-We 03:58:07
 */
import React, {useState, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {message} from 'antd';
import _ from 'lodash';
import {logError, report} from '@/common/utils/clientAction';
import {useModal, PageProps} from '@gwaapp/ease';
import * as orgServices from '@services/organization_management';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {i18nIns} from '@/app/i18n';
import * as actions from '../actions';
import SelectModal from './select_modal';

const {t} = i18nIns;

interface Props {
    pageProps: PageProps;
}
const ROLE_USER_MODAL_ID = 'userRoleModal';

const RoleAssociate = ({pageProps}: Props) => {
    const {id, menu} = pageProps;
    const dispatch = useAppDispatch();
    const {unlinkedUsers, linkedUsers, selectedTreeNode} = useAppSelector(
        (state) => state[id],
        shallowEqual,
    );
    const {closeModal} = useModal();
    const [loading, setLoading] = useState(false);
    const userList = useMemo(() => {
        let data = _.cloneDeep(unlinkedUsers);

        linkedUsers.forEach((ele: any) => {
            data = _.filter(data, (e: any) => e.id !== ele.id);
        });
        return data;
    }, [unlinkedUsers, linkedUsers]);
    const modalTitle =
        selectedTreeNode && selectedTreeNode.title
            ? selectedTreeNode.title
            : '';
    const title = [
        `${modalTitle} ${t('选择用户')}`,
        `${modalTitle} ${t('待选用户')}`,
        `${modalTitle} ${t('已选用户')}`,
    ]; // table columns

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
            dataIndex: 'organizationName',
            key: 'organizationName',
            ellipsis: true,
            // align: 'center',
            width: 90,
        },
    ]; // 保存

    const handleOk = (userIds: any, userListData: any) => {
        if (!userIds.length) {
            message.info(`${t('请先选择用户')}}`);
            return;
        }

        setLoading(true);
        const saveList: any = [];
        const saveUsersNames: any = [];
        userIds.forEach((item: any) => {
            const saveObj = {
                id: item,
                organizationID: selectedTreeNode.key,
            };
            userListData.forEach((nameItem: any) => {
                if (item === nameItem.id) {
                    saveUsersNames.push(nameItem.userName);
                }
            });
            saveList.push(saveObj);
        });
        report.action({
            id: 'bindUser',
            module: id,
            position: [menu?.menuName ?? '', t('绑定用户'), t('保存')],
            action: 'modify',
            wait: true,
        });
        const action = {
            id: 'bindUser',
            module: id,
            desc: `${t('绑定用户')}：${saveUsersNames.toString()}`,
        };
        orgServices
            .batchUpdateUserOrganization(saveList)
            .then((res) => {
                const {code} = res;

                if (code === '200') {
                    // dispatch(actions.getRoleList(pageProps));
                    message.info(`${t('组织关联用户已更新')}`);
                    report.success(action);
                    closeModal(ROLE_USER_MODAL_ID); // 请求绑定用户数据

                    dispatch(
                        actions.fetchUserListByOrganizationWithName(
                            pageProps,
                            1,
                        ),
                    );
                } else {
                    report.fail(action);
                }
            })
            .catch((e) => {
                report.fail(action);
                logError({
                    e,
                });
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
            ]}
            isLoading={loading}
            ok={handleOk}
        />
    );
};

export default RoleAssociate;
