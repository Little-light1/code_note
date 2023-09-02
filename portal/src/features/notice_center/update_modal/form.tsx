import React, {
    MutableRefObject,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {shallowEqual} from 'react-redux';
import {Form, FormInstance} from 'antd';
import {useTranslation} from 'react-i18next';
import {useModal, PageContext} from '@gwaapp/ease';
import {useAppDispatch, useAppSelector} from '@/app/runtime';
import {DICT_TYPES} from '@/common/constant';
import useInternalInitialize from './hooks';
import {submit} from './actions';
import {
    getEnableTypes,
    formItemsRender,
    loopSelectableTree,
    CreateAbleTypes,
} from './helper';
import styles from './styles.module.scss';

interface CustomFormProps {
    selectedNode: null | any;
    formRef: MutableRefObject<FormInstance<any> | null>;
    modalId: string;
    modalType: 'add' | 'edit'; // 模态窗口类型

    targetTypes: CreateAbleTypes[]; // 要添加的对象

    selectedNodeType?: number; // 父类型 0 | 1;
}

const DataDictForm = ({
    selectedNode,
    formRef,
    modalId,
    modalType,
    targetTypes,
    selectedNodeType = DICT_TYPES.class.key,
}: CustomFormProps) => {
    const pageProps = useContext(PageContext);
    const {id} = pageProps;
    const [currentType, setCurrentType] = useState<CreateAbleTypes | null>(
        targetTypes && targetTypes.length ? targetTypes[0] : null,
    );
    const [enableTypes, setEnableTypes] = useState<any[]>([]);
    const {t} = useTranslation();
    const dispatch = useAppDispatch();
    const {closeModal} = useModal();
    const {dictTypeTree, dictTypeMap, dictTypeMapById, dictDataMapById} =
        useAppSelector((state) => state[id], shallowEqual);
    const {
        internalSelectedNode,
        internalParentNode,
        internalParentTypeNode,
        internalSearchSelectTreeValue,
        setInternalParentNode,
        setInternalParentTypeNode,
        setInternalSearchSelectTreeValue,
        initRelationship,
    } = useInternalInitialize({
        dictTypeMap,
        dictTypeMapById,
        dictDataMapById,
    });
    const selectableTree = useMemo(
        () => loopSelectableTree(dictTypeTree, currentType),
        [dictTypeTree, currentType],
    ); // 初始化内部父子关系

    useEffect(() => {
        initRelationship({
            modalType,
            selectedNode,
            targetTypes,
            selectedNodeType,
        });
    }, [
        initRelationship,
        modalType,
        selectedNodeType,
        selectedNode,
        targetTypes,
    ]); // 初始化选择状态

    useEffect(() => {
        if (typeof selectedNode === 'undefined') {
            return;
        }

        let fields: {
            [key: string]: any;
        } = {}; // 初始化当前可创建类型

        const enableTypesTemp = getEnableTypes(targetTypes);
        setEnableTypes(enableTypesTemp); // 初始化默认选择创建类型

        if (enableTypesTemp.length) {
            setCurrentType(enableTypesTemp[0].key);
            fields.dictType = enableTypesTemp[0].key;
        } // 初始化父节点

        if (internalParentNode) {
            fields.parentId = [internalParentNode.key];
        } // 初始化修改状态下的form表单

        if (modalType === 'edit') {
            if (
                selectedNode.type === DICT_TYPES.class.key ||
                selectedNode.type === DICT_TYPES.dict.key
            ) {
                const {
                    dicttypeCode,
                    dicttypeName,
                    dicttypeDesc,
                    dicttypeIsenabled,
                } = selectedNode;
                fields = {
                    ...fields,
                    dicttypeCode,
                    dicttypeName,
                    dicttypeIsenabled: !!dicttypeIsenabled,
                    dicttypeDesc,
                };
            } else {
                const {
                    dictdataCode,
                    dictdataDesc,
                    dictdataIsenabled,
                    dictdataName,
                    dictdataValue,
                    dictdataMark,
                    dictdataSort,
                } = selectedNode;
                fields = {
                    ...fields,
                    dictdataCode,
                    dictdataName,
                    dictdataSort,
                    dictdataMark,
                    dictdataDesc,
                    dictdataValue,
                    dictdataIsenabled: !!dictdataIsenabled,
                };
            }
        }

        formRef.current && formRef.current.setFieldsValue(fields);
    }, [
        targetTypes,
        internalSelectedNode,
        internalParentNode,
        internalParentTypeNode,
        selectedNode,
        modalType,
        formRef,
    ]);

    if (selectedNode === null) {
        return null;
    } // const isDictDataInDictData = targetType === DICT_TYPES.item.key && internalParentNode && internalParentNode.type === DICT_TYPES.item.key;
    // 100版本下不存在字典下新建字典场景, 新建按钮默认就是字典项

    return (
        <div className={`${styles.view}`}>
            <Form
                ref={formRef}
                name="data_dict_config_update_modal"
                initialValues={{
                    dicttypeIsenabled: true,
                    dictdataIsenabled: true,
                }}
                onFinish={(values) => {
                    const {parentId, dictType, ...submitValues} = values; // const [onlyParentId] = parentId;

                    dispatch(
                        submit({
                            pageProps,
                            values: submitValues,
                            currentType,
                            modalType,
                            selectedNode,
                            selectedNodeType,
                            parentNode: internalParentNode,
                            parentTypeNode: internalParentTypeNode,
                        }),
                    ).then(() => closeModal(modalId));
                }}
                onValuesChange={(changedValues: {[key: string]: any}) => {
                    changedValues.hasOwnProperty('dictType') &&
                        setCurrentType(changedValues.dictType); // 如果父发生变化, 需要重新计算可创建类型
                    // changedValues.hasOwnProperty('parentId') &&
                }}
            >
                {formItemsRender[currentType] &&
                    formItemsRender[currentType]({
                        enableTypes,
                        selectableTree,
                        internalSearchSelectTreeValue,
                        setInternalParentNode,
                        setInternalParentTypeNode,
                        setInternalSearchSelectTreeValue,
                        t,
                    })}
            </Form>
        </div>
    );
};

export default DataDictForm;
