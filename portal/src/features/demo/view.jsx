/*
 * @Author: zhangzhen
 * @Date: 2022-09-07 09:37:01
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-09-19 14:47:17
 *
 */
import React from 'react';
import {Route, Link} from 'react-router-dom';
import {useAction} from '@gwaapp/ease';

const Demo = () => {
    const {history} = useAction();
    const {subRoutes} = history.routeDict.demo;
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0 5px',
                }}
            >
                {subRoutes.map(({title, path}) => (
                    <Link
                        key={path}
                        to={path}
                        style={{
                            margin: '5px 0',
                        }}
                    >
                        {title}
                    </Link>
                ))}
            </div>
            <div
                style={{
                    flex: 1,
                }}
            >
                <Route>
                    {subRoutes.map((route) => (
                        <Route
                            path={route.path}
                            key={route.key}
                            exact={route.exact}
                            component={route.component}
                        />
                    ))}
                </Route>
            </div>
        </div>
    );
};

export default Demo;
