import React, {FC} from 'react';
import {Collapse, CollapseProps} from 'antd';
import styles from './styles.module.scss';

interface CustomProps extends CollapseProps {}

const CustomCollapse: FC<CustomProps> = (props) => {
    const {children, className, ...args} = props;
    return (
        <Collapse className={`${styles.view} ${className || ''}`} {...args}>
            {children}
        </Collapse>
    );
};

export default CustomCollapse;
