/*
 * @Author: shimmer
 * @Date: 2022-05-30 09:18:00
 * @LastEditors: zhangzhen
 * @LastEditTime: 2022-08-24 14:54:18
 * @Description:
 *
 */
import {FormInstance} from 'antd';

export enum FormItemType {
    Select = 'select',
    TreeSelect = 'treeSelect',
    Input = 'input',
    RangePicker = 'rangePicker',
    DatePicker = 'datePicker',
}
export enum FormActionItemType {
    Submit = 'submit',
    Reset = 'reset',
    Export = 'export',
    Custom = 'custom',
}
export interface FormPropsAttr {
    config: FormAttr;
}
export interface FormAttr {
    key: string;
    formItem: FieldItem[];
    actionItem?: ActionItem[];
    requiredMark?: boolean;
    initialValues?: any;
    layout?: 'horizontal' | 'vertical' | 'inline';
    onFinish: (values: any, form: FormInstance<any>) => void;
    onValuesChange?: (changedValues: any, allValues: any) => void;
}
export interface FormItem {
    key: string;
    className?: string | undefined;
}
export interface FieldItem extends FormItem {
    label: string; // type: 'select' | 'treeSelect' | 'input' | 'rangePicker',

    type: FormItemType;
    defaultValue?: any;
    style?: any;
    width?: string | number;
    placeholder?: string;
    option?: OptionItem[];
    rules?: any[];
    value?: any;
    format?: string;
    picker?: 'week' | 'date' | 'month' | 'year' | 'quarter';
    disabled?: boolean;
    disabledDate?: (currentDate: any) => boolean;
    allowClear?: boolean;
    TreeSelectAttr?: TreeSelectAttr; // 树形选择属性

    onChange?: (value: any, form: FormInstance<any>) => void;
    onDatePickerChange?: (
        date: any,
        dateString: any,
        form: FormInstance<any>,
    ) => void;
}
export interface ActionItem extends FormItem {
    actionType: FormActionItemType;
    text?: string;
    icon?: any;
    disabled?: boolean;
    action?: {
        id: string;
        module: string;
        position: any[];
        action: 'add' | 'modify' | 'delete' | 'query' | 'export' | 'import';
        wait?: boolean;
    };
    onClick?: (event?: any) => void;
}
interface OptionItem {
    text: string;
    value: string | number;
}
interface TreeSelectAttr {
    treeData: any[];
    treeCheckable?: boolean | string; // 是否显示选择框

    treeDefaultExpandAll?: boolean; // 默认展开所有树节点

    dropdownStyle?: any; // 下拉菜单的样式,

    multiple?: boolean; // 支持多选

    fieldNames?: FieldNames; // 参数

    maxTagPlaceholder?: string;
    placeholder?: string;
    maxTagCount?: number;
    listHeight?: number | undefined;
}
interface FieldNames {
    label: string;
    value: string;
}
