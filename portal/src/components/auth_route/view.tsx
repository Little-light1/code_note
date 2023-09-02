import React, {FC} from 'react';
import {useRouteMatch, Redirect, Route, RouteProps} from 'react-router-dom';
import PropTypes from 'prop-types';
import {hasAuth} from '@utils/auth';

const AuthRoute: FC<RouteProps> = (props) => {
    const {exact = false, path, children, render} = props;
    const match = useRouteMatch();
    const isLogin = hasAuth(); // // 不需要登录
    // if (!auth) {
    //   return <Route exact={exact}>{children}</Route>;
    // }

    if (isLogin) {
        //   已登录
        if (match.path === '/login') {
            return <Redirect to="/" />;
        }

        return (
            <Route path={path} exact={exact} render={render}>
                {children}
            </Route>
        );
    }

    return (
        <Redirect
            to={{
                pathname: '/login',
                state: {
                    from: match.path,
                },
            }}
        />
    );
};

AuthRoute.propTypes = {
    exact: PropTypes.bool,
    path: PropTypes.string.isRequired,
    children: PropTypes.node,
    render: PropTypes.func,
};
AuthRoute.defaultProps = {
    exact: false,
    children: null,
    render: () => null,
};
export default AuthRoute;
