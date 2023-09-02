/*
 * 门户icon组件，统一disabled样式， 统一样式使用
 * @Author: sun.t
 * @Date: 2022-01-22 14:50:55
 * @Last Modified by: sun.t
 * @Last Modified time: 2022-03-28 22:33:40
 */
import React, {FC} from 'react';
import styles from './styles.module.scss';

interface PortalIconProps {
    iconClass: string;
    className?: string;
    title?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

const PortalIcon: FC<PortalIconProps> = ({
    className,
    iconClass,
    style = {},
    title = '',
    disabled = false,
    onClick,
}) => (
    <span
        title={title}
        style={style}
        className={`portal-iconfont ${iconClass} ${className} ${
            disabled ? styles.disabled : ''
        }`}
        onClick={(e) => {
            !disabled && onClick && onClick(e);
        }}
    />
);

export default PortalIcon;
