/*
 * @Author: sun.t
 * @Date: 2021-06-30 09:21:32
 * @Last Modified by: sun.t
 * @Last Modified time: 2021-11-17 22:57:13
 */
import {useReducer, useEffect} from 'react';
import {tree2Flat} from '../utils';
import {Item} from './types';

const SearchAction = 'search';
const InitAction = 'init';
const ExpandAction = 'expand';
const UpdateExpandedKeysAction = 'updateExpandedKeys';
const UpdateDefaultAction = 'updateDefault';
type CustomObject = {
    [key: string]: any;
};
export const ActionTypes: {
    SearchAction: typeof SearchAction;
    InitAction: typeof InitAction;
    ExpandAction: typeof ExpandAction;
    UpdateExpandedKeysAction: typeof UpdateExpandedKeysAction;
    UpdateDefaultAction: typeof UpdateDefaultAction;
} = {
    SearchAction,
    InitAction,
    ExpandAction,
    UpdateExpandedKeysAction,
    UpdateDefaultAction,
};
interface InitialState {
    searchValue: string;
    expandedKeys: string[];
    defaultExpandedKeys: string[];
    defaultHiddenKeys: string[];
    treeDataMap: {
        [key: string]: Item;
    };
    autoExpandParent: boolean;
    hiddenKeys: string[];
}
type Action = {
    type:
        | typeof SearchAction
        | typeof InitAction
        | typeof ExpandAction
        | typeof UpdateExpandedKeysAction
        | typeof UpdateDefaultAction;
    payload: CustomObject;
};
type SearchTreeReducer = React.Reducer<InitialState, Action>;
const initialState: InitialState = {
    searchValue: '',
    expandedKeys: [],
    treeDataMap: {},
    autoExpandParent: false,
    defaultExpandedKeys: [],
    defaultHiddenKeys: [],
    hiddenKeys: [],
};

const reducer: SearchTreeReducer = (state, action) => {
    switch (action.type) {
        case SearchAction: {
            const {searchValue, autoExpandParent} = action.payload;
            let {expandedKeys} = action.payload;
            let {hiddenKeys} = action.payload;
            const {defaultExpandedKeys, defaultHiddenKeys} = state; // 如果无展开项，则使用默认展开项

            if (!expandedKeys.length) {
                expandedKeys = defaultExpandedKeys;
            }

            if (!hiddenKeys.length) {
                hiddenKeys = defaultHiddenKeys;
            }

            return {
                ...state,
                searchValue,
                expandedKeys,
                hiddenKeys,
                autoExpandParent,
            };
        }

        case InitAction: {
            const {treeData, childrenPropName, keyPropName} = action.payload;
            const treeDataMap = tree2Flat({
                treeData,
                childrenPropName,
                keyPropName,
            });
            return {...state, treeDataMap, autoExpandParent: false};
        }

        case ExpandAction: {
            return {
                ...state,
                expandedKeys: action.payload.expandedKeys,
                autoExpandParent: action.payload.autoExpandParent,
            };
        }

        case UpdateExpandedKeysAction: {
            return {...state, expandedKeys: action.payload.expandedKeys};
        }

        case UpdateDefaultAction: {
            return {
                ...state,
                defaultExpandedKeys: action.payload.defaultExpandedKeys,
            };
        }

        default: {
            throw new Error();
        }
    }
};

interface Props {
    defaultExpandedKeys?: string[];
    defaultHiddenKeys?: string[];
    treeData: Item[];
    childrenPropName: string;
    keyPropName: string;
    expandedKeys?: string[];
}
export default function ({
    defaultExpandedKeys,
    defaultHiddenKeys,
    treeData,
    childrenPropName,
    keyPropName,
    expandedKeys,
}: Props) {
    const [state, dispatch] = useReducer<SearchTreeReducer>(reducer, {
        ...initialState,
        expandedKeys: defaultExpandedKeys || [],
        defaultExpandedKeys: defaultExpandedKeys || [],
        defaultHiddenKeys: defaultHiddenKeys || [],
        hiddenKeys: defaultHiddenKeys || [],
    }); // treeData变化重新初始化内部数据

    useEffect(() => {
        dispatch({
            type: InitAction,
            payload: {
                treeData,
                childrenPropName,
                keyPropName,
            },
        });
    }, [treeData, childrenPropName, keyPropName]); // expandedKeys受控场景需要回归到内部状态

    useEffect(() => {
        if (typeof expandedKeys !== 'undefined') {
            dispatch({
                type: UpdateExpandedKeysAction,
                payload: {
                    expandedKeys,
                },
            });
        }
    }, [expandedKeys]); // defaultExpandedKeys需要被更新到内部状态

    useEffect(() => {
        const payload = {} as CustomObject;

        if (typeof defaultExpandedKeys !== 'undefined') {
            payload.defaultExpandedKeys = defaultExpandedKeys;
        }

        if (typeof defaultHiddenKeys !== 'undefined') {
            payload.defaultHiddenKeys = defaultHiddenKeys;
        }

        dispatch({
            type: UpdateDefaultAction,
            payload,
        });
    }, [defaultExpandedKeys, defaultHiddenKeys]);
    return {
        state,
        dispatch,
    };
}
