/*
 * @Descripttion:
 * @Author: gxn
 * @Date: 2023-05-16 11:50:09
 */
import React from 'react';
import {DICT_TYPES} from '@common/constant';
import {Col, Form, Input, Row, Switch, InputNumber} from 'antd';
import {i18nIns} from '@/app/i18n';

const {t} = i18nIns;

/**
 * 获取当前类型下允许设置的字典类型
 * @param param0
 * @returns
 */

export function getEnableTypes(targetType: 0 | 1) {
    const enableTypes: any[] = [];

    if (targetType === DICT_TYPES.class.key) {
        enableTypes.push(DICT_TYPES.class);
    }

    if (targetType === DICT_TYPES.dict.key) {
        enableTypes.push(DICT_TYPES.dict);
    }

    return enableTypes;
}
export function renderTypeRow({currentType}: {currentType: number}) {
    if (currentType === DICT_TYPES.class.key) {
        return (
            <>
                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="dicttypeCode"
                            label={t('分类编码')}
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={11} offset={1}>
                        <Form.Item
                            name="dicttypeName"
                            label={t('分类名称')}
                            rules={[
                                {
                                    required: true,
                                    message: t('请输入'),
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col span={11}>
                        <Form.Item
                            name="dicttypeIsenabled"
                            label={t('状态')}
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                            valuePropName="checked"
                        >
                            <Switch
                                checkedChildren={t('启用')}
                                unCheckedChildren={t('禁用')}
                                defaultChecked
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </>
        );
    }

    return (
        <>
            <Row>
                <Col span={11}>
                    <Form.Item
                        name="dictdataCode"
                        label={t('字典编码')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    <Form.Item
                        name="dictdataName"
                        label={t('字典名称')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    <Form.Item
                        name="dictdataSort"
                        label={t('顺序')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                        ]}
                    >
                        <InputNumber />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    <Form.Item
                        name="dictdataIsenabled"
                        label={t('状态')}
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={t('启用')}
                            unCheckedChildren={t('禁用')}
                            defaultChecked
                        />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    <Form.Item name="dictdataMark" label={t('标识')}>
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item name="dictdataDesc" label={t('描述')}>
                        <Input.TextArea />
                    </Form.Item>
                </Col>
            </Row>
        </>
    );
}
/**
 * 循环查找到上层分类
 * @param parentTreeKey
 * @param dictTypeMap
 * @returns
 */

export function loopSearchDictType(
    parentTreeKey: string,
    dictTypeMap: {
        [key: string]: any;
    },
): null | any {
    const parent = dictTypeMap[parentTreeKey];

    if (parent) {
        if (parent.type === DICT_TYPES.class.key) {
            return parent;
        }

        return loopSearchDictType(parent.parentTreeKey, dictTypeMap);
    }

    return null;
}
const ruleHandlers = {
    // 可选类规则
    [DICT_TYPES.class.key]: (item: any) => ({
        disabled: !!item.children,
        ...item,
    }),
    // 可选字典规则
    [DICT_TYPES.dict.key]: (item: any) => ({
        disabled: !!item.hasDataChild,
        ...item,
    }),
};
/**
 * 循环设置可选
 * @param treeData
 * @returns
 */

export function loopSelectableTree(
    treeData: any,
    internalParentNode: any | null,
) {
    return treeData.map((item: any) => {
        const {children, type} = item;
        const newItem = ruleHandlers[type](item); // self

        if (internalParentNode && internalParentNode.key === newItem.key) {
            newItem.disabled = true;
        }

        if (children) {
            newItem.children = loopSelectableTree(
                newItem.children,
                internalParentNode,
            );
        }

        return newItem;
    });
}
