import {DICT_TYPES} from '@common/constant';
import {
    updateDictClass,
    updateDictItem,
    addDictClass,
    addDictItem,
} from '@services/data_dict_config';
import {boolean2Int} from '@utils/boolean';
import {logError, report} from '@/common/utils/clientAction';
import {AppThunk} from '@/app/runtime';
import {PageProps} from '@gwaapp/ease';
import {i18nIns} from '@/app/i18n';
import {message} from 'antd';
import {initDictTypeTree} from '../actions';
import {LogActionID} from '../types';

const {t} = i18nIns;

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
            const {id} = pageProps;
            let service: ((props: any) => Promise<any>) | null = null;
            let submitValues = {...values};
            let action: any = null;
            if (!parentNode) return;

            if (modalType === 'add') {
                // 字典值
                if (currentType === DICT_TYPES.item.key) {
                    action = {
                        id: LogActionID.AddDict,
                        module: id,
                        desc: t('新增字典项：{{name}}', {
                            name: submitValues.dictdataName,
                        }),
                    };
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
                    action = {
                        id: LogActionID.AddCategory,
                        module: id,
                        desc: t('新增分类：{{name}}', {
                            name: submitValues.dicttypeName,
                        }),
                    };
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
                    action = {
                        id: LogActionID.ModifyDict,
                        module: id,
                        desc: t('编辑字典项：{{name}}', {
                            name: selectedNode.dictdataName,
                        }),
                    };
                    service = updateDictItem;
                    submitValues.dictdataId = selectedNode.dictdataId; // 如果父级变更, 这里只存在调整分类的情况, 如果需要调整父节点是字典, 那需要多传dictdataParentid

                    if (parentTypeNode.dicttypeId !== selectedNode.dicttypeId) {
                        submitValues.dicttypeId = parentTypeNode.dicttypeId;
                    } else {
                        submitValues.dicttypeId = selectedNode.dicttypeId;
                    } // 处理

                    submitValues.dictdataIsenabled = boolean2Int(
                        submitValues.dictdataIsenabled,
                    );
                } // 分类
                else {
                    action = {
                        id: LogActionID.ModifyCategory,
                        module: id,
                        desc: t('编辑分类：{{name}}', {
                            name: selectedNode.dicttypeName,
                        }),
                    };
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
                        message.info(t('保存成功'));
                        action && report.success(action);
                        dispatch(initDictTypeTree(pageProps));
                        resolve(true);
                    } else {
                        action && report.fail(action); // message.error(t(`common:${modalType === 'add' ? 'addFail' : 'updateFail'}`));

                        logError(msg || data.message);
                        resolve(false);
                    }
                })
                .catch((error: any) => {
                    action && report.fail(action);
                    logError(error);
                    reject(error);
                });
        });
