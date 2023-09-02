/*
 * @Author: Tomato.Bei
 * @Date: 2022-10-08 15:04:12
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-11-18 18:12:26
 */
import React, {FC, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {shallowEqual} from 'react-redux';
import {Col, Row} from 'antd';
import {PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {changeSystem, getOtherSystemUrlFun} from './actions';
import SystemBlock from './system_block/view';

const Component: FC<PageProps> = (props) => {
    const {subSystems, flatMenuMapByPath} = useAppSelector((state) => state.app, shallowEqual);
    const dispatch = useAppDispatch();
    const onSystemChange = useCallback(
        (system) => {
            const {code} = system;

            // 获取外部应用
            const otherAppArr: string[] = subSystems
                .filter((item: Record<string, any>) => item.gwFlag.value !== 0 && item.piUrl)
                .map((k: {code: string}) => k.code);

            // 是否为外部应用
            if (otherAppArr.includes(code)) {
                // 获取当前点击的应用id
                const otherAppId: string = subSystems
                    .filter((item: Record<string, any>) => item.code === code)
                    .map((k: {id: string}) => k.id)
                    .join('');

                dispatch(getOtherSystemUrlFun(otherAppId));
                return;
            }

            dispatch(changeSystem(code));
        },

        [dispatch, subSystems],
    );

    return (
        <div style={{padding: '2% 0 2% 3%', boxSizing: 'border-box'}}>
            <Row justify="center" align="middle" style={{height: '100%'}}>
                {subSystems
                    .filter(({visible}: any) => visible)
                    .map((system: any) => {
                        const {code, name, path, gwFlag, piPicture, piUrl} = system;

                        // 是否配置首页 & 有菜单权限
                        if (gwFlag && !piUrl && path && flatMenuMapByPath[path]) {
                            return (
                                <Col
                                    span={6}
                                    offset={1}
                                    pull={1}
                                    style={{height: '30%',  marginTop: '1%', marginBottom: '1%'}}
                                    onClick={() => onSystemChange(system)}
                                    key={code}>
                                    {path ? (
                                        <Link to={path}>
                                            <SystemBlock name={name} key={code} token={piPicture} />
                                        </Link>
                                    ) : (
                                        <SystemBlock name={name} key={code} token={piPicture} />
                                    )}
                                </Col>
                            );
                        }

                        return (
                            <Col
                                span={6}
                                offset={1}
                                pull={1}
                                style={{height: '30%',  marginTop: '1%', marginBottom: '1%'}}
                                onClick={() => onSystemChange(system)}
                                key={code}>
                                <SystemBlock name={name} key={code} token={piPicture} />
                            </Col>
                        );
                    })}
            </Row>
        </div>
    );
};

export default Component;
