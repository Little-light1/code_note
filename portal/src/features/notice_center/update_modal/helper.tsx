import React from 'react';
import {DICT_TYPES} from '@common/constant';
import {Col, Form, Input, Row, Select, Switch} from 'antd';
import SortInput from '@/components/sort_input';
import {SearchTreeSelect} from '@/components/tree';
import {onlyNoEnUnder, onlyEnNo, onlyCnEnNo} from '@/common/utils/reg';

export type CreateAbleTypes = 0 | 1 | 2;
/**
 * 获取当前类型下允许设置的字典类型
 * @param param0
 * @returns
 */

export function getEnableTypes(targetTypes: CreateAbleTypes[]) {
    const enableTypes: any[] = [];
    targetTypes.forEach((typeKey) => {
        const found = Object.values(DICT_TYPES).find(
            ({key}) => key === typeKey,
        );

        if (found) {
            enableTypes.push(found);
        }
    });
    return enableTypes;
} // 目录通用render

const catalogRender = ({
    enableTypes,
    selectableTree,
    internalSearchSelectTreeValue,
    setInternalParentNode,
    setInternalParentTypeNode,
    setInternalSearchSelectTreeValue,
    t,
}: any) => (
    <Row>
        <Col span={11}>
            {/* 上级分类 */}
            <Form.Item
                name="parentId"
                label={t('上级分类')}
                rules={[
                    {
                        required: true,
                    },
                ]}
                trigger="onSelect"
                valuePropName="selectedKeys"
            >
                <SearchTreeSelect
                    treeData={selectableTree}
                    checkable={false}
                    value={internalSearchSelectTreeValue}
                    onSelect={(selectedKeys, selectedNodes: any[]) => {
                        const [node] = selectedNodes;
                        if (!node) return;
                        setInternalParentNode(node); // 这里的数据源只有分类

                        setInternalParentTypeNode(node);
                        setInternalSearchSelectTreeValue(node.title);
                    }}
                />
            </Form.Item>
        </Col>
        <Col span={11} offset={1}>
            {/* 新建类型 */}
            <Form.Item
                name="dictType"
                label={t('新建类型')}
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Select>
                    {enableTypes.map(({key, title}) => (
                        <Select.Option key={key} value={key}>
                            {title}
                        </Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </Col>
    </Row>
);

export const formItemsRender = {
    0: ({
        enableTypes,
        selectableTree,
        internalSearchSelectTreeValue,
        setInternalParentNode,
        setInternalParentTypeNode,
        setInternalSearchSelectTreeValue,
        t,
    }: any) => (
        <>
            {/* 通用items */}
            {catalogRender({
                enableTypes,
                selectableTree,
                internalSearchSelectTreeValue,
                setInternalParentNode,
                setInternalParentTypeNode,
                setInternalSearchSelectTreeValue,
                t,
            })}

            <Row>
                <Col span={11}>
                    {/* 分类编码 */}
                    <Form.Item
                        name="dicttypeCode"
                        label={t('分类编码')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyNoEnUnder,
                                message: `${t('请输入英文，数字或下划线')}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 分类名称 */}
                    <Form.Item
                        name="dicttypeName"
                        label={t('分类名称')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyCnEnNo,
                                message: `${t(
                                    '请输入中文，英文，数字或其组合',
                                )}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    ),
    1: ({
        enableTypes,
        selectableTree,
        internalSearchSelectTreeValue,
        setInternalParentNode,
        setInternalParentTypeNode,
        setInternalSearchSelectTreeValue,
        t,
    }: any) => (
        <>
            {/* 通用items */}
            {catalogRender({
                enableTypes,
                selectableTree,
                internalSearchSelectTreeValue,
                setInternalParentNode,
                setInternalParentTypeNode,
                setInternalSearchSelectTreeValue,
                t,
            })}

            <Row>
                <Col span={11}>
                    {/* 字典编码 */}
                    <Form.Item
                        name="dicttypeCode"
                        label={t('字典编码')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyNoEnUnder,
                                message: `${t('请输入英文，数字或下划线')}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 字典名称 */}
                    <Form.Item
                        name="dicttypeName"
                        label={t('字典名称')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyCnEnNo,
                                message: `${t(
                                    '请输入中文，英文，数字或其组合',
                                )}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={11}>
                    {/* 字典描述 */}
                    <Form.Item name="dicttypeDesc" label={t('字典描述')}>
                        <Input.TextArea maxLength={50} />
                    </Form.Item>
                </Col>

                <Col span={11} offset={1}>
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
    ),
    2: ({t}) => (
        <>
            <Row>
                <Col span={11}>
                    {/* 字典编码 */}
                    <Form.Item
                        name="dictdataCode"
                        label={t('字典编码')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyNoEnUnder,
                                message: `${t('请输入英文，数字或下划线')}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
                <Col span={11} offset={1}>
                    {/* 字典名称 */}
                    <Form.Item
                        name="dictdataName"
                        label={t('字典名称')}
                        rules={[
                            {
                                required: true,
                                message: t('请输入'),
                            },
                            {
                                pattern: onlyCnEnNo,
                                message: `${t(
                                    '请输入中文，英文，数字或其组合',
                                )}`,
                            },
                        ]}
                    >
                        <Input maxLength={50} />
                    </Form.Item>
                </Col>
            </Row>
            <Row>
                <Col span={11}>
                    {/* 字典值 */}
                    <Form.Item name="dictdataValue" label={t('字典项值')}>
                        <SortInput />
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
                        <SortInput />
                    </Form.Item>
                </Col>
                {/* <Col span={11} offset={1}>
        <Form.Item name="dictdataMark" label={t('common.logo')} style={{ marginLeft: '12px' }}
        rules={[
        {
        pattern: onlyNoEnUnder,
        message: `${t('common.onlyNoEnUnder')}`,
        }
        ]}>
        <Input maxLength={50}  />
        </Form.Item>
        </Col> */}
            </Row>
            <Row>
                <Col span={24}>
                    <Form.Item name="dictdataDesc" label={t('描述')}>
                        <Input.TextArea
                            style={{
                                width: '96%',
                            }}
                            maxLength={50}
                        />
                    </Form.Item>
                </Col>
            </Row>
        </>
    ),
};
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
/**
 * 循环设置可选(分类 / 字典)
 * @param treeData
 * @returns
 */

export function loopSelectableTree(
    treeData: any[],
    currentType: 0 | 1,
    value?: boolean,
) {
    // 只处理分类和字典场景
    if (
        currentType !== DICT_TYPES.class.key &&
        currentType !== DICT_TYPES.dict.key
    ) {
        return [];
    }

    return treeData.map((item: any) => {
        const {children, type} = item;
        const newItem = {...item};

        if (typeof value !== 'undefined') {
            newItem.disabled = value;

            if (children) {
                newItem.children = loopSelectableTree(
                    children,
                    currentType,
                    value,
                );
            }

            return newItem;
        } // 当前创建字典类(1. 当前节点不能是字典, 字典及后续都不需要处理)

        if (currentType === DICT_TYPES.class.key) {
            // 当前节点需要是分类, 子不得有字典
            const haveDictInChildren = children
                ? !!children.find(
                      (cItem: any) => cItem.type === DICT_TYPES.dict.key,
                  )
                : false;
            const isClass = type === DICT_TYPES.class.key; // 子中已经存在字典项, 不可被作为父被选中

            if (!isClass || haveDictInChildren) {
                // 循环设置子为不可选中
                if (newItem.children) {
                    newItem.children = loopSelectableTree(
                        children,
                        currentType,
                        true,
                    );
                }

                newItem.disabled = true;
            } else {
                newItem.disabled = false;

                if (newItem.children) {
                    newItem.children = loopSelectableTree(
                        children,
                        currentType,
                    );
                }
            }
        } // 当前创建字典
        else if (currentType === DICT_TYPES.dict.key) {
            //
            const haveChildrenOrChildrenAllDict = children
                ? children.filter(
                      (cItem: any) => cItem.type === DICT_TYPES.dict.key,
                  ).length === children.length
                : false;

            if (haveChildrenOrChildrenAllDict) {
                newItem.disabled = false;
            } else {
                newItem.disabled = true;
            }

            if (newItem.children) {
                newItem.children = loopSelectableTree(children, currentType);
            }
        } // 其它场景下不做处理
        else {
            return [];
        }

        return newItem;
    });
}
