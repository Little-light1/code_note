/*
 * @Author: sds
 * @Date: 2022-01-02 13:47:48
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-06-07 22:49:29
 */
import React, {FC} from 'react';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import styles from './styles.module.scss';
import {onInit} from './actions';
import HeadOperation from './head_operation';
import RoleList from './role_list';
import RoleManage from './role_manage';
import UserAssociate from './user_associate';
import PermissionAssignment from './permission_assignment';

const Component: FC<any> = (props: PageProps) => {
    const dispatch = useAppDispatch();
    usePage({...props, init: (pageProps) => dispatch(onInit(pageProps))});
    return (
        <div className={styles.view}>
            <div className={styles.list}>
                <HeadOperation pageProps={props} />
                <RoleList pageProps={props} />
            </div>
            <RoleManage pageProps={props} />
            <UserAssociate pageProps={props} />
            <PermissionAssignment pageProps={props} />
        </div>
    );
};

export default Component;
