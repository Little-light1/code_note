import React, {useCallback} from 'react';
import {CaretDownOutlined} from '@ant-design/icons';
import {Dropdown, Menu} from 'antd';
import {Link} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {shallowEqual} from 'react-redux';
import styles from './styles.module.scss';
import {changeSystem, getOtherSystemUrlFun} from './actions';

const SystemMenus = () => {
    const dispatch = useAppDispatch();
    const {flatMenuMapByPath, subSystems, currentSubSystem} = useAppSelector(
        (state) => state.app,
        shallowEqual,
    );
    const onSystemChange = useCallback(
        ({key}) => {
            // 获取外部应用
            const otherAppArr: string[] = subSystems
                .filter(
                    (item: Record<string, any>) =>
                        item.gwFlag.value !== 0 && item.piUrl,
                )
                .map((k: {code: string}) => k.code);
            // 判断是不是外部应用
            if (otherAppArr.includes(key)) {
                // 获取当前点击的应用id
                const otherAppId: string = subSystems
                    .filter((item: Record<string, any>) => item.code === key)
                    .map((k: {id: string}) => k.id)
                    .join('');
                dispatch(getOtherSystemUrlFun(otherAppId));
                return;
            }
            dispatch(changeSystem(key));
        },
        [dispatch, subSystems],
    );
    return (
        <Dropdown
            overlay={
                <Menu onClick={onSystemChange}>
                    {subSystems
                        .filter(({visible}: any) => visible)
                        .map(({code, name, path, gwFlag, piUrl}: any) => {
                            // 配置首页 & 有菜单权限，若无ip地址，且路由存在，则无论第三方还是内部应用都在内部打开
                            if (
                                gwFlag &&
                                !piUrl &&
                                path &&
                                flatMenuMapByPath[path]
                            ) {
                                return (
                                    <Menu.Item key={code} title={name}>
                                        <Link to={path}>{name}</Link>
                                    </Menu.Item>
                                );
                            }

                            return (
                                <Menu.Item key={code} title={name}>
                                    {name}
                                </Menu.Item>
                            );
                        })}
                </Menu>
            }
        >
            <span className={styles.choice}>
                {currentSubSystem?.name ?? ''}
                <CaretDownOutlined className={styles.smallIcon} />
            </span>
        </Dropdown>
    );
};

export default SystemMenus;
