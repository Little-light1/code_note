/*
 * @Author: sun.t
 * @Date: 2021-08-30 15:57:32
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-08-30 17:02:56
 * 免登陆场景: 1. 检查登录状态 2. 重新获取用户信息
 */
import React, {FC} from 'react';
import {useQuery} from 'react-query';
import PropTypes from 'prop-types';
import {fetchAppConfigsNoAuth} from '@services/system_configs';
import {removeAuth} from '@common/utils/auth';

const SystemConfigsContext = React.createContext({});

const AuthProvider: FC = ({children}) => {
    const {isLoading, isError, data, error} = useQuery<any, Error>(
        'checkToken',
        checkLogin,
    );

    if (isLoading) {
        return <span>Loading...</span>;
    }

    if (isError && error) {
        return <span>Error: {error.message}</span>;
    }

    const logout = () =>
        fetchLogout().then(() => {
            removeAuth();
        }); // eslint-disable-next-line react/jsx-props-no-spreading

    return (
        <AuthContext.Provider
            value={{
                data: data.data,
                logout,
            }}
        >
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
    children: PropTypes.node,
};
AuthProvider.defaultProps = {
    children: null,
};
export {AuthProvider, useAuth};
