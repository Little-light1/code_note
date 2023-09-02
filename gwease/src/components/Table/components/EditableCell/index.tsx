/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
import React, {CSSProperties, FC, memo, useMemo} from 'react';
import {Tooltip} from 'antd';
import {Column, RenderEdit, OnCellClick, I18n, EditStatus, EditState} from '../../types';
import {useEditContext} from '../EditWrapper';
import EditingCell from './EditingCell';
import './styles.scss';
import {useTable} from '../../hooks/useTable';
import {useLocale} from '../../../Runtime/App/LocaleProvider';

interface CellProps<RecordType = any> {
    text: any;
    editable: boolean;
    record: RecordType;
    rowIndex: number;
    column: Column;
    className: string;
    style: CSSProperties;
    title: string;
    onCellClick: OnCellClick<RecordType>;
    renderEdit: RenderEdit<RecordType>;
    onMouseEnter: React.MouseEventHandler;
    onMouseLeave: React.MouseEventHandler;
}

interface MemoCellProps<RecordType = any> extends Omit<CellProps<RecordType>, 'onMouseEnter' | 'onMouseLeave' | 'style'> {
    i18n?: I18n;
    // editRowData?: EditRowStatus;
    getEditStatus: () => EditStatus;
    // errors?: string[];
    // value?: any;
    status?: EditState;
    style?: CSSProperties;
    children?: any;
}

// const EMPTY: EditRowStatus = {};

const MemoCell: FC<MemoCellProps> = memo(
    ({
        text,
        editable,
        record,
        column,
        rowIndex,
        onCellClick,
        style,
        children,
        className,
        // style,
        // onMouseEnter,
        // onMouseLeave,

        getEditStatus,
        // value,
        status,
        // errors,
        i18n,

        ...props
    }) => {
        const {render, dataIndex, align, width} = column;
        // const { value, status, errors } = editRowData[dataIndex] || {};

        // if (editable && status === "editing" && renderEdit) {
        //   return <EditingCell {...props} getEditStatus={getEditStatus} column={column} rowIndex={rowIndex} text={text} record={record} />;
        // }

        const locale = useLocale('Table');

        const editRowData = getEditStatus()[rowIndex] || {};
        const {errors = [], value} = editRowData[dataIndex] || {};

        const showTooltip = (errors && errors.length) || status === 'edited';

        // const cellChildren = status === "edited" ? (render ? render(value, record, rowIndex) : value) : children;

        const cellEditedChildren = useMemo(() => (render ? render(value, record, rowIndex) : value), [record, render, rowIndex, value]);

        const cellOriginalChildren = useMemo(() => (render ? render(text, record, rowIndex) : text), [record, render, rowIndex, text]);

        const td = (
            <td
                style={style || {width, textAlign: align}}
                className={`${errors && errors.length ? 'ease-table-cell-error' : ''} ${
                    status === 'edited' ? 'ease-table-cell-edited' : ''
                } ${editable ? 'ease-table-cell-editable' : ''} ${className}`}
                onClick={(e) => {
                    // TODO:这里不能冒泡，否则按钮点击都会触发提交 & 操作列会产生冲突
                    e.stopPropagation();
                    if (editable) {
                        onCellClick(e, {rowIndex, column, record, text});
                    }
                }}
                // onMouseEnter={onMouseEnter}
                // onMouseLeave={onMouseLeave}
                {...props}>
                {status === 'edited' ? <div className="ease-table-cell-edited-icon" /> : null}

                {status === 'edited' ? cellEditedChildren : cellOriginalChildren}
            </td>
        );

        if (showTooltip) {
            return (
                <Tooltip
                    prefixCls="ease-table-cell-tooltip"
                    placement="bottom"
                    arrowContent={null}
                    title={
                        <>
                            {errors && errors.length ? (
                                <div className="ease-table-cell-tooltip-error-info">
                                    {errors.map((error) => (
                                        <span key={error}>{error}</span>
                                    ))}
                                </div>
                            ) : null}
                            <div>
                                {status === 'edited'
                                    ? `${i18n?.cell?.original ?? (locale.originalData || '原始数据')}: ${
                                          String(cellOriginalChildren) === '0' ? 0 : cellOriginalChildren || '--'
                                      }`
                                    : render
                                    ? render(text, record, rowIndex)
                                    : text}
                            </div>
                        </>
                    }>
                    {td}
                </Tooltip>
            );
        }

        return td;
    },
);

const CellContainer: FC<CellProps> = ({onMouseEnter, onMouseLeave, children, style, ...props}) => {
    const {rowIndex, column, text, record} = props;
    const {i18n} = useTable();
    const {editStatus, getEditStatus, depUpdatedCells} = useEditContext();
    const editRowData = editStatus[rowIndex] || {};
    const depUpdatedRowData = depUpdatedCells[rowIndex] || {};

    if (typeof column === 'undefined') {
        return <td {...props} />;
    }

    const {dataIndex, renderEdit} = column;
    const {status} = editRowData[dataIndex] || {};
    const depUpdatedTimestamp = depUpdatedRowData[dataIndex];

    if (status === 'editing' && renderEdit) {
        return (
            <EditingCell
                {...props}
                getEditStatus={getEditStatus}
                column={column}
                rowIndex={rowIndex}
                text={text}
                record={record}
                updateTimestamp={depUpdatedTimestamp}
            />
        );
    }

    // style & children 都会造成频繁渲染
    return <MemoCell i18n={i18n} getEditStatus={getEditStatus} status={status} {...props} />;
};

export default CellContainer;
