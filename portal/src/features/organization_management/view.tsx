/* eslint-disable no-nested-ternary */
import React, {FC, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {shallowEqual} from 'react-redux';
import {Col, Row, Button, Modal as AntdModal, Collapse, Spin} from 'antd';
import {
    EditOutlined,
    DeleteOutlined,
    PlusCircleOutlined,
    MinusCircleOutlined,
    PlusOutlined,
    CloseCircleFilled,
    CaretDownOutlined,
    RollbackOutlined,
} from '@ant-design/icons';
import {SearchTree} from '@components/tree';
import {
    useModal,
    useAction,
    usePage,
    PageProps,
    VirtualTable as Table,
} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {DICT_TYPES} from '@/common/constant';
import {staticColumns} from './constant';
import UpdateModal from './update_modal';
import DeviceModal from './device_modal';
import UserAssociate from './user_associate';
import {
    onInit,
    onTreeSelect,
    batchDelete,
    deleteCards,
    getOrgTemplateByOrgId,
    jumpTreeNode,
    downLoadTemplate,
    orgAjaxBox,
    exportOrgDetail,
    toggleDeviceTable, // 控制是否展示物理电场
    toggleUserTable, // 控制是否展示关联用户
    initModalData, // 设置弹框初始化数据
    fetchUserListByOrganizationWithName, // 获取用户信息
    initThingOrgTree, // 获取物理电场
    deleteBindDevice, // 删除设备
    backToFather, // 返回上一级
} from './actions';
import styles from './styles.module.scss';

const {Panel} = Collapse;
const UPDATE_MODAL_ID = 'orgUpdateModal';
const DEVICE_MODAL_ID = 'orgDeviceModal';
const USER_MODAL_ID = 'userRoleModal';

const OrganizationManagement: FC<any> = (props: PageProps) => {
    const {id} = props;
    const {
        dictTypeTree,
        expandedTreeKeys,
        selectedTreeNode,
        tableDataSource,
        isTableLoading,
        loading,
        // total,
        // pageSize,
        // page,
        // 组织机构管理
        orgInfo,
        // 是否展示物理电场
        deviceTableShow,
        // 是否展示用户列表
        userTableShow,
        // 用户列表数据
        userTableSource,
        orgSonList,
        sameLevelFlag,
    } = useAppSelector((state) => state[id], shallowEqual);
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const {openModal} = useModal();
    const {t} = useTranslation();
    const selectedTreeKeys = useMemo(
        () => (selectedTreeNode ? [selectedTreeNode.key] : []),
        [selectedTreeNode],
    ); // 获取props属性
    // 判断组织机构card是否展示
    let childrenShow: any = false;
    if (sameLevelFlag) {
        childrenShow = true;
    } else {
        if (
            orgInfo.platformOrganization &&
            Number(orgInfo.platformOrganization.type) !== 170
        ) {
            childrenShow = true;
        }
    }
    const {menu} = props;
    const columns = useMemo(
        () => [
            ...staticColumns,
            {
                title: t('操作'),
                dataIndex: 'operations',
                key: 'operations',
                width: 100,
                render: (text: any, record: any) => (
                    <div className={styles.operations}>
                        <DeleteOutlined
                            title={t('删除设备')}
                            onClick={() => {
                                AntdModal.confirm({
                                    title: t('确定要删除吗'),
                                    onOk: async () => {
                                        dispatch(
                                            deleteBindDevice(props, record),
                                        );
                                    },
                                });
                            }}
                        />
                    </div>
                ),
            },
        ],
        [dispatch, props, t],
    );
    const userColumns = [
        {
            title: t('用户账号'),
            dataIndex: 'loginName',
            key: 'loginName',
            ellipsis: true,
            width: 300,
            canResize: false,
            canHide: false,
            canDrag: false,
            canDrop: false,
        },
        {
            title: t('用户名称'),
            dataIndex: 'userName',
            key: 'userName',
            ellipsis: true,
            width: 300,
            canResize: false,
            canHide: false,
            canDrag: false,
            canDrop: false,
        },
        {
            title: t('所属组织机构'),
            dataIndex: 'organizationName',
            key: 'organizationName',
            ellipsis: true,
            width: 300,
            canResize: false,
            canHide: false,
            canDrag: false,
            canDrop: false,
        },
    ];
    let orgTypeName = '';

    if (orgInfo && orgInfo.businessOrganizationVO) {
        if (orgInfo.businessOrganizationVO.templateName) {
            orgTypeName = orgInfo.businessOrganizationVO.templateName;
        } else {
            orgTypeName = orgInfo.businessOrganizationVO.orgName;
        }
    }

    const constraintType = {
        0: t('不约束'),
        1: t('约束'),
    };
    usePage({...props, init: () => dispatch(onInit(props))});

    return (
        <>
            <Row className={styles.view}>
                <Col span={5} className={styles.leftTreeContainer}>
                    <div className={styles.leftTree}>
                        <SearchTree
                            placeholder={t('请输入')}
                            isShowSearch
                            treeData={dictTypeTree}
                            expandedKeys={expandedTreeKeys}
                            checkable={false}
                            selectedKeys={selectedTreeKeys}
                            onExpand={(keys: any[]) =>
                                dispatch(
                                    actions.set({
                                        expandedTreeKeys: keys,
                                    }),
                                )
                            } // eslint-disable-next-line react/no-unstable-nested-components
                            subTitleRender={(node) => (
                                <span className={styles.treeSubTitle}>
                                    {node.modifiable && node.isRight ? (
                                        <EditOutlined
                                            className={styles.icon}
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                dispatch(
                                                    actions.set({
                                                        selectedTreeNode: node,
                                                    }),
                                                ); // 1 获取模板
                                                setTimeout(() => {
                                                    dispatch(
                                                        getOrgTemplateByOrgId(
                                                            props,
                                                            'edit',
                                                        ),
                                                    ); // 2 渲染页面

                                                    dispatch(
                                                        orgAjaxBox(
                                                            props,
                                                            'edit',
                                                        ),
                                                    );

                                                    openModal(UPDATE_MODAL_ID, {
                                                        type: 'edit',
                                                        node,
                                                        targetType:
                                                            DICT_TYPES.class
                                                                .key,
                                                    });
                                                }, 500);
                                            }}
                                        />
                                    ) : null}
                                    {node.deletable && node.isRight ? (
                                        <MinusCircleOutlined
                                            className={styles.icon}
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                dispatch(
                                                    batchDelete(
                                                        props,
                                                        node,
                                                        DICT_TYPES.class.key,
                                                    ),
                                                );
                                            }}
                                        />
                                    ) : null}

                                    {node.addable && node.isRight ? (
                                        <PlusCircleOutlined
                                            className={styles.icon}
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                dispatch(
                                                    actions.set({
                                                        selectedTreeNode: node,
                                                    }),
                                                ); // 2 渲染页面

                                                dispatch(
                                                    orgAjaxBox(props, 'add'),
                                                );
                                                dispatch(
                                                    getOrgTemplateByOrgId(
                                                        props,
                                                        'add',
                                                    ),
                                                ); // setTimeout(() => {

                                                openModal(UPDATE_MODAL_ID, {
                                                    type: 'add',
                                                    node,
                                                    targetType:
                                                        DICT_TYPES.class.key,
                                                }); // }, 1500);
                                            }}
                                        />
                                    ) : null}
                                </span>
                            )}
                            onSelect={(keys, nodes) => {
                                dispatch(onTreeSelect(props, keys, nodes));
                            }}
                        />
                    </div>
                </Col>

                <Col
                    span={19}
                    className={`${styles.rightTable} ${styles.myCollapseArea}`}
                >
                    <div className={styles.actionBtnArea}>
                        {orgInfo.platformOrganization.parentID !== 0 &&
                            orgInfo.platformOrganization.parentID !== '0' && (
                                <div
                                    className={`${
                                        selectedTreeNode &&
                                        selectedTreeNode.isRight
                                            ? styles.actionBtn
                                            : styles.disableActionBtn
                                    }`}
                                    onClick={() => {
                                        if (
                                            selectedTreeNode &&
                                            selectedTreeNode.isRight
                                        ) {
                                            dispatch(
                                                backToFather(
                                                    props,
                                                    orgInfo.parentOrganization,
                                                ),
                                            );
                                        }
                                    }}
                                >
                                    <span>
                                        <RollbackOutlined />
                                    </span>
                                    <span className={styles.actionBtnName}>
                                        {t('返回上一级')}
                                    </span>
                                </div>
                            )}
                        {/* <Upload
            showUploadList={false}
            onChange={(e: any) => uploadOrgFile(props, e)}
            >
            <div className={styles.actionBtn}>
            <span>{t('common.importFile')}</span>
            </div>
            </Upload> */}
                        <div
                            className={`${
                                selectedTreeNode && selectedTreeNode.isRight
                                    ? styles.actionBtn
                                    : styles.disableActionBtn
                            }`}
                            onClick={() => {
                                if (
                                    selectedTreeNode &&
                                    selectedTreeNode.isRight
                                ) {
                                    dispatch(exportOrgDetail(props));
                                }
                            }} // 导出组织机构
                            action={{
                                id: 'exportOrg',
                                module: id,
                                position: [
                                    menu.menuName,
                                    t('导出组织机构数据'),
                                ],
                                action: 'export',
                                wait: true,
                            }}
                        >
                            <span>{t('导出组织机构数据')}</span>
                        </div>
                        <div
                            className={styles.actionBtn}
                            onClick={() => dispatch(downLoadTemplate(props))}
                            action={{
                                id: 'exportTemplate',
                                module: id,
                                position: [menu.menuName, t('模板下载')],
                                action: 'export',
                                wait: true,
                            }}
                        >
                            <span>{t('模板下载')}</span>
                        </div>
                        <div
                            className={`${
                                selectedTreeNode && selectedTreeNode.isRight
                                    ? styles.actionBtn
                                    : styles.disableActionBtn
                            }`}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                if (
                                    selectedTreeNode &&
                                    selectedTreeNode.isRight
                                ) {
                                    openModal(USER_MODAL_ID);
                                    dispatch(
                                        fetchUserListByOrganizationWithName(
                                            props,
                                            1,
                                        ),
                                    );
                                    dispatch(
                                        fetchUserListByOrganizationWithName(
                                            props,
                                            0,
                                        ),
                                    );
                                }
                            }}
                        >
                            <span>{t('绑定用户')}</span>
                        </div>
                    </div>
                    <Collapse
                        defaultActiveKey={['0', '1', '2', '3', '4']}
                        expandIconPosition="right"
                        destroyInactivePanel
                    >
                        <Panel
                            key="0"
                            header={
                                orgInfo.platformOrganization.parentID === 0
                                    ? orgInfo.platformOrganization.name
                                    : orgInfo.platformOrganization.name
                            }
                            forceRender
                        >
                            <div className={styles.orgInfoArea}>
                                <div
                                    className={`${styles.loadingArea} ${
                                        loading === false &&
                                        styles.loadingAreaHidden
                                    }`}
                                >
                                    <Spin spinning={loading} />
                                </div>
                                <div className={styles.orgInfoAreaHead}>
                                    <div className={styles.orgInfoAreaRow}>
                                        <span className={styles.infoTitle}>
                                            {t('上级组织架构')}
                                        </span>
                                        <span
                                            className={styles.infoValue}
                                            title={
                                                orgInfo.parentOrganization
                                                    ? orgInfo.parentOrganization
                                                          .name
                                                    : t('无')
                                            }
                                        >
                                            {orgInfo.platformOrganization
                                                .parentID === 0
                                                ? t('无')
                                                : orgInfo.parentOrganization
                                                ? orgInfo.parentOrganization
                                                      .name
                                                : t('无')}
                                        </span>
                                    </div>
                                    <div className={styles.orgInfoAreaRow}>
                                        <span className={styles.infoTitle}>
                                            {t('组织类型')}
                                        </span>
                                        <span
                                            className={styles.infoValue}
                                            title={orgTypeName}
                                        >
                                            {orgTypeName}
                                        </span>
                                    </div>
                                    {orgInfo.fieldList
                                        ? orgInfo.fieldList.map((obj: any) =>
                                              obj.fieldName !== undefined &&
                                              obj.fieldName !== '' &&
                                              Number(obj.fieldType) !== 1001 ? (
                                                  <div
                                                      className={
                                                          styles.orgInfoAreaRow
                                                      }
                                                  >
                                                      <span
                                                          className={
                                                              styles.infoTitle
                                                          }
                                                      >
                                                          {obj.fieldName}
                                                      </span>
                                                      <span
                                                          className={
                                                              styles.infoValue
                                                          }
                                                          key={obj.fieldName}
                                                          title={
                                                              Number(
                                                                  obj.fieldType,
                                                              ) === 1
                                                                  ? obj.fieldShowValue
                                                                  : Number(
                                                                        obj.fieldType,
                                                                    ) === 1001
                                                                  ? constraintType[
                                                                        obj
                                                                            .fieldValue
                                                                    ]
                                                                  : obj.fieldValue
                                                          }
                                                      >
                                                          {Number(
                                                              obj.fieldType,
                                                          ) === 1
                                                              ? obj.fieldShowValue
                                                              : Number(
                                                                    obj.fieldType,
                                                                ) === 1001
                                                              ? constraintType[
                                                                    obj
                                                                        .fieldValue
                                                                ]
                                                              : obj.fieldValue}
                                                      </span>
                                                  </div>
                                              ) : (
                                                  ''
                                              ),
                                          )
                                        : ''}
                                </div>
                                {orgInfo.platformOrganization &&
                                Number(orgInfo.platformOrganization.type) ===
                                    170 ? (
                                    <div className={styles.orgDevicePart}>
                                        <div
                                            className={styles.deviceTableTitle}
                                        >
                                            <div
                                                style={{
                                                    transform: deviceTableShow
                                                        ? 'rotate(0deg)'
                                                        : 'rotate(-90deg)',
                                                }}
                                                className={styles.btn}
                                            >
                                                <Button
                                                    id="organization_manage_caret_down"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        dispatch(
                                                            toggleDeviceTable(
                                                                props,
                                                                deviceTableShow,
                                                            ),
                                                        );
                                                    }}
                                                    icon={<CaretDownOutlined />}
                                                />
                                            </div>
                                            <div className={styles.Word}>
                                                {t('物理设备')}:
                                                {isTableLoading ? (
                                                    <Spin />
                                                ) : (
                                                    <>
                                                        （
                                                        {tableDataSource.length}
                                                        ）
                                                    </>
                                                )}
                                            </div>
                                            <div className={styles.btn}>
                                                <Button
                                                    disabled={
                                                        isTableLoading &&
                                                        selectedTreeNode.isRight
                                                    }
                                                    id="organization_manage_plus"
                                                    size="small"
                                                    icon={<PlusOutlined />}
                                                    onClick={(e: any) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        openModal(
                                                            DEVICE_MODAL_ID,
                                                            {
                                                                type: 'edit',
                                                            },
                                                        );
                                                        dispatch(
                                                            initModalData(
                                                                props,
                                                            ),
                                                        );
                                                        dispatch(
                                                            initThingOrgTree(
                                                                props,
                                                            ),
                                                        ); // 2 渲染页面
                                                        // dispatch(orgAjaxBox(props, 'add'));
                                                        // dispatch(getOrgTemplateByOrgId(props))
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {deviceTableShow && (
                                            <div
                                                className={
                                                    styles.deviceTableArea
                                                }
                                            >
                                                <Table
                                                    showIndex
                                                    columns={columns}
                                                    dataSource={tableDataSource}
                                                    loading={isTableLoading}
                                                    scroll={{
                                                        y: 300,
                                                    }} // height={400}
                                                    // width={500}
                                                    // itemKey={({data}) => data.deviceId}
                                                    // loading={isTableLoading}
                                                    // showIndex
                                                    // rowKey="deviceId"
                                                    // scroll={{y: '300px'}}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : null}

                                <div className={styles.orgDevicePart}>
                                    <div className={styles.deviceTableTitle}>
                                        <div
                                            style={{
                                                transform: userTableShow
                                                    ? 'rotate(0deg)'
                                                    : 'rotate(-90deg)',
                                            }}
                                            className={styles.btn}
                                        >
                                            <Button
                                                id="organization_manage_caret_down"
                                                size="small"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    dispatch(
                                                        toggleUserTable(
                                                            props,
                                                            userTableShow,
                                                        ),
                                                    );
                                                }}
                                                icon={<CaretDownOutlined />}
                                            />
                                        </div>
                                        <div className={styles.Word}>
                                            {t('绑定用户')}: （
                                            {userTableSource.length}）
                                        </div>
                                    </div>
                                    {userTableShow && (
                                        <div className={styles.deviceTableArea}>
                                            <Table // index={{width: 300}}
                                                columns={userColumns}
                                                dataSource={userTableSource}
                                                loading={isTableLoading}
                                                showIndex
                                                rowKey="id"
                                                scroll={{
                                                    y: '300px',
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Panel>
                        {childrenShow && (
                            <Panel
                                key="1"
                                header={t('下级组织机构')}
                                forceRender
                            >
                                <div className={styles.orgCardArea}>
                                    {
                                        orgSonList && orgSonList.length > 0
                                            ? orgSonList.map(
                                                  (
                                                      item: any,
                                                      index: number,
                                                  ) => (
                                                      <div
                                                          className={
                                                              styles.cardContent
                                                          }
                                                          key={item.id}
                                                          onClick={() =>
                                                              dispatch(
                                                                  jumpTreeNode(
                                                                      props,
                                                                      item,
                                                                  ),
                                                              )
                                                          }
                                                      >
                                                          <div
                                                              className={
                                                                  styles.cardLeft
                                                              }
                                                          >
                                                              <div
                                                                  className={
                                                                      styles.cardLeftIcon
                                                                  }
                                                              >
                                                                  <span
                                                                      className={`${
                                                                          styles.cardLeftIconSize
                                                                      } ${'portal-iconfont icon-portal-orgMark'}`}
                                                                  />
                                                              </div>
                                                          </div>
                                                          <div
                                                              className={
                                                                  styles.cardRight
                                                              }
                                                          >
                                                              <div
                                                                  className={
                                                                      styles.cardRightTitle
                                                                  }
                                                                  title={
                                                                      item.name
                                                                  }
                                                              >
                                                                  {item.name}
                                                              </div>
                                                              <div
                                                                  className={
                                                                      styles.cardRightNum
                                                                  }
                                                              >
                                                                  <span
                                                                      className={`${
                                                                          styles.backImg
                                                                      } ${'portal-iconfont icon-portal-org'}`}
                                                                  />
                                                                  {
                                                                      item.sonOrgNum
                                                                  }
                                                              </div>
                                                          </div>
                                                          {item.isRight ===
                                                          1 ? (
                                                              <div
                                                                  className={
                                                                      styles.cardDelete
                                                                  }
                                                                  onClick={(
                                                                      e,
                                                                  ) => {
                                                                      e.preventDefault();
                                                                      e.stopPropagation();
                                                                      dispatch(
                                                                          deleteCards(
                                                                              props,
                                                                              item,
                                                                              index,
                                                                          ),
                                                                      );
                                                                  }} // 查询组织机构数据
                                                                  action={{
                                                                      id: 'deleteOrg',
                                                                      module: id,
                                                                      position:
                                                                          [
                                                                              menu.menuName,
                                                                              t(
                                                                                  '删除',
                                                                              ),
                                                                              t(
                                                                                  '确定',
                                                                              ),
                                                                          ],
                                                                      action: 'delete',
                                                                      wait: true,
                                                                  }}
                                                              >
                                                                  <CloseCircleFilled
                                                                      id="organization_manage_delete_org"
                                                                      style={{
                                                                          color: 'red',
                                                                      }}
                                                                  />
                                                              </div>
                                                          ) : null}
                                                      </div>
                                                  ),
                                              )
                                            : null // selectedTreeNode.children.map((item: any, index: number) => (
                                        //     <div
                                        //         className={styles.cardContent}
                                        //         key={item.id}
                                        //         onClick={() => dispatch(jumpTreeNode(props, item))}
                                        //         // 查询组织机构数据
                                        //         action={{
                                        //             id: 'searchOrg',
                                        //             module: id,
                                        //             position: [props.menu.menuName, t('common.search')],
                                        //             action: 'query',
                                        //             wait: true,
                                        //         }}
                                        //     >
                                        //         <div className={styles.cardLeft}>
                                        //             <div className={styles.cardLeftIcon}>
                                        //                 <span
                                        //                     className={`${styles.cardLeftIconSize
                                        //                     } ${'portal-iconfont icon-portal-orgMark'}`}
                                        //                 />
                                        //             </div>
                                        //         </div>
                                        //         <div className={styles.cardRight}>
                                        //             <div className={styles.cardRightTitle} title={item.name}>
                                        //                 {item.name}
                                        //             </div>
                                        //             <div className={styles.cardRightNum}>
                                        //                 <span className={`${styles.backImg} ${'portal-iconfont icon-portal-org'}`} />
                                        //                 {item.children && item.children.length ? item.children.length : 0}
                                        //             </div>
                                        //         </div>
                                        //         {item.isRight &&
                                        //             <div
                                        //                 className={styles.cardDelete}
                                        //                 onClick={(e) => {
                                        //                     e.preventDefault();
                                        //                     e.stopPropagation();
                                        //                     dispatch(deleteCards(props, item, index));
                                        //                 }}>
                                        //                 <CloseCircleFilled id="organization_manage_delete_org" style={{ color: 'red' }} />
                                        //             </div>}
                                        //     </div>
                                        // ))
                                    }
                                    {orgInfo.platformOrganization &&
                                        orgInfo.platformOrganization.type !==
                                            170 && (
                                            <div className={styles.addCardArea}>
                                                <div
                                                    className={
                                                        styles.cardAddBtn
                                                    }
                                                    onClick={() => {
                                                        openModal(
                                                            UPDATE_MODAL_ID,
                                                            {
                                                                type: 'add',
                                                            },
                                                        ); // 2 渲染页面

                                                        dispatch(
                                                            orgAjaxBox(
                                                                props,
                                                                'add',
                                                            ),
                                                        );
                                                        dispatch(
                                                            getOrgTemplateByOrgId(
                                                                props,
                                                                'add',
                                                            ),
                                                        );
                                                    }}
                                                >
                                                    <span>
                                                        <PlusOutlined />
                                                    </span>
                                                    <span>{t('添加')}</span>
                                                </div>
                                            </div>
                                        )}
                                </div>
                            </Panel>
                        )}
                    </Collapse>
                </Col>
            </Row>

            <UpdateModal pageProps={props} modalId={UPDATE_MODAL_ID} />
            <DeviceModal pageProps={props} modalId={DEVICE_MODAL_ID} />
            <UserAssociate pageProps={props} modalId={USER_MODAL_ID} />
        </>
    );
};

export default OrganizationManagement;
