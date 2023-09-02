import {DICT_TYPES} from '@common/constant';
import {
    updateDictClass,
    updateDictItem,
    addDictClass,
    addDictItem,
} from '@services/data_dict_config';
import {boolean2Int} from '@utils/boolean';
import {logError} from '@/common/utils/clientAction';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {initDictTypeTree} from '../actions';

interface Props {
    pageProps: PageProps;
    values: Record<string, any>;
    modalType: 'add' | 'edit';
    currentType: number;
    selectedNode: any;
    selectedNodeType: number;
    parentNode: any;
    parentTypeNode: any;
}
/**
 * 提交保存
 * @param id
 * @param values
 * @returns
 */

export const submit =
    (props: Props): AppThunk<Promise<boolean>> =>
    (dispatch) =>
        new Promise((resolve, reject) => {
            const {
                pageProps,
                values,
                selectedNode,
                selectedNodeType,
                modalType,
                currentType,
                parentNode,
                parentTypeNode,
            } = props;
            let service: ((props: any) => Promise<any>) | null = null;
            let submitValues = {...values};
            if (!parentNode) return;

            if (modalType === 'add') {
                // 字典值
                if (currentType === DICT_TYPES.item.key) {
                    service = addDictItem;
                    submitValues = {
                        ...submitValues,
                        dictdataIsenabled: boolean2Int(
                            values.dictdataIsenabled,
                        ),
                        dicttypeId: parentTypeNode.dicttypeId,
                    }; // 根字典不要追加parentid, 只有字典下挂字典才需要

                    if (parentNode.type === DICT_TYPES.item.key) {
                        submitValues.dictdataParentid = parentNode.dictdataId;
                    }
                } // 分类 | 字典
                else {
                    service = addDictClass; // 将是否启用转成number类型

                    submitValues = {
                        ...submitValues,
                        dicttypeIsenabled: boolean2Int(
                            values.dicttypeIsenabled || true,
                        ),
                        dicttypeParentid: parentTypeNode.dicttypeId,
                        dicttypeKind: currentType,
                    };
                }
            } else {
                // 字典
                if (selectedNodeType === DICT_TYPES.item.key) {
                    service = updateDictItem;
                    submitValues.dictdataId = selectedNode.dictdataId; // 如果父级变更, 这里只存在调整分类的情况, 如果需要调整父节点是字典, 那需要多传dictdataParentid

                    if (parentTypeNode.dicttypeId !== selectedNode.dicttypeId) {
                        submitValues.dicttypeId = parentTypeNode.dicttypeId;
                    } // 处理

                    submitValues.dictdataIsenabled = boolean2Int(
                        submitValues.dictdataIsenabled,
                    );
                } // 分类
                else {
                    service = updateDictClass;
                    submitValues.dicttypeId = selectedNode.dicttypeId; // 如果父级变更

                    if (parentNode.key !== selectedNode.parentKey) {
                        submitValues.dicttypeParentid = parentNode.dicttypeId;
                    }

                    submitValues.dicttypeIsenabled = boolean2Int(
                        submitValues.dicttypeIsenabled || true,
                    );
                }
            }

            service(submitValues)
                .then(({data, code, msg}: any) => {
                    if (code === '200') {
                        dispatch(initDictTypeTree(pageProps));
                    } else {
                        // message.error(i18n.t(`common:${modalType === 'add' ? 'addFail' : 'updateFail'}`));
                        logError(msg || data.message);
                    }

                    resolve(true);
                })
                .catch((error: any) => {
                    logError(error);
                    reject(error);
                });
        });
