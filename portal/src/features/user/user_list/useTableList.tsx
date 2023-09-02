/*
 * @Author: sds
 * @Date: 2022-05-19 21:20:34
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-11-10 17:04:49
 */
import {useEffect, useState, useMemo} from 'react';
import * as userServices from '@services/user';
import {report} from '@utils/clientAction';
import {i18nIns} from '@/app/i18n';
import {key} from '../index';

const {t} = i18nIns;

interface UserListProps {
    current: number;
    pageSize: number;
    selectedKeys: [string];
    searchKey: string;
    timeLimitKey: string;
    userStateKey: string;
    update?: boolean;
}
interface Params {
    proCode: string;
    organizationId: string;
    param: string;
}
interface PageInfo {
    pageNum: number;
    pageSize: number;
}

const getListData = (params: Params, pageInfo: PageInfo) =>
    new Promise((resolve, reject) => {
        userServices.searchUser(params, pageInfo).then((res) => {
            const {data, msg, code} = res;

            if (code === '200') {
                resolve(data);
            } else {
                reject(msg);
            }
        });
    });

const useTableList = ({
    current,
    pageSize,
    selectedKeys,
    searchKey,
    timeLimitKey,
    userStateKey,
    update,
}: UserListProps) => {
    const [loading, setLoading] = useState(false);
    const [listData, setListData] = useState([]);
    const [total, setTotal] = useState(0);
    const params = useMemo(
        () => ({
            proCode: 'OC',
            organizationId: selectedKeys[0],
            param: searchKey,
            timeLimit: timeLimitKey,
            state: userStateKey,
        }),
        [selectedKeys, searchKey, timeLimitKey, userStateKey],
    );
    const pageInfo = useMemo(
        () => ({
            pageNum: current,
            pageSize,
        }),
        [current, pageSize],
    );
    useEffect(() => {
        let isCancel = false;
        const action = {
            id: 'search',
            module: key,
            desc: t('查询用户信息'),
        };
        setLoading(true);
        getListData(params, pageInfo)
            .then((data: any) => {
                if (!isCancel) {
                    const list = data.list || [];
                    const pageTotal = data?.total || 0;
                    setListData(list);
                    setTotal(pageTotal);
                    report.success(action);
                }
            })
            .catch(() => {
                report.fail(action);
            })
            .finally(() => setLoading(false));
        return () => {
            isCancel = true;
        };
    }, [pageInfo, params, update]);
    return {
        isListLoading: loading,
        listData,
        total,
    };
};

export default useTableList;
