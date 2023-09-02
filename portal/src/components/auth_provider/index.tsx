/*
 * @Author: sun.t
 * @Date: 2021-08-30 15:57:32
 * @Last Modified by: gongzunbao
 * @Last Modified time: 2023-05-10 11:09:20
 * 免登陆场景: 1. 检查登录状态 2. 重新获取用户信息
 */
import React, {FC, useMemo} from 'react';
import {useQuery} from 'react-query';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import {StandardResponse} from '@services/common/types';
import {checkToken, fetchSelf} from '@services/login';
import {LoginResponseData} from '@services/login/types';
import {useLocation} from 'react-router-dom';
import {useAction} from '@gwaapp/ease';
import {SsoLoginKey, SsoLoginTypeKey} from '@common/init/configs';
import {clearSession, setLocal} from '@/common/utils/storage';

interface Context {
    // data: any;
    logout: (userId: string, socket: any) => void;
    onAuth: (response: LoginResponseData) => void;
}
interface Props {
    onAuth: (response?: any) => void;
    logout: (userId: string, socket: any) => void;
    loginPath?: string;
}
const AuthContext = React.createContext<Context>({} as any);

const AuthProvider: FC<Props> = ({
    onAuth,
    logout,
    children,
    loginPath = '/login',
}) => {
    const location = useLocation();
    const {historyManager} = useAction(); // const dispatch = useAppDispatch();
    const isSsoLogin = Boolean(localStorage.getItem(SsoLoginKey) === 'true');

    // // 用户请求回调
    // const fetchUserInfoSuccess = useCallback(
    //   (response) => {
    //     const {data: userInfo} = response;
    //     const action = getPageSimpleActions('app');
    //     dispatch(action.set({userInfo}));
    //   },
    //   [dispatch, getPageSimpleActions],
    // );
    // 验证token是否失效

    const {isLoading, isError, error} = useQuery<StandardResponse<any>, Error>(
        'checkToken',
        checkToken,
        {
            onSuccess: async (checkResponse) => {
                const currentPath = location.pathname;
                const searchParams = location.search;
                const params = queryString.parse(searchParams);
                if (params && params.token) {
                    const matchKeyArgs = currentPath.slice(
                        1,
                        currentPath.length,
                    );
                    // 根据外部token获取门户token,禁止修改密码弹框
                    const tokenData = {
                        token: params?.token,
                        user: {
                            forceModifyPasswordTime: '9999-01-01T00:00:00',
                            forceModifyPassword: {value: '1'},
                        },
                    };
                    onAuth(tokenData);
                    setLocal(SsoLoginKey, true);
                    if (params?.ssoType) {
                        setLocal(SsoLoginTypeKey, params?.ssoType);
                    }
                    const {data} = await fetchSelf();
                    if (data) {
                        historyManager?.pushPath({
                            key: matchKeyArgs || 'index',
                            search: {},
                        });
                        return;
                    }
                }

                const {code} = checkResponse;

                if (code === '200') {
                    // 授权通过
                    onAuth();
                    currentPath === loginPath &&
                        historyManager?.pushPath({
                            key: 'index',
                        });
                } else {
                    // 清理
                    clearSession();

                    if (currentPath !== loginPath) {
                        historyManager?.pushPath({
                            key: 'login',
                        });
                    }
                }
            },
        },
    );
    const memoValue = useMemo(
        () => ({
            logout,
            onAuth,
        }),
        [logout, onAuth],
    ); // // 自动获取用户信息
    // const {data: userInfoResponse} = useQuery('fetchUserInfo', fetchSelf, {
    //   enabled: !!data && data.code === '200',
    //   onSuccess: fetchUserInfoSuccess,
    // });

    if (isLoading) {
        return 'loading...';
    }

    if (isError && error) {
        return <span>Error: {error.message}</span>;
    } // eslint-disable-next-line react/jsx-props-no-spreading

    return (
        <AuthContext.Provider value={memoValue}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    const context = React.useContext(AuthContext);

    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthProvider`);
    }

    return context;
}

AuthProvider.propTypes = {
    onAuth: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
};
AuthProvider.defaultProps = {};
export {AuthProvider, useAuth};
