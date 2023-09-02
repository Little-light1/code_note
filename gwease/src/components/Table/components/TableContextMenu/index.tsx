import React, {FC, Key, PureComponent} from 'react';
import {createPortal} from 'react-dom';
import {ContextMenu, MenuItem, SubMenu, ContextMenuProps} from 'react-contextmenu';
import {CheckOutlined} from '@ant-design/icons';
import './styles.scss';
import {Column, Columns} from '../../types';
import {useTable} from '../../hooks';
import {useLocale} from '../../../Runtime/App/LocaleProvider';
import {log} from '../../../../utils/log';

type MenuType = 'hide' | 'visible';

interface TableContextMenuProps extends ContextMenuProps {
    // i18n?: typeof DEFAULT_I18N;
    trigger: {
        canHide: boolean;
        dataKey: Key;
        visibleKeys: Key[];
        attributes: Record<any, string>;
        onContextMenu: (e: any, data: {type: MenuType; column?: Column}, target: any) => void;
    };
    columns: Columns;
}

// const DEFAULT_I18N = {
//   hide: "隐藏",
//   visible: "设置显示列",
// };

const TableContextMenu: FC<TableContextMenuProps> = (props) => {
    const {id, trigger, columns} = props;
    const {canHide} = trigger || {};
    const {visibleKeys = [], onContextMenu} = useTable();

    const locale = useLocale('Table');

    return (
        <ContextMenu
            id={id}
            onHide={(event) => {
                log({module: 'Modal', sketch: '隐藏菜单'});
                console.log(event);
            }}
            onShow={(event) => {
                log({module: 'Modal', sketch: '显示菜单'});
                console.log(event);
            }}>
            {/* 隐藏 */}
            <MenuItem data={{type: 'hide'}} disabled={!canHide} onClick={onContextMenu}>
                {locale.hide || '隐藏'}
            </MenuItem>
            <SubMenu title={locale.setDisplayCols || '设置显示列'} className="react-sub-contextmenu">
                {columns.map((column) => (
                    <MenuItem
                        preventClose
                        key={column.dataIndex}
                        onClick={onContextMenu}
                        disabled={typeof column.canHide !== 'undefined' ? !column.canHide : false}
                        data={{type: 'visible', column}}>
                        <span className="ease-contextmenu-visible-icon">
                            {visibleKeys.includes(column.dataIndex) ? <CheckOutlined /> : null}
                        </span>
                        {column.title}
                    </MenuItem>
                ))}
            </SubMenu>
        </ContextMenu>
    );
};

class Wrapper extends PureComponent<TableContextMenuProps> {
    render() {
        const el = document.getElementsByTagName('body')[0];
        return el ? createPortal(<TableContextMenu {...this.props} />, el) : null;
    }
}

export default Wrapper;
