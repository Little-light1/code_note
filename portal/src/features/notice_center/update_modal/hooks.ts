import {useCallback, useState} from 'react';
import {DICT_TYPES} from '@/common/constant';
import {CustomObject} from '@/common/types';

interface Props {
    dictTypeMap: CustomObject;
    dictTypeMapById: CustomObject;
    dictDataMapById: CustomObject;
}
export default function ({
    dictTypeMap,
    dictTypeMapById,
    dictDataMapById,
}: Props): any {
    const [internalSearchSelectTreeValue, setInternalSearchSelectTreeValue] =
        useState('');
    const [internalSelectedNode, setInternalSelectedNode] = useState(null);
    const [internalParentNode, setInternalParentNode] = useState(null);
    const [internalParentTypeNode, setInternalParentTypeNode] = useState(null);
    const initRelationship = useCallback(
        ({modalType, selectedNode, targetTypes}) => {
            let parentNode;
            let parentTypeNode; // 更新
            // selectedNode为目标对象, 通过它找到父级

            if (modalType === 'edit') {
                // 目标类型是分类 | 字典
                if (
                    targetTypes.includes(DICT_TYPES.class.key) ||
                    targetTypes.includes(DICT_TYPES.dict.key)
                ) {
                    const {parentKey} = selectedNode;
                    parentNode = dictTypeMap[parentKey];
                    parentTypeNode = dictTypeMap[parentKey];
                } // 目标类型是字典值
                else {
                    const {dicttypeId, dictdataParentid} = selectedNode; // 根字典没有dictdataParentid

                    if (typeof dictdataParentid !== 'undefined') {
                        parentNode = dictDataMapById[dictdataParentid];
                    } else {
                        parentNode = dictTypeMapById[dicttypeId];
                    }

                    parentTypeNode = dictTypeMapById[dicttypeId];
                }
            } else {
                // if (targetTypes.includes(DICT_TYPES.class.key) || targetTypes.includes(DICT_TYPES.dict.key)) {
                //   const {dicttypeId} = selectedNode;
                //   parentNode = selectedNode;
                //   parentTypeNode = dictTypeMapById[dicttypeId];
                // } else {
                parentNode = selectedNode;
                parentTypeNode = selectedNode; // }
            }

            setInternalSearchSelectTreeValue(parentNode && parentNode.title);
            setInternalParentNode(parentNode);
            setInternalParentTypeNode(parentTypeNode);
            setInternalSelectedNode(selectedNode);
        },
        [dictDataMapById, dictTypeMap, dictTypeMapById],
    );
    return {
        internalSelectedNode,
        internalParentNode,
        internalParentTypeNode,
        internalSearchSelectTreeValue,
        setInternalParentNode,
        setInternalParentTypeNode,
        setInternalSearchSelectTreeValue,
        initRelationship,
    };
}
