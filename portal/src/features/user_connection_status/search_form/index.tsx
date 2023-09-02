import React, {FC, useRef} from 'react';
import {shallowEqual} from 'react-redux';
import {getUniqueKey, useAction} from '@gwaapp/ease';
import {Form, Select, Input, Button, TreeSelect, FormInstance} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {useTranslation} from 'react-i18next';
import styles from '../styles.module.scss';
import {LogActionID, SearchBarItemName} from '../types';
import {getConnectionStatusValues} from '../constants';
import {handleSearch} from '../actions';

const SearchForm: FC<any> = ({props}) => {
    const {id} = props;
    const dispatch = useAppDispatch();
    const {getPageSimpleActions} = useAction();
    const actions = getPageSimpleActions(id);
    const formRef = useRef<FormInstance>(null); // 获取状态树中的数据
    const {t} = useTranslation();

    const {orgId, userAccount, username, connectionStatus, orgList} =
        useAppSelector((state) => state[getUniqueKey(id)], shallowEqual); // form初始值

    const initialData = {
        [SearchBarItemName.Organization]: orgId,
        [SearchBarItemName.UserAccount]: userAccount,
        [SearchBarItemName.Username]: username,
        [SearchBarItemName.ConnectionStatus]: connectionStatus,
    };
    /**
     * 所属组织机构变更事件
     * @param value 当前选择的组织机构id
     */

    const onOrganizationChange = (value: any) => {
        dispatch(
            actions.set({
                orgId: value,
            }),
        );
    }; // 用户账号变更事件

    const onUserAccountChange = (event: any) => {
        const inputValue = event.target.value;
        dispatch(
            actions.set({
                userAccount: inputValue,
            }),
        );
    }; // 用户名称变更事件

    const onUsernameChange = (event: any) => {
        const inputValue = event.target.value;
        dispatch(
            actions.set({
                username: inputValue,
            }),
        );
    };
    /**
     * 连接状态变更事件
     * @param value 当前选择的状态
     */

    const onConnectStatusChange = (value: any) => {
        dispatch(
            actions.set({
                connectionStatus: value,
            }),
        );
    }; // 搜索按钮点击事件

    const onSearch = () => {
        dispatch(
            actions.set({
                pageNum: 1,
            }),
        );

        formRef.current &&
            formRef.current.validateFields().then(() => {
                dispatch(handleSearch(props));
            });
    };

    return (
        <div className={styles.searchBar}>
            <Form
                ref={formRef}
                layout="inline"
                initialValues={initialData}
                requiredMark={false}
            >
                {/* 所属组织机构 */}
                <Form.Item
                    name={SearchBarItemName.Organization}
                    label={t('所属组织机构')}
                    rules={[
                        {
                            required: true,
                            message: t('请选择组织机构'),
                        },
                    ]}
                >
                    <TreeSelect
                        treeData={orgList}
                        maxTagCount={0}
                        placeholder={t('请选择')}
                        dropdownStyle={{
                            minWidth: '380px',
                            height: '420px',
                            background: 'rgba(15, 42, 59, 0.9)',
                        }}
                        listHeight={400}
                        style={{
                            minWidth: '155px',
                        }}
                        onChange={onOrganizationChange}
                        fieldNames={{
                            label: 'name',
                            value: 'id',
                        }}
                    />
                </Form.Item>
                {/* 用户账号 */}
                <Form.Item
                    name={SearchBarItemName.UserAccount}
                    label={t('用户账号')}
                >
                    <Input
                        placeholder={t('请输入')}
                        maxLength={50}
                        onChange={onUserAccountChange}
                    />
                </Form.Item>
                {/* 用户名称 */}
                <Form.Item
                    name={SearchBarItemName.Username}
                    label={t('用户名称')}
                >
                    <Input
                        placeholder={t('请输入')}
                        maxLength={50}
                        onChange={onUsernameChange}
                    />
                </Form.Item>
                {/* 连接状态 */}
                <Form.Item
                    name={SearchBarItemName.ConnectionStatus}
                    label={t('连接状态')}
                >
                    <Select
                        onChange={onConnectStatusChange}
                        style={{
                            minWidth: '100px',
                            marginRight: '10px',
                        }}
                    >
                        {getConnectionStatusValues().map((item) => (
                            <Select.Option value={item.key} key={item.key}>
                                {item.title}
                            </Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                {/* 查询按钮 */}
                <Button
                    action={{
                        id: LogActionID.Query,
                        module: id,
                        position: [props.menu?.menuName ?? '', t('查询')],
                        action: 'query',
                        wait: true,
                    }}
                    type="primary"
                    onClick={onSearch}
                    icon={<SearchOutlined />}
                >
                    {t('查询')}
                </Button>
            </Form>
        </div>
    );
};

export default SearchForm;
