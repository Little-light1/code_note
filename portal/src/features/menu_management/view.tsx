/*
 * @Author: mikey.zhaopeng
 * @Date: 2021-12-01 16:38:15
 * @Last Modified by: selwyn.bishanwen
 * @Last Modified time: 2022-11-21 14:33:07
 */
import React, {FC, useMemo} from 'react';
import {shallowEqual} from 'react-redux';
import {Button, Tabs} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {Table} from '@components/table';
import {useTranslation} from 'react-i18next';
import {useModal, useAction, usePage, PageProps} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {Events} from '@common/events';
import MenuModal from './menu_modal';
import styles from './styles.module.scss';
import {onInit, changeSystem, refreshPage} from './actions';
import {MENU_MODAL_ID, dynamicColumns} from './constant';
import {LogActionID} from './types';

const {TabPane} = Tabs;

const MenuManagement: FC<any> = (props: PageProps) => {
    const {id} = props;
    const {tableDataSource, isLoading, currentTabKey, authProductList} =
        useAppSelector((state: {[x: string]: any}) => state[id], shallowEqual);
    // const subSystems = useAppSelector((state) => state.app.subSystems);
    const dispatch = useAppDispatch();
    const {openModal} = useModal();
    const {
        handlers: {trigger, register, deregister},
    } = useAction();
    const {t} = useTranslation();
    const columns = useMemo(
        () =>
            dynamicColumns({
                dispatch,
                openModal,
                props,
                t,
                trigger,
            }),
        [dispatch, trigger, openModal, props, t], // 依赖没发生变化时columns不会重新渲染
    );
    usePage({
        ...props,
        init: (pageProps) => {
            dispatch(onInit(pageProps));
            register(
                'portal_menuManagement_refresh_page',
                () => dispatch(refreshPage(props)),
                Events.refresh_menu_manager,
            );
        },
        close: () => {
            deregister(
                'portal_menuManagement_refresh_page',
                Events.refresh_menu_manager,
            );
        },
    });
    return (
        <div className={styles.view}>
            <Tabs
                activeKey={currentTabKey}
                type="card"
                onChange={(key: string) => {
                    dispatch(changeSystem(props, key));
                }}
            >
                {authProductList.map((system: any) => (
                    <TabPane tab={system.name} key={system.code} />
                ))}
            </Tabs>

            <div className={styles.control}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    action={{
                        id: LogActionID.Add,
                        module: id,
                        position: [
                            props.menu?.menuName ?? '',
                            t('新建'),
                            t('保存'),
                        ],
                        action: 'add',
                        wait: true,
                    }}
                    onClick={() =>
                        openModal(MENU_MODAL_ID, {
                            type: 'add',
                        })
                    }
                >
                    {/* 新建 */}
                    {t('新建')}
                </Button>

                {/* 菜单模态窗口 */}
                <MenuModal modalId={MENU_MODAL_ID} pageProps={props} />
            </div>

            <Table
                columns={columns}
                dataSource={tableDataSource}
                loading={isLoading}
                showIndex
                rowKey="menuId"
                indexWidth={100}
            />
        </div>
    );
};

export default MenuManagement;
