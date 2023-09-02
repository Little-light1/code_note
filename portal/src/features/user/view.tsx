/*
 * @Author: sds
 * @Date: 2021-12-01 15:38:58
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2023-06-26 10:02:53
 */
import React, {FC} from 'react';
import {usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch} from '@/app/runtime';
import styles from './styles.module.scss';
import {onInit, onUpdate} from './actions';
import UserManage from './user_manage';
import OrganizationTree from './organization_tree';
import HeadOperation from './head_operation';
import UserList from './user_list';
import UserPassword from './user_password';
import UserImport from './user_import';
import RoleAssociate from './role_associate';

const Component: FC<any> = (props: PageProps) => {
    const dispatch = useAppDispatch();
    usePage({
        ...props,
        init: (pageProps) => dispatch(onInit(pageProps)),
        activate: (pageProps) => dispatch(onUpdate(pageProps)),
    });
    return (
        <div className={styles.view}>
            <OrganizationTree
                pageProps={props}
                className={styles.organization}
            />
            <div className={styles.list}>
                <HeadOperation pageProps={props} />
                <UserList pageProps={props} />
            </div>
            <UserManage pageProps={props} />
            <UserPassword pageProps={props} />
            <UserImport pageProps={props} />
            <RoleAssociate pageProps={props} />
        </div>
    );
};

export default Component;
