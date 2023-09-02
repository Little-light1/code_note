import React, {useCallback} from 'react';
import {Select} from 'antd';
import {Locals} from '@common/constant/locale';
import {useAction} from '@gwaapp/ease';
import styles from './styles.module.scss';

type ILocals = typeof Locals;
type TLocals = keyof ILocals;

const Language = ({value, onChange, i18n}: any) => {
    const {handlers} = useAction();

    const {trigger} = handlers;

    const changeLanguage = useCallback(
        (v: any) => {
            i18n.changeLanguage(v);

            trigger('changeLanguage', v);

            onChange(v);
        },
        [i18n, onChange, trigger],
    );
    return (
        <Select
            className={styles.selLan}
            onChange={changeLanguage}
            value={value}
            style={{width: 94}}
            bordered={false}
            defaultValue={'zh'}
        >
            {Object.keys(Locals).map((key) => {
                const title = Locals[key as TLocals];
                return (
                    <Select.Option key={key} value={key}>
                        {title}
                    </Select.Option>
                );
            })}
        </Select>
    );
};

export default Language;
